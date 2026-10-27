import { Pressable, StyleSheet } from 'react-native';

import { colors, minTouchTarget, radii } from '@/theme';

import { AppText } from './AppText';

// The round brass level number on Today, from "Level badge (opens You)" in the design.
export function LevelBadge({ level, onPress }: { level: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Level ${level}`}
      accessibilityHint="Opens your progress"
      style={({ pressed }) => [styles.badge, pressed && styles.pressed]}
    >
      <AppText variant="monoStrong20" color="brass" maxFontSizeMultiplier={1.2}>
        {level}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.brass,
    backgroundColor: colors.brassSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
