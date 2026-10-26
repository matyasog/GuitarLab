import { Pressable, StyleSheet, View } from 'react-native';

import { colors, space } from '@/theme';

import { AppText } from './AppText';
import { Switch } from './Switch';

type SwitchRowProps = {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  // The last row of a card has no line below it.
  last?: boolean;
};

// Settings row with a switch on the right, from the "Row / …" + "Switch" instances in the
// Settings design. The whole row toggles (kit note), so it is one big touch target and one
// "switch" for screen readers; the Switch inside only shows the state.
export function SwitchRow({ title, subtitle, value, onValueChange, last = false }: SwitchRowProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      accessibilityState={{ checked: value }}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}
    >
      <View style={styles.text}>
        <AppText variant="label16">{title}</AppText>
        {subtitle ? (
          <AppText variant="helper14" color="muted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Switch value={value} onValueChange={onValueChange} accessibilityLabel={title} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: space[12],
    paddingHorizontal: space[16],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  pressed: {
    backgroundColor: colors.surface2,
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
