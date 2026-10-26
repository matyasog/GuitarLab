import { Pressable, StyleSheet, View } from 'react-native';

import { colors, minTouchTarget, radii, space } from '@/theme';

import { AppText } from './AppText';

export type Tool = 'tuner' | 'metronome';

const tools: { value: Tool; label: string }[] = [
  { value: 'tuner', label: 'Tuner' },
  { value: 'metronome', label: 'Metronome' },
];

type ToolSwitchProps = {
  value: Tool;
  onChange: (tool: Tool) => void;
};

// Tuner | Metronome switch at the top of the tool screens, from "Tool switch / …" in the design.
// Neutral style (not amber): the selected side is a lighter surface with an amber LED.
export function ToolSwitch({ value, onChange }: ToolSwitchProps) {
  return (
    <View style={styles.control} accessibilityRole="tablist">
      {tools.map((tool) => {
        const selected = tool.value === value;
        return (
          <Pressable
            key={tool.value}
            onPress={() => onChange(tool.value)}
            accessibilityRole="tab"
            accessibilityLabel={tool.label}
            accessibilityState={{ selected }}
            style={[styles.side, selected && styles.selected]}
          >
            <View style={[styles.led, { backgroundColor: selected ? colors.amber : colors.ledOff }]} />
            <AppText variant={selected ? 'labelStrong14' : 'label14'} color={selected ? 'text' : 'muted'}>
              {tool.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    alignSelf: 'stretch',
    minHeight: minTouchTarget,
    flexDirection: 'row',
    gap: space[4],
    padding: space[4],
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  side: {
    flex: 1,
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[8],
    borderRadius: radii.chip,
  },
  selected: {
    backgroundColor: colors.surface3,
  },
  led: {
    width: 6,
    height: 6,
    borderRadius: radii.pill,
  },
});
