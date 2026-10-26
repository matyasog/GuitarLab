import { buildLessonSections, countDone, lessonStatus, unlockText } from '../lessonSections';
import { findLesson, lessons, sampleProgress } from '../lessons';

const lesson = (id: string) => findLesson(id)!;

test('status comes from the best score: done from 90 %, otherwise in progress or up next', () => {
  expect(lessonStatus(lesson('quarter-notes'), { 'quarter-notes': { bestScore: 90 } })).toBe('done');
  expect(lessonStatus(lesson('quarter-notes'), { 'quarter-notes': { bestScore: 89 } })).toBe('in-progress');
  expect(lessonStatus(lesson('quarter-notes'), {})).toBe('up-next');
});

test('a lesson is locked until the required lesson reaches its unlock score', () => {
  const locked = lesson('am-pentatonic-5th'); // needs 80 % on E minor pentatonic, box 1
  expect(lessonStatus(locked, {})).toBe('locked');
  expect(lessonStatus(locked, { 'em-pentatonic-box-1': { bestScore: 79 } })).toBe('locked');
  expect(lessonStatus(locked, { 'em-pentatonic-box-1': { bestScore: 80 } })).toBe('up-next');
});

test('the sample scores give these sections', () => {
  const sections = buildLessonSections(lessons, sampleProgress, 'all');
  expect(sections.map((section) => [section.title, section.lessons.map((item) => item.id)])).toEqual([
    ['In progress', ['c-major-scale-open', 'a-minor-arpeggio', 'triplet-feel', 'eighth-notes', 'em-pentatonic-box-1']],
    ['Up next', ['riff-in-e', 'cmaj7-arpeggio']],
    ['Locked', ['am-pentatonic-5th', 'syncopated-strumming']],
    ['Done', ['quarter-notes', 'chromatic-warm-up', 'ode-to-joy']],
  ]);
  expect(countDone(lessons, sampleProgress)).toBe(3);
});

test('filtering by category hides other lessons and empty sections', () => {
  const sections = buildLessonSections(lessons, sampleProgress, 'arp');
  expect(sections.map((section) => section.title)).toEqual(['In progress', 'Up next']);
  expect(sections.flatMap((section) => section.lessons).every((item) => item.category === 'arp')).toBe(true);
});

test('a new user sees the lessons without unlock rules as "up next" and the rest locked', () => {
  const sections = buildLessonSections(lessons, {}, 'all');
  expect(sections.map((section) => [section.title, section.lessons.length])).toEqual([
    ['Up next', 9],
    ['Locked', 3],
  ]);
});

test('unlock text uses the design sentence and the current best score', () => {
  const locked = lesson('am-pentatonic-5th');
  expect(unlockText(locked, sampleProgress)).toBe(
    "Unlocks when you score 80% or more on E minor pentatonic, box 1. You're at 64%.",
  );
  expect(unlockText(locked, {})).toBe('Unlocks when you score 80% or more on E minor pentatonic, box 1.');
  expect(unlockText(lesson('quarter-notes'), sampleProgress)).toBeUndefined();
});

test('every lesson id is unique and every unlock points to a real lesson', () => {
  const ids = lessons.map((item) => item.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const item of lessons) {
    if (item.unlock) {
      expect(ids).toContain(item.unlock.lessonId);
    }
  }
});
