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
};

// Worked out from the scores (src/data/lessonSections.ts), never stored.
export type LessonStatus = 'in-progress' | 'up-next' | 'locked' | 'done';

// What the app stores per lesson (Firestore users/{uid}/lessons/{lessonId} from Phase 6).
export type LessonProgress = {
  // Best run score in percent, if the lesson was played.
  bestScore?: number;
};
