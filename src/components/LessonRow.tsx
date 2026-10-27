import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { categoryLabels } from '@/data/lessons';
import { colors, minTouchTarget, radii, space } from '@/theme';
import type { Lesson, LessonCategory, LessonProgress, LessonStatus } from '@/types/lesson';

import { AppText } from './AppText';
import { DifficultyMarks } from './DifficultyMarks';
import { Icon, type IconName } from './Icon';
import { categoryColors } from './Tag';

// Icon per category, from the Learn design.
export const categoryIcons: Record<LessonCategory, IconName> = {
  rhythm: 'drum',
  scales: 'chart-no-axes-column-increasing',
  melody: 'music',
  arp: 'audio-waveform',
};

type LessonRowProps = {
  lesson: Lesson;
  // Worked out by lessonStatus() in src/data/lessonSections.ts.
  status: LessonStatus;
  progress?: LessonProgress;
  // For locked lessons: the "Unlocks when …" sentence shown under "How to unlock".
  unlockText?: string;
  onPress?: () => void;
};

// One lesson in the Learn list, from the "Lesson / …" rows in the design: category icon,
// title, "Category · BPM" with difficulty marks, and on the right the best score, a NEW tag,
// or (when locked) a "How to unlock" link that opens an explanation below.
export function LessonRow({ lesson, status, progress, unlockText, onPress }: LessonRowProps) {
  const [showUnlock, setShowUnlock] = useState(false);
  const locked = status === 'locked';
  const colorsFor = categoryColors[lesson.category];

  const meta = [categoryLabels[lesson.category], `${lesson.bpm} BPM`, lesson.goalBpm ? `goal ${lesson.goalBpm}` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <View>
      <Pressable
        onPress={onPress}
        disabled={!onPress || locked}
        accessibilityRole={onPress && !locked ? 'button' : undefined}
        accessibilityLabel={[
          lesson.title,
          meta,
          `difficulty ${lesson.difficulty} of 5`,
          locked ? 'locked' : null,
          progress?.bestScore !== undefined ? `best ${progress.bestScore}%` : status === 'up-next' ? 'new' : null,
        ]
          .filter(Boolean)
          .join(', ')}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <View style={[styles.iconBox, { backgroundColor: locked ? colors.surface2 : colors[colorsFor.background] }]}>
          <Icon name={locked ? 'lock' : categoryIcons[lesson.category]} color={locked ? 'muted' : colorsFor.color} />
        </View>

        <View style={styles.text}>
          <AppText variant="label16">{lesson.title}</AppText>
          <View style={styles.meta}>
            <AppText variant="helper14" color="muted">
              {meta}
            </AppText>
            <DifficultyMarks level={lesson.difficulty} />
          </View>
        </View>

        {locked && unlockText ? (
          <Pressable
            onPress={() => setShowUnlock((open) => !open)}
            accessibilityRole="button"
            accessibilityLabel="How to unlock"
            accessibilityState={{ expanded: showUnlock }}
            style={styles.unlockLink}
          >
            <AppText variant="labelStrong14" color="amber">
              How to unlock
            </AppText>
            <Icon name={showUnlock ? 'chevron-up' : 'chevron-down'} size={16} color="amber" />
          </Pressable>
        ) : progress?.bestScore !== undefined ? (
          <AppText variant="monoStrong14" color={status === 'done' ? 'green' : 'text2'}>
            {progress.bestScore}%
          </AppText>
        ) : status === 'up-next' ? (
          <View style={styles.newTag}>
            <AppText variant="labelStrong12" color="text2">
              NEW
            </AppText>
          </View>
        ) : null}
      </Pressable>

      {showUnlock && unlockText ? (
        <AppText variant="helper14" color="text2" style={styles.unlockText}>
          {unlockText}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: space[12],
    paddingHorizontal: space[16],
  },
  pressed: {
    backgroundColor: colors.surface2,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space[8],
  },
  newTag: {
    minHeight: 28,
    justifyContent: 'center',
    paddingHorizontal: space[12],
    borderRadius: radii.chip,
    backgroundColor: colors.surface2,
  },
  unlockLink: {
    minHeight: minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  unlockText: {
    // Lines up with the title (16 padding + 36 icon + 12 gap = 64, as in the design).
    paddingLeft: 64,
    paddingRight: space[16],
    paddingBottom: space[16],
  },
});
