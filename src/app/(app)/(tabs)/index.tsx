import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { categoryIcons } from '@/components/LessonRow';
import { LevelBadge } from '@/components/LevelBadge';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { SessionCard } from '@/components/SessionCard';
import { SkeletonCard, SkeletonListRow } from '@/components/Skeleton';
import { StreakStrip } from '@/components/StreakStrip';
import { ErrorState } from '@/components/StateMessage';
import { categoryColors } from '@/components/Tag';
import { Toast } from '@/components/Toast';
import { lessonStatus } from '@/data/lessonSections';
import { categoryLabels, lessons } from '@/data/lessons';
import { levelForXp } from '@/data/ranks';
import { pickSession, pickUpNext, sessionCoach, sessionKicker } from '@/data/todayPicks';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useIsOffline } from '@/hooks/useNetworkStatus';
import { useProfile } from '@/hooks/useProfile';
import { emptyProgressSummary, useProgressSummary } from '@/hooks/useProgressSummary';
import { colors, radii, space } from '@/theme';
import type { Lesson, LessonProgress } from '@/types/lesson';

type Preview = 'first-day' | 'offline' | 'loading' | 'error';

// Today, from "Today / regular / regular · first-day · offline · loading" in the design.
// Streak, level and minutes are SAMPLE numbers until step 6.4 (useProgressSummary). In development,
// "/?preview=first-day|offline|loading|error" shows those states.
export default function Today() {
  const { preview: previewParam } = useLocalSearchParams<{ preview?: string }>();
  const preview = __DEV__ ? (previewParam as Preview | undefined) : undefined;
  const { profile } = useProfile();
  const loaded = useLessonProgress();
  const sampleSummary = useProgressSummary();
  const isOffline = useIsOffline() || preview === 'offline';
  const [showPlayNote, setShowPlayNote] = useState(false);

  const firstDay = preview === 'first-day';
  const summary = firstDay ? emptyProgressSummary() : sampleSummary;
  const progress: Record<string, LessonProgress> = firstDay ? {} : loaded.progress;
  const status = preview === 'loading' || preview === 'error' ? preview : loaded.status;

  const now = new Date();
  const name = profile?.displayName ?? '';
  const goalMinutes = profile?.settings.dailyGoalMin ?? 15;

  const header = (
    <View style={styles.header}>
      <View style={styles.greeting}>
        <AppText variant="helper14" color="muted">
          {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </AppText>
        <AppText variant="title24" accessibilityRole="header">
          {firstDay ? `Welcome, ${name}` : `Hi, ${name}`}
        </AppText>
      </View>
      <LevelBadge level={levelForXp(summary.xp)} onPress={() => router.navigate('/you')} />
    </View>
  );

  if (status === 'error') {
    return (
      <Screen edges={['top', 'left', 'right']} gap={24}>
        {header}
        <ErrorState title="Couldn't load your progress" body="Check your connection and try again." />
      </Screen>
    );
  }

  if (status === 'loading') {
    return (
      <Screen edges={['top', 'left', 'right']} gap={24}>
        {header}
        <SkeletonCard />
        <SkeletonCard />
        <View>
          <SkeletonListRow />
          <SkeletonListRow />
          <SkeletonListRow />
        </View>
      </Screen>
    );
  }

  const session = pickSession(lessons, progress);
  const upNext = pickUpNext(lessons, progress, session.lesson.id);
  const openLesson = (lesson: Lesson) =>
    router.push({ pathname: '/lesson/[lessonId]', params: { lessonId: lesson.id } });

  return (
    // No bottom edge: the tab bar below already keeps clear of the home indicator.
    <Screen edges={['top', 'left', 'right']} gap={24}>
      {header}

      {isOffline ? (
        <Toast
          tone="info"
          message="You're offline."
          detail="Practice still works. Your scores and streak sync when you're back online."
        />
      ) : null}

      <StreakStrip
        days={summary.streak}
        label={summary.streak > 0 ? 'day streak' : 'day streak, start one today'}
        week={summary.week}
        goal={{ minutes: summary.minutesToday, target: goalMinutes }}
      />

      <View style={styles.session}>
        <SessionCard
          lesson={session.lesson}
          kicker={sessionKicker(session, now.getHours())}
          coach={sessionCoach(session)}
          mirrored={profile?.settings.hand === 'left'}
          // The Practice run arrives in step 7.4; until then Play only answers in development.
          onPlay={() => setShowPlayNote(__DEV__)}
          onDetails={() => openLesson(session.lesson)}
        />
        {showPlayNote ? (
          <Toast
            tone="info"
            icon="sparkles"
            message="Dev: Practice opens here from step 7.4."
            onClose={() => setShowPlayNote(false)}
          />
        ) : null}
      </View>

      <View style={styles.upNext}>
        <SectionHeader
          title={session.firstSession ? 'After that' : 'Up next'}
          actionLabel="All lessons"
          onAction={() => router.navigate('/learn')}
        />
        <View style={styles.list}>
          {upNext.map((lesson, index) => (
            <View key={lesson.id} style={index === upNext.length - 1 && styles.lastRow}>
              <ListRow
                title={lesson.title}
                subtitle={rowMeta(lesson, progress)}
                icon={categoryIcons[lesson.category]}
                iconColor={categoryColors[lesson.category].color}
                iconBackground={categoryColors[lesson.category].background}
                onPress={() => openLesson(lesson)}
              />
            </View>
          ))}
        </View>
      </View>

      {__DEV__ ? (
        <Button
          label="Component gallery"
          variant="ghost"
          onPress={() => router.push('/dev/gallery')}
          accessibilityHint="Opens the developer gallery of all base components"
          fullWidth
        />
      ) : null}
    </Screen>
  );
}

// "Rhythm · 80 BPM · best 71%" or "Melody · 100 BPM · new", as in the design.
function rowMeta(lesson: Lesson, progress: Record<string, LessonProgress>): string {
  const best = progress[lesson.id]?.bestScore;
  const end = lessonStatus(lesson, progress) === 'up-next' || best === undefined ? 'new' : `best ${best}%`;
  return `${categoryLabels[lesson.category]} · ${lesson.bpm} BPM · ${end}`;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[12],
  },
  greeting: {
    flex: 1,
    gap: space[4],
  },
  session: {
    gap: space[8],
  },
  upNext: {
    gap: space[8],
  },
  list: {
    overflow: 'hidden',
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  lastRow: {
    // The last row has no line below (strokeWidth 0 in the design).
    marginBottom: -1,
  },
});
