import { StyleSheet, View } from 'react-native';

import { categoryLabels } from '@/data/lessons';
import { colors, radii, space, type ColorName } from '@/theme';
import type { LessonCategory } from '@/types/lesson';

import { AppText } from './AppText';

// Colours per lesson category, from "Tag / …" in the design.
export const categoryColors: Record<LessonCategory, { color: ColorName; background: ColorName }> = {
  rhythm: { color: 'catRhythm', background: 'catRhythmBg' },
  scales: { color: 'catScales', background: 'catScalesBg' },
  melody: { color: 'catMelody', background: 'catMelodyBg' },
  arp: { color: 'catArp', background: 'catArpBg' },
};

export function Tag({ category }: { category: LessonCategory }) {
  const tag = categoryColors[category];
  return (
    <View style={[styles.tag, { backgroundColor: colors[tag.background] }]}>
      <AppText variant="labelStrong12" color={tag.color}>
        {categoryLabels[category]}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    minHeight: 28,
    paddingHorizontal: space[12],
    borderRadius: radii.chip,
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
});
