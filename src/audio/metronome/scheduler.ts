import { maxBpm, minBpm, type MetronomeConfig, type Subdivision, type TimeSignature } from './MetronomeEngine';

// Pure timing maths for the metronome, with no sound and no timers, so it can be unit-tested.
// The engine asks it "which clicks are due at this time?". The time can be any clock in ms:
// the Expo Go engine passes the position of its audio track (see ExpoAudioEngine).
//
// Drift-free rule (D1): click times are never added up one after another. Each click's time is
// worked out from a fixed anchor: time(n) = anchorTime + n × clickPeriod. A late timer can make
// one click late, but the next one is planned from the anchor again, so errors never accumulate.

export type PlannedClick = {
  bar: number;
  beat: number;
  sub: number;
  plannedTime: number;
};

export const beatsPerBar: Record<TimeSignature, number> = { '4/4': 4, '3/4': 3, '2/4': 2, '6/8': 6 };
export const clicksPerBeat: Record<Subdivision, number> = { quarter: 1, eighth: 2, sixteenth: 4 };

export function clampBpm(bpm: number): number {
  return Math.min(maxBpm, Math.max(minBpm, Math.round(bpm)));
}

// Time between two clicks (including subdivision clicks) in ms.
export function clickPeriodMs(config: MetronomeConfig): number {
  return 60000 / clampBpm(config.bpm) / clicksPerBeat[config.subdivision];
}

export class MetronomeScheduler {
  private config: MetronomeConfig;
  private pending: MetronomeConfig | null = null;
  // Anchor: the time of click number 0 since the last tempo/meter change.
  private anchorTime: number;
  private count = 0;
  private bar = 0;
  private beat = 0;
  private sub = 0;

  constructor(config: MetronomeConfig, startTime: number) {
    this.config = config;
    this.anchorTime = startTime;
  }

  // Changes take effect on the next beat (not in the middle of a subdivision).
  update(changes: Partial<MetronomeConfig>) {
    this.pending = { ...(this.pending ?? this.config), ...changes };
  }

  get currentConfig(): MetronomeConfig {
    return this.pending ?? this.config;
  }

  // When the next click should sound (engine clock, ms).
  nextTime(): number {
    return this.anchorTime + this.count * clickPeriodMs(this.config);
  }

  // All clicks that are due at `now`. A click that is late by more than half a period is
  // skipped instead of played, so a busy phone never plays a burst of catch-up clicks.
  takeDue(now: number): { due: PlannedClick[]; skipped: number } {
    const due: PlannedClick[] = [];
    let skipped = 0;
    while (true) {
      // A pending change starts on a beat, never in the middle of a subdivision.
      if (this.pending && this.sub === 0) {
        this.applyPending();
      }
      const plannedTime = this.nextTime();
      if (plannedTime > now) {
        break;
      }
      if (now - plannedTime > clickPeriodMs(this.config) / 2) {
        skipped += 1;
      } else {
        due.push({ bar: this.bar, beat: this.beat, sub: this.sub, plannedTime });
      }
      this.advance();
    }
    return { due, skipped };
  }

  private applyPending() {
    // New anchor at this beat; the clicks after it use the new period.
    this.anchorTime = this.nextTime();
    this.count = 0;
    this.config = this.pending!;
    this.pending = null;
    // A shorter bar (e.g. 4/4 → 2/4) restarts at beat 1 if we are past its end.
    if (this.beat >= beatsPerBar[this.config.timeSignature]) {
      this.beat = 0;
      this.bar += 1;
    }
  }

  private advance() {
    this.count += 1;
    this.sub += 1;
    if (this.sub < clicksPerBeat[this.config.subdivision]) {
      return;
    }
    this.sub = 0;
    this.beat += 1;
    if (this.beat >= beatsPerBar[this.config.timeSignature]) {
      this.beat = 0;
      this.bar += 1;
    }
  }
}
