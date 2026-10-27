import type { Lesson, LessonCategory, LessonProgress } from '@/types/lesson';

import { aMinorArpeggio, cMajorOpen, chromaticWarmUp, emPentatonicBox1, openLowE } from './lessonShapes';

// The 12 lessons shown on the Learn screen in the design (titles, category, tempo, difficulty).
// Three of them have exercises (`hasExercises`, decision D14); the others show "coming soon".
export const lessons: Lesson[] = [
  {
    id: 'quarter-notes',
    title: 'Quarter notes on the click',
    category: 'rhythm',
    bpm: 60,
    difficulty: 1,
    // Matches the first-day Today design ("pluck the open low E on every beat"); changed 2026-10-27.
    description: 'Pluck the open low E on every click. We check that each note lands right on the beat.',
    shape: openLowE,
    hasExercises: true,
    // From the first-day Today design.
    minutes: 3,
  },
  {
    id: 'chromatic-warm-up',
    title: 'Chromatic warm-up 1-2-3-4',
    category: 'scales',
    bpm: 70,
    difficulty: 1,
    // Not in the design (approved 2026-10-26).
    description:
      'Frets 1-2-3-4 on every string, one finger per fret, up and back down. We check pitch, timing and clean fretting on every note.',
    shape: chromaticWarmUp,
    hasExercises: true,
    // Not in the design (chosen 2026-10-27).
    minutes: 4,
  },
  {
    id: 'c-major-scale-open',
    title: 'C major scale, open position',
    category: 'scales',
    bpm: 72,
    difficulty: 2,
    shape: cMajorOpen,
  },
  { id: 'ode-to-joy', title: 'Ode to Joy, single-note melody', category: 'melody', bpm: 90, difficulty: 1 },
  { id: 'a-minor-arpeggio', title: 'A minor arpeggio', category: 'arp', bpm: 70, difficulty: 2, shape: aMinorArpeggio },
  { id: 'triplet-feel', title: 'Triplet feel', category: 'rhythm', bpm: 70, difficulty: 3 },
  { id: 'eighth-notes', title: 'Eighth notes, steady strumming', category: 'rhythm', bpm: 80, difficulty: 2 },
  {
    id: 'em-pentatonic-box-1',
    title: 'E minor pentatonic, box 1',
    category: 'scales',
    bpm: 72,
    goalBpm: 80,
    difficulty: 2,
    // From the Lesson detail design.
    description:
      'Up the box and back down, one note per eighth-note click. We check pitch, timing and clean fretting on every note.',
    shape: emPentatonicBox1,
    hasExercises: true,
    // From the Today design.
    minutes: 6,
  },
  { id: 'riff-in-e', title: 'Riff in E, palm-muted', category: 'melody', bpm: 100, difficulty: 3 },
  {
    id: 'am-pentatonic-5th',
    title: 'A minor pentatonic, 5th position',
    category: 'scales',
    bpm: 90,
    difficulty: 3,
    // From the design: "Unlocks when you score 80% or more on E minor pentatonic, box 1."
    unlock: { lessonId: 'em-pentatonic-box-1', minScore: 80 },
  },
  {
    id: 'syncopated-strumming',
    title: 'Syncopated strumming',
    category: 'rhythm',
    bpm: 90,
    difficulty: 4,
    // Not in the design; the rhythm lesson before it (confirmed 2026-10-26).
    unlock: { lessonId: 'eighth-notes', minScore: 80 },
  },
  {
    id: 'cmaj7-arpeggio',
    title: 'Cmaj7 arpeggio across 3 strings',
    category: 'arp',
    bpm: 80,
    difficulty: 4,
    // Not in the design; the arpeggio lesson before it (confirmed 2026-10-26).
    unlock: { lessonId: 'a-minor-arpeggio', minScore: 80 },
  },
];

export const categoryLabels: Record<LessonCategory, string> = {
  rhythm: 'Rhythm',
  scales: 'Scales',
  melody: 'Melody',
  arp: 'Arpeggios',
};

export function findLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

// SAMPLE best scores, copied from the Learn design (runs: 5 for E minor pentatonic from the
// Lesson detail design, the others made up), so the screen can be built before real
// progress exists. Replaced by the user's Firestore data in Phase 6 (step 6.4).
// Lessons that are not listed have never been played.
export const sampleProgress: Record<string, LessonProgress> = {
  'quarter-notes': { bestScore: 96, runs: 9 },
  'chromatic-warm-up': { bestScore: 92, runs: 7 },
  'c-major-scale-open': { bestScore: 88, runs: 6 },
  'ode-to-joy': { bestScore: 90, runs: 4 },
  'a-minor-arpeggio': { bestScore: 82, runs: 3 },
  'triplet-feel': { bestScore: 78, runs: 4 },
  'eighth-notes': { bestScore: 71, runs: 3 },
  'em-pentatonic-box-1': { bestScore: 64, runs: 5 },
};
