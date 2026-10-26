import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii, space } from '@/theme';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

type ListRowProps = {
  title: string;
  subtitle?: string;
  // Icon in a small square on the left.
  icon?: IconName;
  // Text on the right ("Value"), or any element (a score, a "NEW" tag, a lock).
  value?: string | ReactNode;
  // Rows that open something show a chevron; it is on by default when onPress is set.
  showChevron?: boolean;
  onPress?: () => void;
  accessibilityHint?: string;
};

// Row in a list, from "List row" in the design: 64 pt tall, hairline line below, no shadow.
export function ListRow({ title, subtitle, icon, value, showChevron, onPress, accessibilityHint }: ListRowProps) {
  const chevron = showChevron ?? onPress !== undefined;
  const valueText = typeof value === 'string' ? value : undefined;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={[title, subtitle, valueText].filter(Boolean).join(', ')}
      accessibilityHint={accessibilityHint}
      // The kit has no pressed state for rows; a slightly lighter surface shows the tap.
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {icon ? (
        <View style={styles.iconBox}>
          <Icon name={icon} color="text2" />
        </View>
      ) : null}

      <View style={styles.text}>
        <AppText variant="label16">{title}</AppText>
        {subtitle ? (
          <AppText variant="helper14" color="muted">
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {typeof value === 'string' ? (
        <AppText variant="helper14" color="muted">
          {value}
        </AppText>
      ) : (
        value
      )}

      {chevron ? <Icon name="chevron-right" color="subtle" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    paddingVertical: space[8],
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.chip,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
