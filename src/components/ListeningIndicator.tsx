import { StyleSheet, View } from 'react-native';

import { colors, radii, space } from '@/theme';

import { AppText } from './AppText';

const barHeights = [4, 6, 8, 10, 12, 14];

type ListeningIndicatorProps = {
  // Input level 0 … 1; lights that many of the 6 bars. Omit to hide the bars.
  level?: number;
};

// Green dot + "Listening" + input level, from "Listening indicator" in the design.
// Shown whenever the microphone is on (privacy promise on the onboarding screen).
export function ListeningIndicator({ level }: ListeningIndicatorProps) {
  const litBars = level === undefined ? 0 : Math.round(Math.min(1, Math.max(0, level)) * barHeights.length);

  return (
    <View style={styles.row} accessible accessibilityLabel="Listening">
      <View style={styles.dot} />
      <AppText variant="helper14" color="muted">
        Listening
      </AppText>
      {level !== undefined ? (
        <View style={styles.bars}>
          {barHeights.map((height, index) => (
            <View
              key={height}
              style={[styles.bar, { height, backgroundColor: index < litBars ? colors.green : colors.line2 }]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.green,
  },
  bars: {
    height: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    width: 3,
  },
});
