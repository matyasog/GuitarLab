import { Pressable, StyleSheet, View } from 'react-native';

import { colors, minTouchTarget, radii, space, type TextStyleName } from '@/theme';

import { AppText } from './AppText';

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  // Spoken label when the visible one is a symbol or number ("Quarter notes" for ♩).
  accessibilityLabel?: string;
  // Small text after the label, e.g. the triplet "3".
  suffix?: string;
  // The kit allows other label fonts, e.g. DM Mono for "4/4". Default: Archivo.
  labelVariant?: { normal: TextStyleName; selected: TextStyleName };
};

type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  // What the whole control chooses, e.g. "Time signature".
  accessibilityLabel: string;
};

const defaultLabel = { normal: 'label14', selected: 'labelStrong14' } as const;

// One-of-several picker, from "Segmented control" + "Segment" in the design.
// The selected segment is amber (act / now).
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.control} accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel}>
      {options.map((option) => {
        const selected = option.value === value;
        const variants = option.labelVariant ?? defaultLabel;
        const color = selected ? 'amber' : 'muted';

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityLabel={option.accessibilityLabel ?? option.label}
            accessibilityState={{ selected, checked: selected }}
            style={[styles.segment, selected && styles.selected]}
          >
            <AppText variant={selected ? variants.selected : variants.normal} color={color}>
              {option.label}
            </AppText>
            {option.suffix ? (
              <AppText variant="mono12" color={color}>
                {option.suffix}
              </AppText>
            ) : null}
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
  segment: {
    flex: 1,
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    paddingHorizontal: space[4],
    borderRadius: radii.chip,
  },
  selected: {
    backgroundColor: colors.amberSoft,
  },
});
