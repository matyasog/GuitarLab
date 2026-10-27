import type { Lesson, LessonProgress } from '@/types/lesson';

import { lessonStatus } from './lessonSections';

// The lesson the first session uses (from the first-day Today design).
export const firstSessionLessonId = 'quarter-notes';

export type SessionPick = {
  lesson: Lesson;
  // Nothing played yet: the card says "Your first session".
  firstSession: boolean;
};

// Lesson for the session card on Today (rule chosen 2026-10-27). Only lessons with exercises
// can be played, so only those count:
// 1. nothing played yet → the first-session lesson
// 2. the in-progress lesson with the lowest best score (the one that needs work most)
// 3. otherwise the first lesson not played yet, or else the first one with exercises
export function pickSession(lessons: Lesson[], progress: Record<string, LessonProgress>): SessionPick {
  const playable = lessons.filter((lesson) => lesson.hasExercises);
  const nothingPlayed = lessons.every((lesson) => progress[lesson.id]?.bestScore === undefined);
  const first = playable.find((lesson) => lesson.id === firstSessionLessonId);

  if (nothingPlayed && first) {
    return { lesson: first, firstSession: true };
  }

  const weakest = byBestScore(playable.filter((lesson) => lessonStatus(lesson, progress) === 'in-progress'), progress)[0];
  const fresh = playable.find((lesson) => lessonStatus(lesson, progress) === 'up-next');
  return { lesson: weakest ?? fresh ?? playable[0], firstSession: false };
}

// The two rows under "Up next" on Today (rule chosen 2026-10-27): the weakest other lesson in
// progress, then lessons not played yet, easiest first. Any lesson counts, with or without
// exercises, because the rows only open Lesson detail.
export function pickUpNext(lessons: Lesson[], progress: Record<string, LessonProgress>, sessionId: string): Lesson[] {
  const others = lessons.filter((lesson) => lesson.id !== sessionId);
  const inProgress = byBestScore(
    others.filter((lesson) => lessonStatus(lesson, progress) === 'in-progress'),
    progress,
  );
  // sort() keeps the list order for lessons with the same difficulty.
  const fresh = others
    .filter((lesson) => lessonStatus(lesson, progress) === 'up-next')
    .sort((a, b) => a.difficulty - b.difficulty);

  return [...inProgress.slice(0, 1), ...fresh].slice(0, 2);
}

function byBestScore(lessons: Lesson[], progress: Record<string, LessonProgress>): Lesson[] {
  return [...lessons].sort((a, b) => (progress[a.id]?.bestScore ?? 0) - (progress[b.id]?.bestScore ?? 0));
}

// Small line above the session title. Time-based wording is not in the design for daytime.
export function sessionKicker(pick: SessionPick, hour: number): string {
  if (pick.firstSession) {
    return 'Your first session';
  }
  return hour >= 17 ? "Tonight's session" : "Today's session";
}

// Coach text on the session card. SAMPLE: the E minor pentatonic line is copied from the design;
// real coach text from the user's runs comes with Results (step 7.5). Other lessons show their
// description.
export function sessionCoach(pick: SessionPick): string | undefined {
  if (pick.firstSession) {
    return "Four clicks, then pluck the open low E on every beat. We'll use it to find your starting tempo, so there's no wrong answer.";
  }
  if (pick.lesson.id === 'em-pentatonic-box-1') {
    return "Your last three runs landed 64 ms behind the click, so we've dropped the tempo 10%. Two clean runs and you're back at 80.";
  }
  return pick.lesson.description;
}
