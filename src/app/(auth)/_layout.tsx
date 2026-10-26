import { Stack } from 'expo-router';

import { colors } from '@/theme';

// Screens for signed-out users: sign in (and sign up from step 2.5).
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />;
}
