import type { MetronomeConfig } from '../metronome/MetronomeEngine';
import { beatsPerBar, clickPeriodMs, clicksPerBeat } from '../metronome/scheduler';
import { sampleRate } from './wav';

// Renders the metronome as one piece of audio: silence with a click copied in at every beat.
// The phone then plays (and loops) this track, so the audio hardware keeps the time, exactly to
// the sample, and JavaScript is not involved in the timing at all (decision D1, option B).

export type ClickTrack = {
  pcm: Int16Array;
  durationMs: number;
  bars: number;
};

// The track is a whole number of bars, about this long. Longer = fewer loop seams,
// shorter = faster to make after a tempo change.
export const targetLoopSeconds = 30;

export function renderClickTrack(
  config: MetronomeConfig,
  click: Int16Array,
  accentClick: Int16Array,
  rate = sampleRate,
): ClickTrack {
  const clicksPerBar = beatsPerBar[config.timeSignature] * clicksPerBeat[config.subdivision];
  const periodMs = clickPeriodMs(config);
  const periodSamples = (rate * periodMs) / 1000;
  const bars = Math.max(1, Math.round((targetLoopSeconds * 1000) / (clicksPerBar * periodMs)));
  const totalClicks = bars * clicksPerBar;

  // A new Int16Array is all zeros = silence.
  const pcm = new Int16Array(Math.round(totalClicks * periodSamples));
  for (let n = 0; n < totalClicks; n += 1) {
    // Same drift-free rule as the scheduler: every position comes from n, never from adding up.
    const offset = Math.round(n * periodSamples);
    const sound = n % clicksPerBar === 0 ? accentClick : click;
    pcm.set(sound.subarray(0, Math.min(sound.length, pcm.length - offset)), offset);
  }

  return { pcm, durationMs: (pcm.length / rate) * 1000, bars };
}
