import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { minTouchTarget, space } from '@/theme';

import { AppText } from './AppText';
import { IconButton } from './IconButton';

type ScreenHeaderProps = {
  title: string;
  // With onBack: "Screen header / back" (back button + smaller title).
  // Without: "Screen header / tool" (big title, used on tab screens).
  onBack?: () => void;
  // Right side: e.g. the Listening indicator, the Settings button or "Clear" / "All chords".
  trailing?: ReactNode;
};

// Header row at the top of a screen's content, from "Screen header / …" in the design.
export function ScreenHeader({ title, onBack, trailing }: ScreenHeaderProps) {
  if (onBack) {
    return (
      <View style={styles.row}>
        <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={onBack} />
        <AppText variant="title20" accessibilityRole="header" style={styles.title}>
          {title}
        </AppText>
        {/* Keeps the title's position the same whether or not there is a trailing element. */}
        <View style={styles.trailingSlot}>{trailing}</View>
      </View>
    );
  }

  return (
    <View style={[styles.row, styles.spread]}>
      <AppText variant="title24" accessibilityRole="header" style={styles.title}>
        {title}
      </AppText>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  spread: {
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
  },
  trailingSlot: {
    minWidth: minTouchTarget,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
