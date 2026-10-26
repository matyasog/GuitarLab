import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { ReduceMotion, SlideInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radii, space } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';
import { IconButton } from './IconButton';

type BottomSheetProps = {
  visible: boolean;
  title: string;
  children?: ReactNode;
  // Optional full-width button at the bottom, e.g. "Done".
  actionLabel?: string;
  onAction?: () => void;
  // Called by the ✕ button, a tap on the dimmed area and the system back gesture.
  onClose: () => void;
};

// Sheet that slides up from the bottom, from "Bottom sheet" in the design.
// Closing is by ✕, tapping outside or back; the grabber is visual only (no drag to close yet).
export function BottomSheet({ visible, title, children, actionLabel, onAction, onClose }: BottomSheetProps) {
  const reduceMotion = useReducedMotion();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      // The dimmed background fades in; only the sheet itself slides up (below).
      animationType={reduceMotion ? 'none' : 'fade'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.scrim}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessible={false} />
        <Animated.View
          entering={SlideInDown.duration(250).reduceMotion(ReduceMotion.System)}
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, space[16]) }]}
          accessibilityViewIsModal
        >
          <View style={styles.grabberArea}>
            <View style={styles.grabber} />
          </View>
          <View style={styles.body}>
            <View style={styles.header}>
              <AppText variant="title20" accessibilityRole="header" style={styles.title}>
                {title}
              </AppText>
              <IconButton icon="x" accessibilityLabel="Close" onPress={onClose} />
            </View>
            {children ? <View style={styles.content}>{children}</View> : null}
            {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} fullWidth /> : null}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.scrim,
  },
  sheet: {
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.surface,
  },
  grabberArea: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.line2,
  },
  body: {
    gap: space[16],
    paddingHorizontal: space[16],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  title: {
    flex: 1,
  },
  content: {
    gap: space[12],
  },
});
