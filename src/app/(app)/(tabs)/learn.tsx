import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { FilterChips } from '@/components/FilterChips';
import { LessonRow } from '@/components/LessonRow';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionHeader } from '@/components/SectionHeader';
import { SegmentedProgress } from '@/components/SegmentedProgress';
import { SkeletonListRow } from '@/components/Skeleton';
import { ErrorState } from '@/components/StateMessage';
import { buildLessonSections, countDone, unlockText } from '@/data/lessonSections';
import { categoryLabels, lessons } from '@/data/lessons';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { colors, radii, space } from '@/theme';
import type { LessonCategory } from '@/types/lesson';

type Filter = LessonCategory | 'all';

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...(Object.keys(categoryLabels) as LessonCategory[]).map((category) => ({
    value: category,
    label: categoryLabels[category],
  })),
];

// Learn, from "Learn / regular / regular · loading · error" in the design.
// In development, "/learn?preview=loading" or "?preview=error" shows those states.
export default function Learn() {
  const [filter, setFilter] = useState<Filter>('all');
  const loaded = useLessonProgress();
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const status = __DEV__ && (preview === 'loading' || preview === 'error') ? preview : loaded.status;
  const progress = loaded.progress;

  const doneCount = countDone(lessons, progress);

  // Tapping the selected category again goes back to All.
  const changeFilter = (next: Filter) => setFilter(next === filter ? 'all' : next);
  const sections = buildLessonSections(lessons, progress, filter);

  return (
    <Screen edges={['top', 'left', 'right']} padded={false}>
      <View>
        <View style={styles.header}>
          <ScreenHeader
            title="Learn"
            trailing={
              status === 'ready' ? (
                <AppText variant="monoStrong14" color="text2">
                  {doneCount} of {lessons.length} done
                </AppText>
              ) : null
            }
          />
          <SegmentedProgress
            done={status === 'ready' ? doneCount : 0}
            total={lessons.length}
            accessibilityLabel="Lessons done"
          />
        </View>

        <View style={styles.filter}>
          <FilterChips
            options={filters}
            value={filter}
            onChange={changeFilter}
            accessibilityLabel="Lesson category"
            selectedHint={filter === 'all' ? undefined : 'Tap again to show all lessons'}
          />
        </View>

        <View style={styles.list}>
          {status === 'loading' ? (
            <View style={styles.skeletons}>
              {Array.from({ length: 7 }, (_, index) => (
                <SkeletonListRow key={index} />
              ))}
            </View>
          ) : status === 'error' ? (
            <ErrorState
              title="Couldn't load your progress"
              body="Lessons are on your phone, but your scores live online. Check your connection and try again."
            />
          ) : (
            sections.map((section) => (
              <View key={section.status} style={styles.section}>
                <SectionHeader title={section.title} />
                <View style={[styles.group, section.status === 'locked' && styles.lockedGroup]}>
                  {section.lessons.map((lesson, index) => (
                    <View key={lesson.id} style={index < section.lessons.length - 1 && styles.divider}>
                      <LessonRow
                        lesson={lesson}
                        status={section.status}
                        progress={progress[lesson.id]}
                        unlockText={unlockText(lesson, progress)}
                        onPress={() => router.push({ pathname: '/lesson/[lessonId]', params: { lessonId: lesson.id } })}
                      />
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: space[12],
    paddingTop: space[8],
    paddingHorizontal: space[16],
  },
  filter: {
    paddingTop: space[16],
    paddingBottom: space[8],
  },
  list: {
    gap: space[24],
    paddingTop: space[8],
    paddingHorizontal: space[16],
    paddingBottom: space[24],
  },
  skeletons: {
    gap: space[8],
  },
  section: {
    gap: space[8],
  },
  group: {
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  lockedGroup: {
    borderColor: colors.line2,
    backgroundColor: colors.bgClear,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
});
