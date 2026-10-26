import { Pressable, StyleSheet, View } from 'react-native';

import { colors, minTouchTarget, radii, space, type ColorName } from '@/theme';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

type ToastTone = 'info' | 'success' | 'error';

const tones: Record<ToastTone, { icon: IconName; color: ColorName }> = {
  info: { icon: 'wifi-off', color: 'muted' },
  success: { icon: 'circle-check', color: 'green' },
  error: { icon: 'circle-alert', color: 'red' },
};

type ToastProps = {
  tone: ToastTone;
  message: string;
  // Optional second line, e.g. "Practice still works. Your scores and streak sync…".
  detail?: string;
  // Different icon than the tone's default (info uses wifi-off for the offline banner).
  icon?: IconName;
  // Optional action on the right, e.g. "Retry".
  actionLabel?: string;
  onAction?: () => void;
};

// Message banner, from "Toast / info · success · error" in the design.
// The screens place it inside the content (e.g. Today's offline banner), not floating.
export function Toast({ tone, message, detail, icon, actionLabel, onAction }: ToastProps) {
  const look = tones[tone];
  const hasAction = actionLabel !== undefined && onAction !== undefined;

  return (
    <View
      style={[styles.toast, hasAction && styles.withAction]}
      // Screen readers announce the message when it appears.
      accessibilityLiveRegion={tone === 'error' ? 'assertive' : 'polite'}
      accessibilityRole={tone === 'error' ? 'alert' : undefined}
    >
      <Icon name={icon ?? look.icon} color={look.color} />
      <View style={styles.message}>
        <AppText variant="message14">{message}</AppText>
        {detail ? (
          <AppText variant="helper14" color="muted">
            {detail}
          </AppText>
        ) : null}
      </View>
      {hasAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
        >
          <AppText variant="labelStrong14" color="amber">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: colors.line2,
    backgroundColor: colors.surface3,
    // The one soft shadow allowed on a card-like element (y 8, blur 24).
    // color.shadow already contains its transparency, so opacity stays 1.
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  withAction: {
    paddingRight: space[4],
  },
  message: {
    flex: 1,
    gap: 2,
    paddingVertical: 14,
  },
  action: {
    minHeight: minTouchTarget,
    paddingHorizontal: space[12],
    borderRadius: radii.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPressed: {
    backgroundColor: colors.surface2,
  },
});
