import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, minTouchTarget, radii } from '@/theme';

import { AppText } from '../AppText';

type StepButtonProps = {
  // How much the tempo changes: −5, −1, +1 or +5.
  step: number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

// The "−1", "+1", "−5", "+5" tempo buttons, from "Button −1" … in the Metronome design.
export function StepButton({ step, onPress, style }: StepButtonProps) {
  const amount = Math.abs(step);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${step < 0 ? 'Slower' : 'Faster'} by ${amount} BPM`}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      {/* − is the real minus sign, as in the design, not a hyphen. */}
      <AppText variant="mono16">{`${step < 0 ? '−' : '+'}${amount}`}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 52,
    height: minTouchTarget,
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: colors.surface2,
  },
});
