import { Pressable, StyleSheet, View } from 'react-native';

import { minTouchTarget, space } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';

type SectionHeaderProps = {
  title: string;
  // Optional link on the right, e.g. "All lessons".
  actionLabel?: string;
  onAction?: () => void;
  // Optional plain text on the right instead of a link, e.g. "4 of 12".
  detail?: string;
};

// Title above a group of rows or cards, from "Section header" in the design.
export function SectionHeader({ title, actionLabel, onAction, detail }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <AppText variant="title20" accessibilityRole="header" style={styles.title}>
        {title}
      </AppText>

      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
        >
          <AppText variant="labelStrong14" color="text2">
            {actionLabel}
          </AppText>
          <Icon name="chevron-right" size={16} color="text2" />
        </Pressable>
      ) : detail ? (
        <AppText variant="monoStrong14" color="muted">
          {detail}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[12],
  },
  title: {
    flexShrink: 1,
  },
  action: {
    minHeight: minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    paddingLeft: space[12],
  },
  actionPressed: {
    opacity: 0.7,
  },
});
