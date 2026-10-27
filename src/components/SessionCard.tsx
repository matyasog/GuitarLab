import { StyleSheet, View } from 'react-native';

import { colors, radii, space } from '@/theme';
import type { Lesson } from '@/types/lesson';

import { AppText } from './AppText';
import { Button } from './Button';
import { ScaleShape } from './fretboard/ScaleShape';
import { Icon } from './Icon';
import { Tag } from './Tag';

type SessionCardProps = {
  lesson: Lesson;
  // "Tonight's session", "Your first session", …
  kicker: string;
  coach?: string;
  mirrored?: boolean;
  onPlay: () => void;
  onDetails: () => void;
};

// The session card on Today, from "Session card" in the design: a small fretboard preview,
// the lesson, chips (tempo, length, category), a coach line, Play / Details and a landscape hint.
export function SessionCard({ lesson, kicker, coach, mirrored, onPlay, onDetails }: SessionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        {lesson.shape ? <ScaleShape shape={lesson.shape} mirrored={mirrored} variant="preview" /> : null}
        <View style={styles.header}>
          <AppText variant="helper14" color="muted">
            {kicker}
          </AppText>
          <AppText variant="title20" accessibilityRole="header">
            {lesson.title}
          </AppText>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.chips}>
          <Chip label={`${lesson.bpm} BPM`} />
          {lesson.minutes ? <Chip label={`≈ ${lesson.minutes} min`} accessibilityLabel={`about ${lesson.minutes} minutes`} /> : null}
          <Tag category={lesson.category} />
        </View>

        {coach ? (
          <AppText variant="body14" color="text2">
            {coach}
          </AppText>
        ) : null}

        <View style={styles.actions}>
          <Button label="Play" icon="play" onPress={onPlay} style={styles.play} />
          <Button
            label="Details"
            variant="secondary"
            onPress={onDetails}
            accessibilityHint="Opens the lesson details"
          />
        </View>

        <View style={styles.hint}>
          <Icon name="rotate-ccw-square" size={16} color="muted" />
          <AppText variant="caption12" color="muted" style={styles.hintText}>
            Opens in landscape. Prop your phone on a stand.
          </AppText>
        </View>
      </View>
    </View>
  );
}

// Grey chip with a number, e.g. "72 BPM" (a Tag with surface-2 and DM Mono in the design).
function Chip({ label, accessibilityLabel }: { label: string; accessibilityLabel?: string }) {
  return (
    <View style={styles.chip} accessible accessibilityLabel={accessibilityLabel ?? label}>
      <AppText variant="monoStrong12" color="text2">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space[16],
    padding: space[20],
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  top: {
    gap: space[16],
  },
  header: {
    gap: space[4],
  },
  content: {
    gap: space[12],
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[8],
  },
  chip: {
    minHeight: 28,
    justifyContent: 'center',
    paddingHorizontal: space[12],
    borderRadius: radii.chip,
    backgroundColor: colors.surface2,
  },
  actions: {
    flexDirection: 'row',
    gap: space[12],
  },
  play: {
    flex: 1,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
  },
  hintText: {
    flex: 1,
  },
});
