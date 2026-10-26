import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, space, type ColorName } from '@/theme';

import { AppText } from './AppText';

type StatTileProps = {
  value: string;
  // Small unit after the value, e.g. "%", "/12", "h 40".
  unit?: string;
  label: string;
  // Brass for achievement numbers (streak, XP), muted for zero states.
  valueColor?: ColorName;
  style?: StyleProp<ViewStyle>;
};

// One number with a label, from "Stat tile" in the design. Screens place 2–3 in a row with flex: 1.
export function StatTile({ value, unit, label, valueColor = 'text', style }: StatTileProps) {
  return (
    <View style={[styles.tile, style]} accessible accessibilityLabel={`${value}${unit ?? ''} ${label}`}>
      <View style={styles.valueRow}>
        <AppText variant="monoStrong32" color={valueColor}>
          {value}
        </AppText>
        {unit ? (
          <AppText variant="mono16" color="muted" style={styles.unit}>
            {unit}
          </AppText>
        ) : null}
      </View>
      <AppText variant="helper14" color="muted">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    gap: space[4],
    padding: space[16],
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[4],
  },
  unit: {
    // Lifts the small unit to sit on the big number's baseline (5 pt in the design).
    paddingBottom: 5,
  },
});
