import type { Lesson, LessonCategory, LessonProgress, LessonStatus } from '@/types/lesson';

import { findLesson } from './lessons';

// A lesson counts as done from this best score (decided 2026-10-26).
// Unlocking the next lesson needs less: each lesson's own unlock.minScore (80 % for all now).
export const doneScore = 90;

export type LessonSection = {
  status: LessonStatus;
  title: string;
  lessons: Lesson[];
};

// Section order and titles on the Learn screen.
const sectionOrder: { status: LessonStatus; title: string }[] = [
  { status: 'in-progress', title: 'In progress' },
  { status: 'up-next', title: 'Up next' },
  { status: 'locked', title: 'Locked' },
  { status: 'done', title: 'Done' },
];

// Works out a lesson's status from the best scores:
// - locked:      it has an unlock rule and the required lesson's best score is below it
// - done:        best score of at least `doneScore`
// - in progress: played, but below `doneScore`
// - up next:     never played
export function lessonStatus(lesson: Lesson, progress: Record<string, LessonProgress>): LessonStatus {
  if (lesson.unlock) {
    const requiredBest = progress[lesson.unlock.lessonId]?.bestScore ?? 0;
    if (requiredBest < lesson.unlock.minScore) {
      return 'locked';
    }
  }
  const best = progress[lesson.id]?.bestScore;
  if (best === undefined) {
    return 'up-next';
  }
  return best >= doneScore ? 'done' : 'in-progress';
}

// Groups the lessons into the Learn screen's sections, optionally for one category only.
// Empty sections are left out.
export function buildLessonSections(
  lessons: Lesson[],
  progress: Record<string, LessonProgress>,
  category: LessonCategory | 'all',
): LessonSection[] {
  const visible = lessons.filter((lesson) => category === 'all' || lesson.category === category);
  return sectionOrder
    .map(({ status, title }) => ({
      status,
      title,
      lessons: visible.filter((lesson) => lessonStatus(lesson, progress) === status),
    }))
    .filter((section) => section.lessons.length > 0);
}

export function countDone(lessons: Lesson[], progress: Record<string, LessonProgress>): number {
  return lessons.filter((lesson) => lessonStatus(lesson, progress) === 'done').length;
}

// "Unlocks when you score 80% or more on E minor pentatonic, box 1. You're at 64%."
// (sentence pattern from the design).
export function unlockText(lesson: Lesson, progress: Record<string, LessonProgress>): string | undefined {
  if (!lesson.unlock) {
    return undefined;
  }
  const required = findLesson(lesson.unlock.lessonId);
  if (!required) {
    return undefined;
  }
  const sentence = `Unlocks when you score ${lesson.unlock.minScore}% or more on ${required.title}.`;
  const best = progress[required.id]?.bestScore;
  return best === undefined ? sentence : `${sentence} You're at ${best}%.`;
}
