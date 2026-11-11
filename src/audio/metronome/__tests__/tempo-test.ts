import type { MetronomeConfig } from '../MetronomeEngine';
import { clickPeriodMs } from '../scheduler';
import { addTap, tempoFromTaps } from '../tapTempo';
import { tempoName } from '../tempoNames';

test('tempo names match the design examples and change at the range edges', () => {
  expect(tempoName(72)).toBe('Adagio');
  expect(tempoName(184)).toBe('Presto');
  expect(tempoName(40)).toBe('Largo');
  expect(tempoName(59)).toBe('Largo');
  expect(tempoName(60)).toBe('Larghetto');
  expect(tempoName(120)).toBe('Allegro');
  expect(tempoName(240)).toBe('Prestissimo');
});

test('tap tempo: the average gap of the last 4 taps', () => {
  let taps: number[] = [];
  taps = addTap(taps, 0);
  expect(tempoFromTaps(taps)).toBeNull();
  taps = addTap(taps, 500);
  expect(tempoFromTaps(taps)).toBe(120);
  taps = addTap(addTap(addTap(taps, 1000), 1500), 2250);
  // Only 500, 1000, 1500, 2250 count: gaps average 583 ms = 103 BPM.
  expect(taps).toEqual([500, 1000, 1500, 2250]);
  expect(tempoFromTaps(taps)).toBe(103);
});

test('tap tempo: a long pause starts over, and the result stays within 40–240', () => {
  expect(addTap([0, 500], 3000)).toEqual([3000]);
  expect(tempoFromTaps([0, 100])).toBe(240);
  expect(tempoFromTaps([0, 1900])).toBe(40);
});

test('triplets are three clicks per beat', () => {
  const config: MetronomeConfig = { bpm: 60, timeSignature: '4/4', subdivision: 'triplet', sound: 'click' };
  expect(clickPeriodMs(config)).toBeCloseTo(333.33, 1);
});
