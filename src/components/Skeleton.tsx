import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors, radii, space } from '@/theme';

// Grey placeholder shapes while data loads, from "Skeleton / card · list row" in the design.
// They pulse gently (opacity) on the UI thread; with Reduce Motion they stay still.
function usePulse() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.set(
      withRepeat(withTiming(0.5, { duration: 900, reduceMotion: ReduceMotion.System }), -1, true, undefined, ReduceMotion.System),
    );
  }, [opacity]);

  return useAnimatedStyle(() => ({ opacity: opacity.get() }));
}

function Bar({ width, height = 12 }: { width: DimensionValue; height?: number }) {
  return <View style={[styles.bar, { width, height }]} />;
}

export function SkeletonCard() {
  const pulse = usePulse();
  return (
    <Animated.View style={[styles.card, pulse]} accessible accessibilityLabel="Loading">
      <Bar width={88} />
      <Bar width={200} height={20} />
      <View style={styles.media} />
      <Bar width={240} />
    </Animated.View>
  );
}

export function SkeletonListRow() {
  const pulse = usePulse();
  return (
    <Animated.View style={[styles.row, pulse]} accessible accessibilityLabel="Loading">
      <View style={styles.leading} />
      <View style={styles.lines}>
        <Bar width={160} />
        <Bar width={100} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    gap: space[12],
    padding: space[20],
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  row: {
    alignSelf: 'stretch',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  bar: {
    maxWidth: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.surface3,
  },
  media: {
    height: 64,
    borderRadius: radii.control,
    backgroundColor: colors.surface3,
  },
  leading: {
    width: 36,
    height: 36,
    borderRadius: radii.chip,
    backgroundColor: colors.surface3,
  },
  lines: {
    flex: 1,
    gap: space[8],
  },
});
