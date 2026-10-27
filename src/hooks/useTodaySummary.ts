import type { StreakDay } from '@/components/StreakStrip';

export type TodaySummary = {
  level: number;
  streak: number;
  // The last 7 days, oldest first; today is the last one.
  week: StreakDay[];
  minutesToday: number;
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

// SAMPLE numbers from the Today design (level 4, 12-day streak, 9 minutes today), so the screen
// can be built before progress is recorded. Replaced by the user's real progress in step 6.4.
export function useTodaySummary(): TodaySummary {
  return { level: 4, streak: 12, week: lastSevenDays(new Date(), 6), minutesToday: 9 };
}

// What a brand-new user sees (first-day design), used by the dev preview until step 6.4.
export function firstDaySummary(): TodaySummary {
  return { level: 1, streak: 0, week: lastSevenDays(new Date(), 0), minutesToday: 0 };
}
