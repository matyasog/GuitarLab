import { router } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/hooks/useAuth';

// Placeholder home for signed-in users until the Today screen (Phase 3).
export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <Screen>
      <AppText variant="title32" accessibilityRole="header">
        GuitarLab
      </AppText>
      <AppText variant="mono14" color="muted">
        Signed in as {user?.email ?? user?.uid}
      </AppText>
      {/* Sign out moves to Settings → Account in step 3.2. */}
      <Button label="Sign out" variant="secondary" onPress={signOut} fullWidth />
      {__DEV__ ? (
        <Button
          label="Component gallery"
          variant="ghost"
          onPress={() => router.push('/dev/gallery')}
          accessibilityHint="Opens the developer gallery of all base components"
          fullWidth
        />
      ) : null}
    </Screen>
  );
}
