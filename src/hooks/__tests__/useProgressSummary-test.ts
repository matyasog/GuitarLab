import { lastSevenDays } from '../useProgressSummary';

test('the week ends today and marks the days before it (Monday 12 October 2026 as in the design)', () => {
  const week = lastSevenDays(new Date(2026, 9, 12), 6);
  expect(week.map((day) => day.label).join('')).toBe('TWTFSSM');
  expect(week.map((day) => day.state)).toEqual(['met', 'met', 'met', 'met', 'met', 'met', 'today']);
});

test('a new user has no met days', () => {
  expect(lastSevenDays(new Date(2026, 9, 12), 0).filter((day) => day.state === 'met')).toHaveLength(0);
});
