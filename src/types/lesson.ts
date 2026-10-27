// Lessons ship with the app (src/data/lessons.ts); only the user's progress is in Firestore.

export type LessonCategory = 'rhythm' | 'scales' | 'melody' | 'arp';

export type Lesson = {
  id: string;
  title: string;
  category: LessonCategory;
  // Suggested tempo shown in the list ("Rhythm · 80 BPM").
  bpm: number;
  // Tempo the lesson works towards, if it differs ("· goal 80").
  goalBpm?: number;
  // 1 (easiest) … 5, shown as marks next to the tempo.
  difficulty: 1 | 2 | 3 | 4 | 5;
  // Locked until the user scores this much on another lesson.
  unlock?: { lessonId: string; minScore: number };
  // Text under the title on Lesson detail. Only lessons with written exercises have one.
  description?: string;
  // Notes drawn on the Lesson detail fretboard (scales and arpeggios in open position).
  shape?: FretShape;
  // True when the notes for the Practice run exist (decision D14: 3 lessons for now).
  hasExercises?: boolean;
  // Rough length of one run in minutes ("≈ 6 min" on Today's session card).
  minutes?: number;
};

// Strings named as on the fretboard, from the thinnest (high e) to the thickest (low E).
export type GuitarString = 'e' | 'B' | 'G' | 'D' | 'A' | 'E';

export type FretShape = {
  // Root note name for the legend ("Root (E)"). Shapes without roots (chromatic) leave it out.
  root?: string;
  // Fret 0 = open string.
  notes: { string: GuitarString; fret: number; name: string }[];
};

// Worked out from the scores (src/data/lessonSections.ts), never stored.
export type LessonStatus = 'in-progress' | 'up-next' | 'locked' | 'done';

// What the app stores per lesson (Firestore users/{uid}/lessons/{lessonId} from Phase 6).
export type LessonProgress = {
  // Best run score in percent, if the lesson was played.
  bestScore?: number;
  // How many runs were finished.
  runs?: number;
};
