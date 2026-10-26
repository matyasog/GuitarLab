import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { space } from '@/theme';

import { ScreenHeader } from './ScreenHeader';
import { ToolSwitch, type Tool } from './ToolSwitch';

const titles: Record<Tool, string> = { tuner: 'Tuner', metronome: 'Metronome' };

// Top of the Tuner and Metronome screens: title and the Tuner | Metronome switch.
// Switching replaces the screen instead of pushing it, so "back" doesn't toggle between tools.
export function ToolHeader({ tool }: { tool: Tool }) {
  return (
    <View style={styles.header}>
      <ScreenHeader title={titles[tool]} />
      <ToolSwitch
        value={tool}
        onChange={(next) => {
          if (next !== tool) {
            router.replace(next === 'tuner' ? '/tools/tuner' : '/tools/metronome');
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: space[16],
  },
});
