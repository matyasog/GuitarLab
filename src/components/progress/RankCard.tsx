import { StyleSheet, View } from 'react-native';

import { rankForLevel, rankRange, ranks, xpProgress } from '@/data/ranks';
import { colors, radii, space } from '@/theme';

import { AppText } from '../AppText';
import { ProgressBar } from '../ProgressBar';
import { Pick } from './Pick';

// Level, rank and XP on You, from "Rank card" in the design: a brass pick with the level,
// the rank name, the XP bar and a ladder of the four ranks (current, next, future).
export function RankCard({ xp }: { xp: number }) {
  const progress = xpProgress(xp);
  const rank = rankForLevel(progress.level);
  const rankIndex = ranks.indexOf(rank);

  return (
    <View style={styles.card}>
      <View style={styles.levelRow}>
        <View accessible accessibilityLabel={`Level ${progress.level}`}>
          <Pick width={52} height={57} look="metal">
            <AppText variant="monoStrong24" color="enamelInk" maxFontSizeMultiplier={1}>
              {progress.level}
            </AppText>
          </Pick>
        </View>
        <View style={styles.levelText}>
          <AppText variant="title20">{rank.name}</AppText>
          <ProgressBar
            progress={progress.fraction}
            caption={progress.text}
            captionMono
            accessibilityLabel={`XP to level ${progress.nextLevel}`}
          />
        </View>
      </View>

      <View style={styles.ladder}>
        {ranks.map((step, index) => {
          const state = index === rankIndex ? 'current' : index === rankIndex + 1 ? 'next' : 'other';
          return (
            <View
              key={step.name}
              style={styles.step}
              accessible
              accessibilityLabel={`${step.name}, ${rankRange(step).replace('Lv', 'level')}${state === 'current' ? ', your rank' : ''}`}
            >
              <Pick width={22} height={24} look={state === 'current' ? 'metal' : state === 'next' ? 'next' : 'dim'} />
              <AppText
                variant={state === 'current' ? 'labelStrong12' : 'caption12'}
                color={state === 'current' ? 'brass' : state === 'next' ? 'text2' : 'subtle'}
                style={styles.center}
              >
                {step.name}
              </AppText>
              <AppText variant="mono12" color={state === 'current' ? 'text2' : 'subtle'}>
                {rankRange(step)}
              </AppText>
            </View>
          );
        })}
      </View>
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
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[16],
  },
  levelText: {
    flex: 1,
    gap: space[8],
  },
  ladder: {
    flexDirection: 'row',
    gap: space[4],
    paddingTop: space[16],
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    gap: space[4],
  },
  center: {
    textAlign: 'center',
  },
});
