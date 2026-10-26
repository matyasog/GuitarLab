import { Stack } from 'expo-router';

import { ProfileProvider } from '@/firebase/ProfileProvider';
import { colors } from '@/theme';

// Screens for signed-in users: the tabs, plus screens pushed over them (Settings, …).
// ProfileProvider keeps the user's profile document live for all of them.
export default function AppLayout() {
  return (
    <ProfileProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
    </ProfileProvider>
  );
}
