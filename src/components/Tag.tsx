import { StyleSheet, View } from 'react-native';

import { colors, radii, space, type ColorName } from '@/theme';

import { AppText } from './AppText';

export type LessonCategory = 'rhythm' | 'scales' | 'melody' | 'arp';

// Label and colours per lesson category, from "Tag / …" in the design.
const tags: Record<LessonCategory, { label: string; color: ColorName; background: ColorName }> = {
  rhythm: { label: 'Rhythm', color: 'catRhythm', background: 'catRhythmBg' },
  scales: { label: 'Scales', color: 'catScales', background: 'catScalesBg' },
  melody: { label: 'Melody', color: 'catMelody', background: 'catMelodyBg' },
  arp: { label: 'Arpeggios', color: 'catArp', background: 'catArpBg' },
};

export function Tag({ category }: { category: LessonCategory }) {
  const tag = tags[category];
  return (
    <View style={[styles.tag, { backgroundColor: colors[tag.background] }]}>
      <AppText variant="labelStrong12" color={tag.color}>
        {tag.label}
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
