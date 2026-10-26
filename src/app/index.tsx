import { router } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';

// Placeholder home until the real screens arrive (auth in Phase 2, Today in Phase 3).
export default function Index() {
  return (
    <Screen>
      <AppText variant="title32" accessibilityRole="header">
        GuitarLab
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
