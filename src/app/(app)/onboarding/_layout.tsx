import { Stack } from 'expo-router';

import { colors } from '@/theme';

// Onboarding after sign-up: level → guitar → microphone → low E.
// Shown only while the profile's onboarding.completedAt is empty (guard in ../_layout.tsx).
export const unstable_settings = {
  initialRouteName: 'level',
};

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="level" />
      <Stack.Screen name="guitar" />
      <Stack.Screen name="microphone" />
      <Stack.Screen name="low-e" />
    </Stack>
  );
}
