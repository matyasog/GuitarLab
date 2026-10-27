import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { DifficultyMarks } from '@/components/DifficultyMarks';
import { ScaleShape } from '@/components/fretboard/ScaleShape';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SkeletonCard } from '@/components/Skeleton';
import { StatTile } from '@/components/StatTile';
import { EmptyState, ErrorState } from '@/components/StateMessage';
import { Tag } from '@/components/Tag';
import { TempoOptions } from '@/components/TempoOptions';
import { Toast } from '@/components/Toast';
import { goalTempo, tempoOptions } from '@/data/lessonTempo';
import { categoryLabels, findLesson } from '@/data/lessons';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useProfile } from '@/hooks/useProfile';
import { colors, radii, space } from '@/theme';

// Lesson detail, from "Lesson detail / regular / default · tempo-64" in the design.
// Opened from a Learn row. In development, "?preview=loading" or "?preview=error" shows those
// states (not in the design).
export default function LessonDetail() {
  const { lessonId, preview } = useLocalSearchParams<{ lessonId: string; preview?: string }>();
  const lesson = findLesson(lessonId);
  const loaded = useLessonProgress();
  const { profile } = useProfile();
  const [bpm, setBpm] = useState(lesson?.bpm ?? 0);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const status = __DEV__ && (preview === 'loading' || preview === 'error') ? preview : loaded.status;
  const back = () => router.back();

  if (!lesson) {
    return (
      <Screen>
        <ScreenHeader onBack={back} />
        <EmptyState title="Lesson not found" body="Go back to Learn and pick another lesson." />
      </Screen>
    );
  }

  const header = (
    <ScreenHeader
      onBack={back}
      trailing={
        <View
          style={styles.headerMeta}
          accessible
          accessibilityLabel={`${categoryLabels[lesson.category]}, difficulty ${lesson.difficulty} of 5`}
        >
          <Tag category={lesson.category} />
          <DifficultyMarks level={lesson.difficulty} />
        </View>
      }
    />
  );

  if (status === 'error') {
    return (
      <Screen>
        {header}
        <ErrorState title="Couldn't load this lesson" body="Check your connection and try again." />
      </Screen>
    );
  }

  if (status === 'loading') {
    return (
      <Screen>
        {header}
        <SkeletonCard />
        <SkeletonCard />
      </Screen>
    );
  }

  const progress = loaded.progress[lesson.id];

  const play = () => {
    if (lesson.hasExercises) {
      // The Practice run arrives in step 7.4; until then Play only answers in development.
      setShowComingSoon(__DEV__);
      return;
    }
    setShowComingSoon(true);
  };

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          {showComingSoon ? (
            lesson.hasExercises ? (
              <Toast
                tone="info"
                icon="sparkles"
                message="Dev: Practice opens here from step 7.4."
                onClose={() => setShowComingSoon(false)}
              />
            ) : (
              <Toast
                tone="info"
                icon="sparkles"
                message="Coming soon"
                detail="We're still writing the exercises for this lesson. Check back after the next update."
                onClose={() => setShowComingSoon(false)}
              />
            )
          ) : null}
          <Button label={`Play at ${bpm} BPM`} icon="play" fullWidth onPress={play} />
        </View>
      }
    >
      {header}

      <View style={styles.titleBlock}>
        <AppText variant="title24" accessibilityRole="header">
          {lesson.title}
        </AppText>
        {lesson.description ? (
          <AppText variant="body14" color="text2">
            {lesson.description}
          </AppText>
        ) : null}
      </View>

      {lesson.shape ? <ScaleShape shape={lesson.shape} mirrored={profile?.settings.hand === 'left'} /> : null}

      <View style={styles.stats}>
        {/* Never played: a dash and 0 runs (not in the design). */}
        <StatTile
          value={progress?.bestScore !== undefined ? String(progress.bestScore) : '–'}
          unit={progress?.bestScore !== undefined ? '%' : undefined}
          label="Your best"
          valueColor={progress?.bestScore !== undefined ? 'text' : 'muted'}
          style={styles.stat}
        />
        <StatTile value={String(progress?.runs ?? 0)} label="Runs" style={styles.stat} />
        <StatTile value={String(goalTempo(lesson))} unit="BPM" label="Goal" style={styles.stat} />
      </View>

      <View style={styles.tempo}>
        <AppText variant="heading16">Tempo</AppText>
        <TempoOptions options={tempoOptions(lesson)} value={bpm} onChange={setBpm} />
      </View>

      <TuneNudge />
    </Screen>
  );
}

// "Tune-first nudge (opens Tuner)" from the design: a bordered row; the whole row opens the Tuner.
function TuneNudge() {
  return (
    <Pressable
      onPress={() => router.push('/tools/tuner')}
      accessibilityRole="button"
      accessibilityLabel="Tune. Tuned up today? A quick check makes your pitch score fair."
      style={({ pressed }) => [styles.nudge, pressed && styles.nudgePressed]}
    >
      <View style={styles.nudgeIcon}>
        <Icon name="target" color="text2" />
      </View>
      <AppText variant="helper14" color="text2" style={styles.nudgeText}>
        Tuned up today? A quick check makes your pitch score fair.
      </AppText>
      <AppText variant="labelStrong14" color="amber">
        Tune
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  titleBlock: {
    gap: space[8],
  },
  stats: {
    flexDirection: 'row',
    gap: space[8],
  },
  stat: {
    flex: 1,
  },
  tempo: {
    gap: space[8],
  },
  nudge: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: space[12],
    paddingHorizontal: space[16],
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: colors.line2,
  },
  nudgePressed: {
    backgroundColor: colors.surface,
  },
  nudgeIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.chip,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nudgeText: {
    flex: 1,
  },
  footer: {
    gap: space[8],
  },
});
