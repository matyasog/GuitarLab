// Levels and ranks (decision D9). Level n needs 100 × (n − 1)² XP in total:
// level 2 = 100, 4 = 900, 5 = 1,600, 9 = 6,400, 13 = 14,400.

export type Rank = { name: string; fromLevel: number; toLevel?: number };

// From the rank ladder in the You design.
export const ranks: Rank[] = [
  { name: 'Bedroom Player', fromLevel: 1, toLevel: 4 },
  { name: 'Garage Band', fromLevel: 5, toLevel: 8 },
  { name: 'Opening Act', fromLevel: 9, toLevel: 12 },
  { name: 'Headliner', fromLevel: 13 },
];

export function xpForLevel(level: number): number {
  return 100 * (level - 1) ** 2;
}

export function levelForXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) {
    level += 1;
  }
  return level;
}

export function rankForLevel(level: number): Rank {
  return ranks.find((rank) => level >= rank.fromLevel && (rank.toLevel === undefined || level <= rank.toLevel))!;
}

// "Lv 1–4", "Lv 13+"
export function rankRange(rank: Rank): string {
  return rank.toLevel === undefined ? `Lv ${rank.fromLevel}+` : `Lv ${rank.fromLevel}–${rank.toLevel}`;
}

export type XpProgress = { level: number; nextLevel: number; nextLevelXp: number; fraction: number; text: string };

// The XP bar on You: "1,240 / 1,600 XP to level 5". As in the design, the bar shows total XP
// against the next level's total (1,240 / 1,600 = 77.5 %), not the part within the level.
export function xpProgress(xp: number): XpProgress {
  const level = levelForXp(xp);
  const nextLevelXp = xpForLevel(level + 1);
  return {
    level,
    nextLevel: level + 1,
    nextLevelXp,
    fraction: xp / nextLevelXp,
    text: `${formatThousands(xp)} / ${formatThousands(nextLevelXp)} XP to level ${level + 1}`,
  };
}

// 1240 → "1,240". Written by hand so it doesn't depend on the phone's number formatting.
export function formatThousands(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Practice time for the "practised" stat tile, split into the big number and the small unit:
// 580 min → { value: "9", unit: "h 40" }, 45 min → { value: "45", unit: "m" }.
export function formatPractised(minutes: number): { value: string; unit: string } {
  if (minutes < 60) {
    return { value: String(minutes), unit: 'm' };
  }
  const rest = minutes % 60;
  return { value: String(Math.floor(minutes / 60)), unit: rest === 0 ? 'h' : `h ${rest}` };
}
