import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { File, Paths } from 'expo-file-system';
import { AppState, type NativeEventSubscription } from 'react-native';

import { renderClickTrack } from '../synth/clickTrack';
import { synthClick } from '../synth/clicks';
import { encodeWavPcm16, floatToPcm16 } from '../synth/wav';
import type { ClickSound, MetronomeConfig, MetronomeEngine, Tick } from './MetronomeEngine';
import { MetronomeScheduler, clampBpm } from './scheduler';

// Metronome engine that works in Expo Go (decision D1, option B: pre-rendered loop).
//
// expo-audio plays through the system media player, which can't start short sounds on time
// (option A, one player per click, dropped and delayed clicks on the iPhone). So instead:
// - Sound: the clicks for ~30 s are rendered into one WAV file (renderClickTrack) and played
//   in a loop. The audio hardware keeps the time; JavaScript is not involved in it.
// - Ticks (for the pendulum, lamps, …): every ~10 ms we read how far the track has played and
//   ask MetronomeScheduler which clicks were passed. The audio is the master clock, so what
//   you see can never drift away from what you hear.
// - A tempo, bar or sound change needs a new track: it is rendered and swapped in, starting
//   again at beat 1.
// - It stops when the app goes to the background (decided 2026-10-26).

const sounds: ClickSound[] = ['click', 'woodblock', 'hihat'];
const pollEveryMs = 10;
// Wait this long after the last change before making a new track (e.g. while tapping +1).
const restartDelayMs = 150;

export type EngineDebugInfo = {
  // How far the audio has fallen behind the phone's clock since it started (ms).
  // It should stay near 0; a jump at a loop seam means the loop isn't gapless.
  driftMs: number;
  loops: number;
  trackMs: number;
};

export class ExpoAudioEngine implements MetronomeEngine {
  private clicks = new Map<string, Int16Array>();
  private listeners = new Set<(tick: Tick) => void>();
  // What should be playing; null when stopped.
  private config: MetronomeConfig | null = null;
  private player: AudioPlayer | null = null;
  private scheduler: MetronomeScheduler | null = null;
  private trackMs = 0;
  private loops = 0;
  private lastTrackPositionMs = 0;
  private clockOffsetMs: number | null = null;
  private driftMs = 0;
  // Goes up on every start / change / stop, so slow work for an older request can be dropped.
  private requestId = 0;
  // Tracks are prepared one after another, never two at once.
  private work: Promise<void> = Promise.resolve();
  private fileIndex = 0;
  private pollTimer: ReturnType<typeof setTimeout> | null = null;
  private restartTimer: ReturnType<typeof setTimeout> | null = null;
  private appState: NativeEventSubscription | null = null;

  now(): number {
    // Monotonic clock in ms: never jumps when the phone's time changes.
    return performance.now();
  }

  async load(): Promise<void> {
    if (this.clicks.size > 0) {
      return;
    }
    // Play even with the ring/silent switch on, and mix with other apps' audio.
    await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false });
    for (const sound of sounds) {
      for (const accent of [false, true]) {
        this.clicks.set(clickKey(sound, accent), floatToPcm16(synthClick(sound, accent)));
      }
    }
  }

  start(config: MetronomeConfig): void {
    this.stop();
    this.config = { ...config, bpm: clampBpm(config.bpm) };
    this.appState = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        this.stop();
      }
    });
    this.requestTrack();
  }

  update(changes: Partial<MetronomeConfig>): void {
    if (!this.config) {
      return;
    }
    this.config = { ...this.config, ...changes };
    this.config.bpm = clampBpm(this.config.bpm);
    // The old track keeps playing until the new one is ready.
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
    }
    this.restartTimer = setTimeout(() => this.requestTrack(), restartDelayMs);
  }

  stop(): void {
    this.requestId += 1;
    this.config = null;
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
    }
    this.restartTimer = null;
    this.releasePlayer();
    this.appState?.remove();
    this.appState = null;
  }

  onTick(listener: (tick: Tick) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  dispose(): void {
    this.stop();
    this.clicks.clear();
    this.listeners.clear();
  }

  // For the timing test screen (src/app/dev/metronome-timing.tsx).
  getDebugInfo(): EngineDebugInfo {
    return { driftMs: this.driftMs, loops: this.loops, trackMs: this.trackMs };
  }

  private requestTrack() {
    const id = (this.requestId += 1);
    this.work = this.work
      .then(() => this.prepareTrack(id))
      .catch((error) => {
        if (__DEV__) {
          console.warn('Metronome: could not prepare the click track', error);
        }
      });
  }

  // Renders the track for the current config, loads it, then swaps it in for the old one.
  private async prepareTrack(id: number) {
    const config = this.config;
    const click = config && this.clicks.get(clickKey(config.sound, false));
    const accentClick = config && this.clicks.get(clickKey(config.sound, true));
    if (id !== this.requestId || !config || !click || !accentClick) {
      return;
    }

    const track = renderClickTrack(config, click, accentClick);
    // Two file names used in turn, so we never overwrite the file that is playing.
    const fileIndex = 1 - this.fileIndex;
    const file = new File(Paths.cache, `metronome-track-${fileIndex}.wav`);
    file.create({ overwrite: true });
    await file.write(encodeWavPcm16(track.pcm));

    const player = createAudioPlayer({ uri: file.uri });
    player.loop = true;
    await waitUntilLoaded(player);
    if (id !== this.requestId) {
      // Stopped or changed again while we were preparing.
      player.remove();
      return;
    }

    this.releasePlayer();
    this.fileIndex = fileIndex;
    this.player = player;
    this.scheduler = new MetronomeScheduler(config, 0);
    this.trackMs = track.durationMs;
    this.loops = 0;
    this.lastTrackPositionMs = 0;
    this.clockOffsetMs = null;
    this.driftMs = 0;
    player.play();
    this.poll();
  }

  private releasePlayer() {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
    }
    this.pollTimer = null;
    this.player?.pause();
    this.player?.remove();
    this.player = null;
    this.scheduler = null;
  }

  // Reads the audio position and reports the clicks that were passed since the last look.
  private poll = () => {
    const { player, scheduler } = this;
    if (!player || !scheduler) {
      return;
    }
    const now = this.now();
    const trackPositionMs = player.currentTime * 1000;
    // The position jumped back to the start: the track looped.
    if (trackPositionMs < this.lastTrackPositionMs - this.trackMs / 2) {
      this.loops += 1;
    }
    this.lastTrackPositionMs = trackPositionMs;
    // Total audio played since the start: the metronome's master clock.
    const positionMs = this.loops * this.trackMs + trackPositionMs;

    // Position 0 = the player hasn't actually started yet.
    if (positionMs > 0) {
      if (this.clockOffsetMs === null) {
        this.clockOffsetMs = now - positionMs;
      }
      this.driftMs = now - positionMs - this.clockOffsetMs;

      for (const click of scheduler.takeDue(positionMs).due) {
        // Convert from audio position to the engine clock: the click sounded
        // (positionMs - plannedTime) ms ago.
        const tick: Tick = { ...click, plannedTime: now - (positionMs - click.plannedTime), time: now };
        this.listeners.forEach((listener) => listener(tick));
      }
    }
    this.pollTimer = setTimeout(this.poll, pollEveryMs);
  };
}

function clickKey(sound: ClickSound, accent: boolean): string {
  return `${sound}${accent ? '-accent' : ''}`;
}

// The player opens its file in the background; wait (max 3 s) until it can play.
async function waitUntilLoaded(player: AudioPlayer): Promise<void> {
  const deadline = Date.now() + 3000;
  while (!player.isLoaded && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}
