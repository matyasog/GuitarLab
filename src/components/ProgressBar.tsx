import { StyleSheet, View } from 'react-native';

import { colors, radii, space } from '@/theme';

import { AppText } from './AppText';

type ProgressBarProps = {
  // 0 … 1
  progress: number;
  // Left of the top row, e.g. "Level 4 · Bedroom Player".
  title?: string;
  // Right of the top row in brass, e.g. "1,240 / 1,600 XP".
  valueText?: string;
  // Line under the bar, e.g. "360 XP to level 5 · Garage Band".
  caption?: string;
  // DM Mono caption for numbers, e.g. "1,240 / 1,600 XP to level 5" on You.
  captionMono?: boolean;
  accessibilityLabel: string;
};

// Brass progress bar (XP), from "Progress bar / XP" in the design.
export function ProgressBar({ progress, title, valueText, caption, captionMono, accessibilityLabel }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const percent = Math.round(clamped * 100);

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: percent, text: valueText }}
    >
      {title || valueText ? (
        <View style={styles.top}>
          {title ? (
            <AppText variant="labelStrong14" style={styles.title}>
              {title}
            </AppText>
          ) : null}
          {valueText ? (
            <AppText variant="monoStrong14" color="brass">
              {valueText}
            </AppText>
          ) : null}
        </View>
      ) : null}

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>

      {caption ? (
        <AppText variant={captionMono ? 'mono14' : 'helper14'} color="muted">
          {caption}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    gap: space[8],
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[8],
  },
  title: {
    flexShrink: 1,
  },
  track: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.brass,
  },
});
