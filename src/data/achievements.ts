// The 12 picks in the "Pick collection" (decision D9). Names and glyphs 1–6 are from the design,
// 7–12 are ours. The conditions are checked by the gamification rules in step 6.1.
export type Achievement = { id: string; name: string; glyph: string };

export const achievements: Achievement[] = [
  { id: 'streak-7', name: '7-day streak', glyph: '7' },
  { id: 'perfect-pitch-run', name: 'Perfect pitch run', glyph: '±0' },
  { id: 'bpm-120-club', name: '120 BPM club', glyph: '120' },
  { id: 'first-100', name: 'First 100%', glyph: '100' },
  { id: 'streak-30', name: '30-day streak', glyph: '30' },
  { id: 'barre-chord-boss', name: 'Barre chord boss', glyph: 'F' },
  { id: 'first-session', name: 'First session', glyph: '1' },
  { id: 'streak-3', name: '3-day streak', glyph: '3' },
  { id: 'garage-band', name: 'Garage Band', glyph: '5' },
  { id: 'chord-explorer', name: 'Chord explorer', glyph: '20' },
  { id: 'steady-hands', name: 'Steady hands', glyph: '60' },
  { id: 'tempo-climber', name: 'Tempo climber', glyph: '↑' },
];

// Earned picks first, then the rest, each group in the list order above.
export function sortAchievements(earned: string[]): Achievement[] {
  return [
    ...achievements.filter((item) => earned.includes(item.id)),
    ...achievements.filter((item) => !earned.includes(item.id)),
  ];
}
