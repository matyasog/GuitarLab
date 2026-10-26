import { sampleProgress } from '@/data/lessons';
import type { LessonProgress } from '@/types/lesson';

export type LessonProgressState = {
  progress: Record<string, LessonProgress>;
  status: 'loading' | 'ready' | 'error';
};

// The user's progress per lesson. Until Phase 6 (step 6.4) this returns the SAMPLE progress
// from the design; then it reads users/{uid}/lessons from Firestore. The screens using it
// don't change, because they already handle loading and error.
export function useLessonProgress(): LessonProgressState {
  return { progress: sampleProgress, status: 'ready' };
}
