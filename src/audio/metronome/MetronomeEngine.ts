// The metronome's sound engine (decision D1). Screens only use this interface, so a more
// precise engine for the Android dev build (react-native-audio-api) can replace the Expo Go one.

export type TimeSignature = '4/4' | '3/4' | '2/4' | '6/8';
export type Subdivision = 'quarter' | 'eighth' | 'triplet' | 'sixteenth';
export type ClickSound = 'click' | 'woodblock' | 'hihat';

export type MetronomeConfig = {
  bpm: number; // 40–240
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  sound: ClickSound;
};

export type Tick = {
  bar: number; // 0-based bar count since start
  beat: number; // 0-based beat in the bar (0 = accented beat 1)
  sub: number; // 0 = on the beat, > 0 = subdivision click
  plannedTime: number; // engine clock (ms) when the click sounds
  time: number; // engine clock (ms) when the engine reported it (a few ms later)
};

export interface MetronomeEngine {
  load(): Promise<void>; // prepare the sounds
  start(config: MetronomeConfig): void;
  // Changes while playing. The engine decides how: the Expo Go engine swaps in a new click
  // track after a short moment and starts again at beat 1.
  update(config: Partial<MetronomeConfig>): void;
  stop(): void;
  onTick(listener: (tick: Tick) => void): () => void; // returns unsubscribe
  now(): number; // the engine's clock (ms)
  dispose(): void;
}

export const minBpm = 40;
export const maxBpm = 240;
