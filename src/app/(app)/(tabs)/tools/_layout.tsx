import { Stack } from 'expo-router';

import { colors } from '@/theme';

// The "Tools" tab holds two tools, switched by the Tuner | Metronome control.
// No animation: the switch swaps the tool in place, like flipping a switch on a pedal.
export const unstable_settings = {
  initialRouteName: 'tuner',
};

export default function ToolsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="tuner" />
      <Stack.Screen name="metronome" />
    </Stack>
  );
}
