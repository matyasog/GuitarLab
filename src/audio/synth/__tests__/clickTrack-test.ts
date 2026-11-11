import type { MetronomeConfig } from '../../metronome/MetronomeEngine';
import { renderClickTrack } from '../clickTrack';

const base: MetronomeConfig = { bpm: 120, timeSignature: '4/4', subdivision: 'quarter', sound: 'click' };
// Tiny fake sounds, so a click is easy to find in the track: normal = 1, accent = 2.
const click = new Int16Array([1, 1, 1]);
const accent = new Int16Array([2, 2, 2]);
const rate = 1000; // 1 sample = 1 ms keeps the numbers readable

const starts = (pcm: Int16Array) =>
  Array.from(pcm.keys()).filter((index) => pcm[index] !== 0 && (index === 0 || pcm[index - 1] === 0));

test('120 BPM in 4/4: a click every 500 ms, the first of each bar accented, about 30 s long', () => {
  const track = renderClickTrack(base, click, accent, rate);
  expect(track.bars).toBe(15);
  expect(track.durationMs).toBe(30000);

  const positions = starts(track.pcm);
  expect(positions).toHaveLength(60);
  expect(positions.slice(0, 5)).toEqual([0, 500, 1000, 1500, 2000]);
  expect(positions.map((position) => track.pcm[position]).slice(0, 5)).toEqual([2, 1, 1, 1, 2]);
});

test('positions do not drift at tempos that do not divide evenly', () => {
  // 70 BPM = 857.142… ms per beat: the last click must still be within half a sample.
  const track = renderClickTrack({ ...base, bpm: 70 }, click, accent, rate);
  const positions = starts(track.pcm);
  const last = positions.length - 1;
  expect(Math.abs(positions[last] - (last * 60000) / 70)).toBeLessThanOrEqual(0.5);
  // The loop ends exactly one beat after the last click, so the seam keeps the tempo.
  expect(Math.abs(track.pcm.length - positions.length * (60000 / 70))).toBeLessThanOrEqual(0.5);
});

test('subdivisions and other bars: 6/8 with eighths has 12 clicks per bar', () => {
  const track = renderClickTrack({ ...base, timeSignature: '6/8', subdivision: 'eighth' }, click, accent, rate);
  const positions = starts(track.pcm);
  const accents = positions.filter((position) => track.pcm[position] === 2);
  expect(positions.length / accents.length).toBe(12);
  expect(positions[1]).toBe(250);
});

test('the slowest tempo still gives at least one whole bar', () => {
  const track = renderClickTrack({ ...base, bpm: 40, timeSignature: '6/8' }, click, accent, rate);
  expect(track.bars).toBeGreaterThanOrEqual(1);
  expect(track.durationMs % 9000).toBe(0); // 6 beats × 1.5 s
});
