import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, space } from '@/theme';

import { AppText } from './AppText';

type CardProps = {
  eyebrow?: string;
  title?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

// Surface for grouped content, from "Card" in the design: radius 16, hairline border, no shadow.
export function Card({ eyebrow, title, children, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {eyebrow || title ? (
        <View style={styles.header}>
          {eyebrow ? (
            <AppText variant="helper14" color="muted">
              {eyebrow}
            </AppText>
          ) : null}
          {title ? (
            <AppText variant="title20" accessibilityRole="header">
              {title}
            </AppText>
          ) : null}
        </View>
      ) : null}
      {children ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    gap: space[16],
    padding: space[20],
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  header: {
    gap: space[4],
  },
  content: {
    gap: space[12],
  },
});
