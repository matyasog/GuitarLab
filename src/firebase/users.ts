import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import type { UserProfile, UserSettings } from '@/types/user';

import { db } from './config';

// Defaults for a new account, from the Settings design (docs/data-model.md).
export const defaultSettings: UserSettings = {
  hand: 'right',
  guitar: 'acoustic',
  headstock: '3+3',
  dailyGoalMin: 15,
  a4Hz: 440,
  inputSensitivity: 60,
  noiseGate: false,
  feelTheBeat: false,
  visualPulse: true,
  countIn: true,
  soundEffects: true,
};

// The phone's time zone (e.g. "Europe/Prague"), used later to decide which calendar day
// a practice session belongs to for the streak.
export function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
  } catch {
    return 'UTC';
  }
}

// The profile document written once, right after the account is created.
export function newUserProfile(displayName: string, timeZone: string): UserProfile {
  return {
    displayName: displayName.trim(),
    timeZone,
    onboarding: { level: null, completedAt: null },
    settings: defaultSettings,
    progress: { xp: 0, streak: 0, bestStreak: 0, lastGoalDay: null, practiceSec: 0, lessonsDone: 0 },
    // The server fills in its own time; the security rules require exactly that.
    createdAt: serverTimestamp(),
  };
}

// Creates users/{uid}. The rules allow this only once: a second write would change
// createdAt, which the update rule forbids.
export async function createUserProfile(uid: string, displayName: string): Promise<void> {
  await setDoc(doc(db, 'users', uid), newUserProfile(displayName, deviceTimeZone()));
}
