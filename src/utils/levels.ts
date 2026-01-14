// @/utils/levels.ts

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LevelConfig {
  key: CEFRLevel;
  label: string;
  minXP: number;
  maxXP: number;
}


export const LEVELS: LevelConfig[] = [
  { key: 'A1', label: 'Beginner', minXP: 0, maxXP: 99 },
  { key: 'A2', label: 'Elementary', minXP: 100, maxXP: 299 },
  { key: 'B1', label: 'Intermediate', minXP: 300, maxXP: 599 },
  { key: 'B2', label: 'Upper-Intermediate', minXP: 600, maxXP: 999 },
  { key: 'C1', label: 'Advanced', minXP: 1000, maxXP: 1499 },
  { key: 'C2', label: 'Mastery', minXP: 1500, maxXP: Infinity },
];

export const LEVEL_COLORS: Record<CEFRLevel, string> = {
  A1: 'bg-green-100 text-green-800',
  A2: 'bg-lime-100 text-lime-800',
  B1: 'bg-blue-100 text-blue-800',
  B2: 'bg-indigo-100 text-indigo-800',
  C1: 'bg-purple-100 text-purple-800',
  C2: 'bg-yellow-100 text-yellow-800'
}


export function getLevelByXP(xp: number) {
  return LEVELS.find(l => xp >= l.minXP && xp <= l.maxXP)!;
}

export function getNextLevel(xp: number) {
  const currentIndex = LEVELS.findIndex(l => xp <= l.maxXP);
  return LEVELS[currentIndex + 1] || null;
}

export function getLevelProgress(xp: number) {
  const current = getLevelByXP(xp);
  const next = getNextLevel(xp);

  if (!next) return 100;

  const progress =
    ((xp - current.minXP) / (current.maxXP - current.minXP + 1)) * 100;

  return Math.min(Math.round(progress), 100);
}

export function getLevel(xp: number) {
  const current = getLevelByXP(xp)
  const next = getNextLevel(xp)
  const progress = next
    ? Math.min(Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100), 100)
    : 100

  return {
    level: current.label,
    key: current.key,
    color: LEVEL_COLORS[current.key],
    progress,
    nextLevel: next?.label || null,
    nextXP: next?.minXP || null
  }
}



export function getLevelProgressByXP(xp: number): number {
  const current = getLevelByXP(xp)
  const next = getNextLevel(xp)

  if (!next) return 100

  const earned = xp - current.minXP
  const total = next.minXP - current.minXP

  return Math.min(Math.round((earned / total) * 100), 100)
}
