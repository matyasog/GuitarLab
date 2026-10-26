import { useState } from 'react';
import { StyleSheet, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';

import { colors, minTouchTarget, radii } from '@/theme';

type SliderProps = {
  // 0 … 100
  value: number;
  // Called while dragging (to update the label next to it).
  onChange: (value: number) => void;
  // Called once when the finger lifts (to save).
  onChangeEnd: (value: number) => void;
  step?: number;
  accessibilityLabel: string;
};

const thumbSize = 24;

function clamp(value: number) {
  return Math.min(100, Math.max(0, value));
}

// Horizontal slider, from "Setting / Input sensitivity" in the design: a 4 pt rail, an amber
// fill and a round 24 pt thumb, in a 44 pt tall touch area. It uses React Native's built-in
// touch responder props on the View, so no extra library is needed: every touch and move
// reports the finger's x position inside the slider, which becomes the value.
// Screen readers adjust it with swipe up / down (accessibilityActions).
export function Slider({ value, onChange, onChangeEnd, step = 5, accessibilityLabel }: SliderProps) {
  const [width, setWidth] = useState(0);

  const valueAt = (event: GestureResponderEvent) => {
    const fraction = event.nativeEvent.locationX / Math.max(1, width);
    return clamp(Math.round((fraction * 100) / step) * step);
  };

  const adjust = (delta: number) => {
    const next = clamp(value + delta);
    onChange(next);
    onChangeEnd(next);
  };

  const thumbLeft = (value / 100) * Math.max(0, width - thumbSize);

  return (
    <View
      style={styles.touchArea}
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      // Become the touch responder on press and keep it while dragging, so the
      // surrounding ScrollView doesn't take over a horizontal drag.
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={(event) => onChange(valueAt(event))}
      onResponderMove={(event) => onChange(valueAt(event))}
      onResponderRelease={(event) => onChangeEnd(valueAt(event))}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: value, text: `${value}%` }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => adjust(event.nativeEvent.actionName === 'increment' ? step : -step)}
    >
      {/* pointerEvents="none": touches land on the slider itself, so x is measured from its left edge. */}
      <View style={styles.rail} pointerEvents="none">
        <View style={[styles.fill, { width: thumbLeft + thumbSize / 2 }]} />
      </View>
      <View style={[styles.thumb, { left: thumbLeft }]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  touchArea: {
    height: minTouchTarget,
    justifyContent: 'center',
  },
  rail: {
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.surface3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.amber,
  },
  thumb: {
    position: 'absolute',
    top: (minTouchTarget - thumbSize) / 2,
    width: thumbSize,
    height: thumbSize,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.line2,
    backgroundColor: colors.text,
  },
});
