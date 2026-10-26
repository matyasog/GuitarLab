import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, minTouchTarget, radii, space } from '@/theme';

import { AppText } from './AppText';

type LinkButtonProps = {
  label: string;
  onPress: () => void;
  // amber for actions ("Forgot password?", "Retry"), text2 for quieter links ("Create an account").
  color?: 'amber' | 'text2';
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

// Text-only button, 44 pt tall. In the design these are "Button / ghost" instances with a
// 14 pt label (e.g. "Forgot password?" on Sign in, "Create an account").
export function LinkButton({ label, onPress, color = 'amber', disabled = false, accessibilityHint, style }: LinkButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      <AppText variant="labelStrong14" color={disabled ? 'subtle' : color}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: space[8],
    borderRadius: radii.chip,
  },
  pressed: {
    backgroundColor: colors.surface2,
  },
});
