import { clampBpm } from './scheduler';

// TAP tempo: the tempo is the average gap between your last taps (rule chosen 2026-11-11).

// A pause longer than this starts a new count.
export const tapResetMs = 2000;
// Only the last 4 taps count, so the tempo follows you if you speed up or slow down.
export const tapsUsed = 4;

// Adds a tap (time in ms) and returns the taps that still count.
export function addTap(taps: number[], time: number): number[] {
  const last = taps[taps.length - 1];
  if (last !== undefined && time - last > tapResetMs) {
    return [time];
  }
  return [...taps, time].slice(-tapsUsed);
}

// The tempo of the taps, or null while there is only one tap.
export function tempoFromTaps(taps: number[]): number | null {
  if (taps.length < 2) {
    return null;
  }
  const averageGapMs = (taps[taps.length - 1] - taps[0]) / (taps.length - 1);
  return clampBpm(60000 / averageGapMs);
}
