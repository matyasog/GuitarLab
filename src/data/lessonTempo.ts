import type { Lesson } from '@/types/lesson';

export type TempoKind = 'warm-up' | 'suggested' | 'goal';

export type TempoOption = { kind: TempoKind; bpm: number };

// How far the warm-up (and a default goal) sit from the suggested tempo. The design shows
// 64 / 72 / 80 for a 72 BPM lesson with goal 80 (rule chosen 2026-10-26).
export const tempoStep = 8;

// The three tempo choices on Lesson detail: warm-up, suggested (the lesson's tempo), goal.
export function tempoOptions(lesson: Lesson): TempoOption[] {
  return [
    { kind: 'warm-up', bpm: lesson.bpm - tempoStep },
    { kind: 'suggested', bpm: lesson.bpm },
    { kind: 'goal', bpm: goalTempo(lesson) },
  ];
}

// The lesson's own goal tempo, or one step above the suggested tempo.
export function goalTempo(lesson: Lesson): number {
  return lesson.goalBpm ?? lesson.bpm + tempoStep;
}
