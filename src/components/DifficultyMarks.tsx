import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

// Five small bars, the first `level` lit, from "Difficulty N of 5" in the design.
// Hidden from screen readers: the parent's label says "difficulty N of 5".
export function DifficultyMarks({ level }: { level: number }) {
  return (
    <View style={styles.marks} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {[1, 2, 3, 4, 5].map((mark) => (
        <View key={mark} style={[styles.mark, { backgroundColor: mark <= level ? colors.text2 : colors.line2 }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  marks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  mark: {
    width: 4,
    height: 10,
    borderRadius: 2,
  },
});
