import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { auth } from '@/firebase/config';

// Placeholder home until the real screens arrive (auth in Phase 2, Today in Phase 3).
export default function Index() {
  // Temporary check for step 2.1: Firebase starts and reports the auth state.
  const [authState, setAuthState] = useState('checking…');

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setAuthState(user ? `signed in as ${user.email ?? user.uid}` : 'signed out');
    });
  }, []);

  return (
    <Screen>
      <AppText variant="title32" accessibilityRole="header">
        GuitarLab
      </AppText>
      <AppText variant="mono14" color="muted">
        Auth: {authState}
      </AppText>
      {__DEV__ ? (
        <Button
          label="Component gallery"
          variant="secondary"
          onPress={() => router.push('/dev/gallery')}
          accessibilityHint="Opens the developer gallery of all base components"
        />
      ) : null}
    </Screen>
  );
}
