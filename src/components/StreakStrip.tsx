import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors, radii, space } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';

export type StreakDay = {
  // One letter, e.g. "M".
  label: string;
  // met = daily goal reached, missed = not reached, today = still open.
  state: 'met' | 'missed' | 'today';
};

type StreakStripProps = {
  days: number;
  // Text after the number, e.g. "day streak" or "day streak, start one today".
  label: string;
  // The last 7 days, oldest first; today is the last one.
  week: StreakDay[];
  // Today's practice minutes against the daily goal (the Today screen shows this ring).
  goal?: { minutes: number; target: number };
};

// Streak count, the week's goal pips and today's goal ring, from "Streak strip" in the design.
// Without `goal` it is the compact strip from the component kit.
export function StreakStrip({ days, label, week, goal }: StreakStripProps) {
  const countColor = days > 0 ? 'brass' : 'muted';
  const summary = goal
    ? `${days} ${label}. ${goal.minutes} of ${goal.target} minutes practised today.`
    : `${days} ${label}.`;

  return (
    <View style={[styles.strip, goal ? styles.withGoal : styles.compact]} accessible accessibilityLabel={summary}>
      <Icon name="flame" color="brass" />

      <View style={goal ? styles.countStacked : styles.countInline}>
        <AppText variant={goal ? 'monoStrong32' : 'monoStrong20'} color={countColor}>
          {days}
        </AppText>
        <AppText variant="helper14" color="text2" style={goal ? null : styles.inlineLabel}>
          {label}
        </AppText>
      </View>

      <View style={styles.week}>
        {week.map((day, index) => (
          <View key={index} style={styles.day}>
            <View style={[styles.pip, pipStyles[day.state]]} />
            <AppText
              variant={day.state === 'today' ? 'labelStrong12' : 'caption12'}
              color={day.state === 'today' ? 'text' : 'muted'}
            >
              {day.label}
            </AppText>
          </View>
        ))}
      </View>

      {goal ? <GoalRing minutes={goal.minutes} target={goal.target} /> : null}
    </View>
  );
}

const ringSize = 48;
// The design's ring is 16 % of the radius thick (innerRadius 0.84), about 4 pt.
const ringStroke = 4;
const ringRadius = (ringSize - ringStroke) / 2;
const ringLength = 2 * Math.PI * ringRadius;

function GoalRing({ minutes, target }: { minutes: number; target: number }) {
  const progress = target > 0 ? Math.min(1, minutes / target) : 0;

  return (
    <View style={styles.goal}>
      <View style={styles.ring}>
        {/* Rotated -90° so the arc starts at the top and fills clockwise. */}
        <Svg width={ringSize} height={ringSize} style={styles.ringSvg}>
          <Circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            stroke={colors.line2}
            strokeWidth={ringStroke}
            fill="none"
          />
          <Circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            stroke={colors.brass}
            strokeWidth={ringStroke}
            fill="none"
            strokeDasharray={`${ringLength * progress} ${ringLength}`}
          />
        </Svg>
        <AppText variant="monoStrong12" maxFontSizeMultiplier={1.2}>
          {minutes}/{target}
        </AppText>
      </View>
      <AppText variant="caption12" color="muted">
        min today
      </AppText>
    </View>
  );
}

const pipStyles = StyleSheet.create({
  met: {
    backgroundColor: colors.brass,
  },
  missed: {
    backgroundColor: colors.line2,
  },
  today: {
    borderWidth: 1.5,
    borderColor: colors.brass,
  },
});

const styles = StyleSheet.create({
  strip: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    borderRadius: radii.control,
    backgroundColor: colors.brassSoft,
  },
  compact: {
    minHeight: 56,
  },
  withGoal: {
    paddingVertical: space[16],
  },
  countInline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
  },
  inlineLabel: {
    flexShrink: 1,
  },
  countStacked: {
    flex: 1,
  },
  week: {
    flexDirection: 'row',
    gap: space[8],
  },
  day: {
    alignItems: 'center',
    gap: space[4],
  },
  pip: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
  },
  goal: {
    alignItems: 'center',
    gap: space[4],
  },
  ring: {
    width: ringSize,
    height: ringSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSvg: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
});
