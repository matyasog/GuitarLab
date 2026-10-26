import { Stack } from 'expo-router';

import { colors } from '@/theme';

// Screens for signed-in users. The tab bar and the other app screens are added in Phase 3.
export default function AppLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />;
}
