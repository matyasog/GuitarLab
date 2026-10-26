import { onSnapshot } from 'firebase/firestore';
import { createContext, useEffect, useState, type ReactNode } from 'react';

import { useAuth } from '@/hooks/useAuth';
import type { OnboardingLevel, UserProfile, UserSettings } from '@/types/user';

import {
  completeOnboarding,
  ensureUserProfile,
  saveOnboardingLevel,
  updateUserSettings,
  userDocRef,
} from './users';

export type ProfileState = {
  profile: UserProfile | null;
  status: 'loading' | 'ready' | 'error';
  // Saves setting changes; the screen updates at once from Firestore's local copy.
  updateSettings: (changes: Partial<UserSettings>) => Promise<void>;
  setOnboardingLevel: (level: OnboardingLevel | null) => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

export const ProfileContext = createContext<ProfileState | null>(null);

// Keeps the signed-in user's profile document users/{uid} in React state, live: any change
// (from this phone or another device) arrives through Firestore's onSnapshot listener.
// Used inside the signed-in part of the app only (src/app/(app)/_layout.tsx).
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<ProfileState['status']>('loading');

  const uid = user?.uid;
  // Name for a profile that has to be created here (see below).
  const fallbackName = user?.displayName || user?.email?.split('@')[0] || 'Guitarist';

  useEffect(() => {
    if (!uid) {
      return;
    }
    return onSnapshot(
      userDocRef(uid),
      (snapshot) => {
        if (snapshot.exists()) {
          setProfile(snapshot.data() as UserProfile);
          setStatus('ready');
          return;
        }
        // No profile yet. Normally sign-up has just created it, but if that write failed
        // (e.g. the connection dropped), create it now. Only trust "missing" when the
        // answer comes from the server, not from the phone's offline cache.
        if (!snapshot.metadata.fromCache) {
          ensureUserProfile(uid, fallbackName).catch(() => setStatus('error'));
        }
      },
      () => setStatus('error'),
    );
  }, [uid, fallbackName]);

  const value: ProfileState = {
    profile,
    status,
    updateSettings: async (changes) => {
      if (uid) {
        await updateUserSettings(uid, changes);
      }
    },
    setOnboardingLevel: async (level) => {
      if (uid) {
        await saveOnboardingLevel(uid, level);
      }
    },
    completeOnboarding: async () => {
      if (uid) {
        await completeOnboarding(uid);
      }
    },
  };

  return <ProfileContext value={value}>{children}</ProfileContext>;
}
