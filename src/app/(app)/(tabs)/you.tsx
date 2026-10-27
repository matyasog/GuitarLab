import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/IconButton';
import { AchievementGrid } from '@/components/progress/AchievementGrid';
import { FadersAtZero } from '@/components/progress/FadersAtZero';
import { RankCard } from '@/components/progress/RankCard';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionHeader } from '@/components/SectionHeader';
import { SkeletonCard } from '@/components/Skeleton';
import { StatTile } from '@/components/StatTile';
import { EmptyState, ErrorState } from '@/components/StateMessage';
import { achievements } from '@/data/achievements';
import { countDone } from '@/data/lessonSections';
import { lessons } from '@/data/lessons';
import { formatPractised } from '@/data/ranks';
import { useAuth } from '@/hooks/useAuth';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { emptyProgressSummary, useProgressSummary } from '@/hooks/useProgressSummary';
import { colors, radii, space } from '@/theme';

// You, from "You / regular / regular · empty" in the design. XP, streak, practice time and picks
// are SAMPLE numbers until step 6.4 (useProgressSummary). "Your mix" and the accuracy chart need
// real runs (step 7.6), so until then the designed empty mix card is shown.
// In development, "/you?preview=empty|loading|error" shows those states.
export default function You() {
  const { user } = useAuth();
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const loaded = useLessonProgress();
  const sampleSummary = useProgressSummary();

  const empty = __DEV__ && preview === 'empty';
  const summary = empty ? emptyProgressSummary() : sampleSummary;
  const status = __DEV__ && (preview === 'loading' || preview === 'error') ? preview : loaded.status;
  const lessonsDone = empty ? 0 : countDone(lessons, loaded.progress);
  const practised = formatPractised(summary.practisedMinutes);

  const header = (
    <ScreenHeader
      title={user?.displayName ?? 'You'}
      trailing={
        <IconButton icon="sliders-horizontal" accessibilityLabel="Settings" onPress={() => router.push('/settings')} />
      }
    />
  );

  if (status === 'error') {
    return (
      <Screen edges={['top', 'left', 'right']}>
        {header}
        <ErrorState title="Couldn't load your progress" body="Check your connection and try again." />
      </Screen>
    );
  }

  if (status === 'loading') {
    return (
      <Screen edges={['top', 'left', 'right']}>
        {header}
        <SkeletonCard />
        <SkeletonCard />
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'left', 'right']}>
      {header}

      <RankCard xp={summary.xp} />

      <View style={styles.stats}>
        <StatTile
          value={String(summary.streak)}
          label="day streak"
          valueColor={summary.streak > 0 ? 'brass' : 'subtle'}
          style={styles.stat}
        />
        <StatTile value={String(lessonsDone)} unit={`/${lessons.length}`} label="lessons done" style={styles.stat} />
        <StatTile value={practised.value} unit={practised.unit} label="practised" style={styles.stat} />
      </View>

      <View style={styles.mixCard}>
        <EmptyState
          illustration={<FadersAtZero />}
          title="Your mix starts at zero"
          body="Play three sessions and we'll show your rhythm, clean tone and speed here, plus how your accuracy changes week by week."
          actionLabel="Play your first session"
          onAction={() => router.navigate('/')}
        />
      </View>

      <View style={styles.picks}>
        <SectionHeader
          title="Pick collection"
          detail={`${summary.earnedAchievements.length} of ${achievements.length}`}
        />
        <AchievementGrid earned={summary.earnedAchievements} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    gap: space[8],
  },
  stat: {
    flex: 1,
  },
  picks: {
    gap: space[8],
  },
  mixCard: {
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line2,
  },
});
