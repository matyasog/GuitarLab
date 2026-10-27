import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radii, space } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';

type StateMessageProps = {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  // Drawing shown instead of the icon circle, e.g. the faders at zero on You.
  illustration?: ReactNode;
};

type BaseProps = StateMessageProps & {
  icon: IconName;
  tone: 'empty' | 'error';
};

// Shared layout of "Empty state" and "Error state" in the design: icon in a circle,
// centred title and body, one button.
function StateMessage({ icon, tone, title, body, actionLabel, onAction, illustration }: BaseProps) {
  const isError = tone === 'error';

  return (
    <View style={styles.container} accessibilityRole={isError ? 'alert' : undefined}>
      {illustration ?? (
        <View style={[styles.iconCircle, { backgroundColor: isError ? colors.redSoft : colors.surface2 }]}>
          <Icon name={icon} size={24} color={isError ? 'red' : 'muted'} />
        </View>
      )}
      <View style={styles.text}>
        <AppText variant="title20" style={styles.centered}>
          {title}
        </AppText>
        <AppText variant="body14" color="muted" style={styles.centered}>
          {body}
        </AppText>
      </View>
      {actionLabel && onAction ? (
        isError ? (
          <Button label={actionLabel} variant="secondary" icon="rotate-cw" onPress={onAction} />
        ) : (
          <Button label={actionLabel} onPress={onAction} />
        )
      ) : null}
    </View>
  );
}

// Nothing to show yet, e.g. "No sessions yet". The icon depends on the screen.
export function EmptyState(props: StateMessageProps & { icon?: IconName }) {
  return <StateMessage icon={props.icon ?? 'music'} tone="empty" {...props} />;
}

// Loading failed, e.g. "Couldn't load your progress" with a "Try again" button.
export function ErrorState(props: StateMessageProps) {
  return <StateMessage icon="triangle-alert" tone="error" {...props} />;
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: space[16],
    paddingVertical: space[32],
    paddingHorizontal: space[24],
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    alignSelf: 'stretch',
    gap: space[8],
  },
  centered: {
    textAlign: 'center',
  },
});
