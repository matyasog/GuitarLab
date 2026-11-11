import { timingStats } from '../timingStats';

test('mean, worst, jitter and recent lateness', () => {
  const stats = timingStats([2, 4, 4, 4, 5, 5, 7, 9], 2);
  expect(stats).toEqual({ clicks: 8, meanLateMs: 5, maxLateMs: 9, jitterMs: 2, recentMeanLateMs: 8 });
});

test('no clicks yet gives zeros', () => {
  expect(timingStats([]).clicks).toBe(0);
});
