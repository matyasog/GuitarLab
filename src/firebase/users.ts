import { doc, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore';

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

export function userDocRef(uid: string) {
  return doc(db, 'users', uid);
}

// Creates users/{uid} if it doesn't exist yet. Runs as a transaction ("read, then write only
// if still missing"), so sign-up and the profile listener can both call it at the same moment
// without the second one overwriting the first (which the rules would reject anyway).
export async function ensureUserProfile(uid: string, displayName: string): Promise<void> {
  const ref = userDocRef(uid);
  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(ref);
    if (!existing.exists()) {
      transaction.set(ref, newUserProfile(displayName, deviceTimeZone()));
    }
  });
}

// Saves some settings, e.g. { dailyGoalMin: 10 }. Only the given fields change
// ("settings.dailyGoalMin"), so two quick changes never overwrite each other.
export async function updateUserSettings(uid: string, changes: Partial<UserSettings>): Promise<void> {
  const fields = Object.fromEntries(Object.entries(changes).map(([key, value]) => [`settings.${key}`, value]));
  await updateDoc(userDocRef(uid), fields);
}
