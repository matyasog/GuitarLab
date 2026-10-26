import { Pressable, StyleSheet } from 'react-native';

import { colors, minTouchTarget, radii } from '@/theme';

import { Icon, type IconName } from './Icon';

type IconButtonProps = {
  icon: IconName;
  // Required: an icon alone means nothing to a screen reader ("Back", "Settings").
  accessibilityLabel: string;
  onPress: () => void;
  disabled?: boolean;
};

// 44 × 44 square button with one icon, from "Icon button / …" in the design.
export function IconButton({ icon, accessibilityLabel, onPress, disabled = false }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Icon name={icon} color={disabled ? 'subtle' : 'text'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    borderColor: colors.line2,
    backgroundColor: colors.surface3,
  },
  disabled: {
    borderColor: 'transparent',
    backgroundColor: colors.surface2,
  },
});
