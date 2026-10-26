import type { Lesson, LessonCategory, LessonProgress } from '@/types/lesson';

// The 12 lessons shown on the Learn screen in the design (titles, category, tempo, difficulty).
// Three of them get full exercise content later (decision D14).
export const lessons: Lesson[] = [
  { id: 'quarter-notes', title: 'Quarter notes on the click', category: 'rhythm', bpm: 60, difficulty: 1 },
  { id: 'chromatic-warm-up', title: 'Chromatic warm-up 1-2-3-4', category: 'scales', bpm: 70, difficulty: 1 },
  { id: 'c-major-scale-open', title: 'C major scale, open position', category: 'scales', bpm: 72, difficulty: 2 },
  { id: 'ode-to-joy', title: 'Ode to Joy, single-note melody', category: 'melody', bpm: 90, difficulty: 1 },
  { id: 'a-minor-arpeggio', title: 'A minor arpeggio', category: 'arp', bpm: 70, difficulty: 2 },
  { id: 'triplet-feel', title: 'Triplet feel', category: 'rhythm', bpm: 70, difficulty: 3 },
  { id: 'eighth-notes', title: 'Eighth notes, steady strumming', category: 'rhythm', bpm: 80, difficulty: 2 },
  {
    id: 'em-pentatonic-box-1',
    title: 'E minor pentatonic, box 1',
    category: 'scales',
    bpm: 72,
    goalBpm: 80,
    difficulty: 2,
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

// SAMPLE best scores, copied from the Learn design, so the screen can be built before real
// progress exists. Replaced by the user's Firestore data in Phase 6 (step 6.4).
// Lessons that are not listed have never been played.
export const sampleProgress: Record<string, LessonProgress> = {
  'quarter-notes': { bestScore: 96 },
  'chromatic-warm-up': { bestScore: 92 },
  'c-major-scale-open': { bestScore: 88 },
  'ode-to-joy': { bestScore: 90 },
  'a-minor-arpeggio': { bestScore: 82 },
  'triplet-feel': { bestScore: 78 },
  'eighth-notes': { bestScore: 71 },
  'em-pentatonic-box-1': { bestScore: 64 },
};
