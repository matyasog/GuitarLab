import type { StreakDay } from '@/components/StreakStrip';

export type ProgressSummary = {
  xp: number;
  streak: number;
  // The last 7 days, oldest first; today is the last one.
  week: StreakDay[];
  minutesToday: number;
  // All practice time so far ("9 h 40 practised" on You).
  practisedMinutes: number;
  // Ids from src/data/achievements.ts.
  earnedAchievements: string[];
};

// One letter per weekday, indexed by Date.getDay() (0 = Sunday).
const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// The last 7 days ending today, with the goal met on the `metDays` days before today.
export function lastSevenDays(today: Date, metDays: number): StreakDay[] {
  return Array.from({ length: 7 }, (_, index) => {
    const daysAgo = 6 - index;
    const day = new Date(today);
    day.setDate(today.getDate() - daysAgo);
    const state: StreakDay['state'] = daysAgo === 0 ? 'today' : daysAgo <= metDays ? 'met' : 'missed';
    return { label: dayLetters[day.getDay()], state };
  });
}

// SAMPLE numbers from the Today and You designs (1,240 XP = level 4, 12-day streak, 9 minutes
// today, 9 h 40 in total, 4 picks), so the screens can be built before progress is recorded.
// Replaced by the user's real progress in step 6.4.
export function useProgressSummary(): ProgressSummary {
  return {
    xp: 1240,
    streak: 12,
    week: lastSevenDays(new Date(), 6),
    minutesToday: 9,
    practisedMinutes: 580,
    earnedAchievements: ['streak-7', 'perfect-pitch-run', 'bpm-120-club', 'first-100'],
  };
}

// What a brand-new user sees (first-day / empty designs), used by the dev previews until 6.4.
export function emptyProgressSummary(): ProgressSummary {
  return {
    xp: 0,
    streak: 0,
    week: lastSevenDays(new Date(), 0),
    minutesToday: 0,
    practisedMinutes: 0,
    earnedAchievements: [],
  };
}
