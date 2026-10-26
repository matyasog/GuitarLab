import { router } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/hooks/useAuth';

// Today tab. Placeholder until step 3.6 builds the designed Today screen.
export default function Today() {
  const { user } = useAuth();

  return (
    // No bottom edge: the tab bar below already keeps clear of the home indicator.
    <Screen edges={['top', 'left', 'right']}>
      <ScreenHeader title="Today" />
      <AppText variant="mono14" color="muted">
        Signed in as {user?.email ?? user?.uid}. Placeholder until step 3.6. Sign out is in You → Settings.
      </AppText>
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
