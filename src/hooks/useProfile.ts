import { use } from 'react';

import { ProfileContext, type ProfileState } from '@/firebase/ProfileProvider';

// The signed-in user's profile (settings, progress) and a way to save settings.
// Must be used inside <ProfileProvider> (the signed-in part of the app).
export function useProfile(): ProfileState {
  const value = use(ProfileContext);
  if (!value) {
    throw new Error('useProfile() must be used inside <ProfileProvider> (see src/app/(app)/_layout.tsx).');
  }
  return value;
}
