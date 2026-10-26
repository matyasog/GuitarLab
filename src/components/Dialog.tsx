import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { colors, radii, space } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';

type DialogProps = {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel: string;
  // Also called for the system back gesture and a tap outside the dialog.
  onCancel: () => void;
};

// Centered confirmation box, from "Dialog" in the design (e.g. Practice "quit run?").
// Uses React Native's Modal, which also handles the Android back button and screen-reader focus.
export function Dialog({ visible, title, body, confirmLabel, onConfirm, cancelLabel, onCancel }: DialogProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduceMotion ? 'none' : 'fade'}
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.scrim}>
        {/* Tapping the dimmed area outside the box cancels. */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessible={false} />
        <View style={styles.dialog} accessibilityViewIsModal>
          <AppText variant="title20" accessibilityRole="header">
            {title}
          </AppText>
          <AppText variant="body14" color="text2">
            {body}
          </AppText>
          <View style={styles.actions}>
            <Button label={cancelLabel} variant="secondary" onPress={onCancel} style={styles.action} />
            <Button label={confirmLabel} onPress={onConfirm} style={styles.action} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space[16],
    backgroundColor: colors.scrim,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    gap: space[16],
    padding: space[20],
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  actions: {
    flexDirection: 'row',
    gap: space[12],
    paddingTop: space[4],
  },
  action: {
    flex: 1,
  },
});
