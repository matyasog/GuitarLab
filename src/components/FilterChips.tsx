import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { colors, minTouchTarget, radii, space } from '@/theme';

import { AppText } from './AppText';

type FilterChipsProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  // Also called for the already selected chip, so a screen can treat it as "unselect".
  onChange: (value: T) => void;
  accessibilityLabel: string;
  // Read out on the selected chip, e.g. what a second tap does.
  selectedHint?: string;
};

// Horizontally scrolling filter, from "Category filter" on the Learn design: the selected
// chip is light with dark text, the others are outlined.
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
  selectedHint,
}: FilterChipsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityHint={selected ? selectedHint : undefined}
            accessibilityState={{ checked: selected, selected }}
            style={[styles.chip, selected ? styles.selected : styles.normal]}
          >
            <AppText variant={selected ? 'labelStrong14' : 'label14'} color={selected ? 'bg' : 'text2'}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: space[8],
    paddingHorizontal: space[16],
  },
  chip: {
    minHeight: minTouchTarget,
    justifyContent: 'center',
    borderRadius: radii.pill,
  },
  selected: {
    paddingHorizontal: space[20],
    backgroundColor: colors.text,
  },
  normal: {
    paddingHorizontal: space[16],
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
});
