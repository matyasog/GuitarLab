import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, minTouchTarget, radii, space, type ColorName } from '@/theme';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  // Optional leading icon (hidden by default in the design).
  icon?: IconName;
  disabled?: boolean;
  // The design's buttons hug their label; screens usually stretch them to full width.
  fullWidth?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

type Look = { background: ColorName | null; border: ColorName | null; text: ColorName };

// Colours per variant and state, from the "Button / …" components in the design.
const looks: Record<ButtonVariant, { normal: Look; pressed: Look; disabled: Look }> = {
  primary: {
    normal: { background: 'amber', border: null, text: 'amberInk' },
    pressed: { background: 'amberPressed', border: null, text: 'amberInk' },
    disabled: { background: 'surface2', border: null, text: 'subtle' },
  },
  secondary: {
    normal: { background: 'surface', border: 'line', text: 'text' },
    pressed: { background: 'surface3', border: 'line2', text: 'text' },
    disabled: { background: 'surface2', border: null, text: 'subtle' },
  },
  ghost: {
    normal: { background: null, border: null, text: 'text2' },
    pressed: { background: 'surface2', border: null, text: 'text2' },
    disabled: { background: null, border: null, text: 'subtle' },
  },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  fullWidth = false,
  accessibilityHint,
  style,
}: ButtonProps) {
  const lookFor = (pressed: boolean) => looks[variant][disabled ? 'disabled' : pressed ? 'pressed' : 'normal'];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => {
        const look = lookFor(pressed);
        return [
          styles.base,
          variant === 'ghost' ? styles.ghostPadding : styles.padding,
          {
            backgroundColor: look.background ? colors[look.background] : 'transparent',
            // The border is always 1 pt wide (transparent when hidden) so states don't change size.
            borderColor: look.border ? colors[look.border] : 'transparent',
          },
          fullWidth && styles.fullWidth,
          style,
        ];
      }}
    >
      {({ pressed }) => {
        const look = lookFor(pressed);
        return (
          <>
            {icon ? <Icon name={icon} color={look.text} /> : null}
            <AppText variant="heading16" color={look.text} numberOfLines={2} style={styles.label}>
              {label}
            </AppText>
          </>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    minWidth: minTouchTarget,
    borderRadius: radii.control,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[8],
  },
  padding: {
    paddingHorizontal: space[24],
  },
  ghostPadding: {
    paddingHorizontal: space[16],
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  label: {
    textAlign: 'center',
  },
});
