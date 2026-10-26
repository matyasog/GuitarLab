import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, radii } from '@/theme';

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  // The setting's name, e.g. "Speed trainer". Read out with on/off by screen readers.
  accessibilityLabel: string;
  disabled?: boolean;
};

const trackWidth = 52;
const trackHeight = 32;
const padding = 3;
const knobSize = 26;
const knobTravel = trackWidth - 2 * padding - knobSize;

// On/off switch, from "Switch / on · off" in the design (amber when on).
// The visible track is 52 × 32; hitSlop makes the touch area 44 pt tall (kit note).
// In settings rows the whole row should toggle it as well.
export function Switch({ value, onValueChange, accessibilityLabel, disabled = false }: SwitchProps) {
  // 0 = off, 1 = on. The knob position runs on the UI thread (Reanimated).
  const position = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    // ReduceMotion.System: no slide when "Reduce Motion" is on in the phone settings.
    position.set(withTiming(value ? 1 : 0, { duration: 150, reduceMotion: ReduceMotion.System }));
  }, [value, position]);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.get() * knobTravel }],
  }));

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      hitSlop={{ top: 6, bottom: 6 }}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      style={[styles.track, { backgroundColor: value ? colors.amber : colors.line2 }, disabled && styles.disabled]}
    >
      <Animated.View style={[styles.knob, knobStyle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: trackWidth,
    height: trackHeight,
    padding,
    borderRadius: radii.pill,
    justifyContent: 'center',
  },
  knob: {
    width: knobSize,
    height: knobSize,
    borderRadius: radii.pill,
    backgroundColor: colors.text,
  },
  disabled: {
    opacity: 0.5,
  },
});
