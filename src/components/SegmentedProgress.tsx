import { StyleSheet, View } from 'react-native';

import { colors, radii, space } from '@/theme';

type SegmentedProgressProps = {
  done: number;
  total: number;
  accessibilityLabel: string;
};

// A row of equal segments, brass for each finished item, from "Course progress
// (12 segments)" on the Learn design.
export function SegmentedProgress({ done, total, accessibilityLabel }: SegmentedProgressProps) {
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: total, now: done }}
    >
      {Array.from({ length: total }, (_, index) => (
        <View key={index} style={[styles.segment, index < done && styles.done]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space[4],
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surface3,
  },
  done: {
    backgroundColor: colors.brass,
  },
});
