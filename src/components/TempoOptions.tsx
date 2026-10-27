import { Pressable, StyleSheet, View } from 'react-native';

import type { TempoOption } from '@/data/lessonTempo';
import { colors, radii, space } from '@/theme';

import { AppText } from './AppText';

type TempoOptionsProps = {
  options: TempoOption[];
  value: number;
  onChange: (bpm: number) => void;
};

// The three tempo tiles on Lesson detail ("64 warm-up · 72 suggested · 80 goal"), from the
// "Tempo options" row in the design: 64 pt tall, the chosen one with an amber border.
export function TempoOptions({ options, value, onChange }: TempoOptionsProps) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Tempo">
      {options.map((option) => {
        const selected = option.bpm === value;
        return (
          <Pressable
            key={option.kind}
            onPress={() => onChange(option.bpm)}
            accessibilityRole="radio"
            accessibilityLabel={`${option.bpm} BPM, ${option.kind}`}
            accessibilityState={{ selected, checked: selected }}
            style={[styles.tile, selected && styles.selected]}
          >
            <AppText variant="monoStrong24" color={selected ? 'amber' : 'text'}>
              {option.bpm}
            </AppText>
            <AppText variant={selected ? 'label12' : 'caption12'} color={selected ? 'amber' : 'muted'}>
              {option.kind}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space[8],
  },
  tile: {
    flex: 1,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.amber,
    backgroundColor: colors.amberSoft,
  },
});
