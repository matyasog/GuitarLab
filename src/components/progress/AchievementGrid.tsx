import { StyleSheet, View } from 'react-native';

import { sortAchievements } from '@/data/achievements';
import { space } from '@/theme';

import { AppText } from '../AppText';
import { Pick } from './Pick';

const perRow = 3;

// "Pick collection" on You: every achievement as a pick, 3 per row, earned ones first.
// Earned picks are brass with dark glyphs; the others are dim outlines.
export function AchievementGrid({ earned }: { earned: string[] }) {
  const items = sortAchievements(earned);
  const rows = Array.from({ length: Math.ceil(items.length / perRow) }, (_, index) =>
    items.slice(index * perRow, index * perRow + perRow),
  );

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => {
            const isEarned = earned.includes(item.id);
            return (
              <View
                key={item.id}
                style={styles.badge}
                accessible
                accessibilityLabel={`${item.name}, ${isEarned ? 'earned' : 'not earned'}`}
              >
                <Pick width={56} height={62} look={isEarned ? 'metal' : 'dim'}>
                  {/* Three-character glyphs (120, 100) are a size smaller, as in the design. */}
                  <AppText
                    variant={item.glyph.length >= 3 ? 'monoStrong16' : 'monoStrong20'}
                    color={isEarned ? 'enamelInk' : 'subtle'}
                    maxFontSizeMultiplier={1}
                  >
                    {item.glyph}
                  </AppText>
                </Pick>
                <AppText variant="caption12" color={isEarned ? 'text2' : 'subtle'} style={styles.name}>
                  {item.name}
                </AppText>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: space[8],
  },
  row: {
    flexDirection: 'row',
    gap: space[8],
  },
  badge: {
    flex: 1,
    alignItems: 'center',
    gap: space[8],
    paddingVertical: space[8],
  },
  name: {
    textAlign: 'center',
  },
});
