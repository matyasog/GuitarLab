import { formatPractised, levelForXp, rankForLevel, rankRange, ranks, xpProgress } from '../ranks';

test('the level curve matches the design numbers', () => {
  expect(levelForXp(0)).toBe(1);
  expect(levelForXp(99)).toBe(1);
  expect(levelForXp(100)).toBe(2);
  expect(levelForXp(1240)).toBe(4);
  expect(levelForXp(1600)).toBe(5);
  expect(levelForXp(14400)).toBe(13);
});

test('the XP bar text and fill match the You design', () => {
  expect(xpProgress(1240)).toMatchObject({ level: 4, fraction: 0.775, text: '1,240 / 1,600 XP to level 5' });
  expect(xpProgress(0).text).toBe('0 / 100 XP to level 2');
});

test('ranks cover every level', () => {
  expect(rankForLevel(1).name).toBe('Bedroom Player');
  expect(rankForLevel(4).name).toBe('Bedroom Player');
  expect(rankForLevel(5).name).toBe('Garage Band');
  expect(rankForLevel(12).name).toBe('Opening Act');
  expect(rankForLevel(40).name).toBe('Headliner');
  expect(ranks.map(rankRange)).toEqual(['Lv 1–4', 'Lv 5–8', 'Lv 9–12', 'Lv 13+']);
});

test('practice time is shown as in the design', () => {
  expect(formatPractised(580)).toEqual({ value: '9', unit: 'h 40' });
  expect(formatPractised(0)).toEqual({ value: '0', unit: 'm' });
  expect(formatPractised(120)).toEqual({ value: '2', unit: 'h' });
});
