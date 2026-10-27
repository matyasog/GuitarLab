import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ErrorState } from '@/components/StateMessage';
import { ProfileProvider } from '@/firebase/ProfileProvider';
import { useProfile } from '@/hooks/useProfile';
import { colors } from '@/theme';

// Screens for signed-in users: onboarding first, then the tabs and the screens pushed over
// them (Settings, …). ProfileProvider keeps the user's profile document live for all of them.
export default function AppLayout() {
  return (
    <ProfileProvider>
      <AppNavigator />
    </ProfileProvider>
  );
}

function AppNavigator() {
  const { profile, status } = useProfile();

  if (status === 'error' && !profile) {
    return (
      <Screen>
        <ErrorState title="Couldn't load your progress" body="Check your connection and try again." />
      </Screen>
    );
  }

  if (!profile) {
    // Usually a moment only: Firestore answers from its local copy first.
    return <View style={styles.loading} accessibilityLabel="Loading" />;
  }

  const onboarded = profile.onboarding.completedAt !== null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      {/* Same idea as the sign-in guard: only one of the two exists at a time. Finishing
          onboarding sets completedAt, and the app switches to the tabs by itself. */}
      <Stack.Protected guard={onboarded} redirectTo="/onboarding/level">
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="lesson/[lessonId]" />
      </Stack.Protected>
      <Stack.Protected guard={!onboarded} redirectTo="/">
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
