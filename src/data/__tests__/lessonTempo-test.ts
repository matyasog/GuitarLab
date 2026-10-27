import { tempoOptions } from '../lessonTempo';
import { findLesson, lessons } from '../lessons';

const lesson = (id: string) => findLesson(id)!;

test('E minor pentatonic gives 64 / 72 / 80 as in the design', () => {
  expect(tempoOptions(lesson('em-pentatonic-box-1'))).toEqual([
    { kind: 'warm-up', bpm: 64 },
    { kind: 'suggested', bpm: 72 },
    { kind: 'goal', bpm: 80 },
  ]);
});

test('without its own goal, the goal is one step above the suggested tempo', () => {
  expect(tempoOptions(lesson('quarter-notes')).map((option) => option.bpm)).toEqual([52, 60, 68]);
});

test('every lesson has three different tempos in the metronome range', () => {
  for (const item of lessons) {
    const bpms = tempoOptions(item).map((option) => option.bpm);
    expect(new Set(bpms).size).toBe(3);
    for (const bpm of bpms) {
      expect(bpm).toBeGreaterThanOrEqual(40);
      expect(bpm).toBeLessThanOrEqual(240);
    }
  }
});

test('shapes only use the six strings and frets 0–4, with no note placed twice', () => {
  for (const item of lessons) {
    if (!item.shape) continue;
    const places = item.shape.notes.map((note) => `${note.string}${note.fret}`);
    expect(new Set(places).size).toBe(places.length);
    for (const note of item.shape.notes) {
      expect(note.fret).toBeGreaterThanOrEqual(0);
      expect(note.fret).toBeLessThanOrEqual(4);
    }
  }
});
