import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { colors, radii, space } from '@/theme';

import { AppText } from './AppText';
import { IconButton } from './IconButton';

const totalSteps = 4;

// Top of each onboarding screen, from "Onboarding header" in the design: back button,
// a 4-part progress bar (amber up to the current step) and "2/4".
export function OnboardingHeader({ step }: { step: number }) {
  return (
    <View style={styles.row}>
      <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} disabled={step === 1} />
      <View
        style={styles.progress}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`Step ${step} of ${totalSteps}`}
        accessibilityValue={{ min: 1, max: totalSteps, now: step }}
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <View key={index} style={[styles.segment, index < step && styles.segmentDone]} />
        ))}
      </View>
      <AppText variant="mono14" color="muted" importantForAccessibility="no">
        {step}/{totalSteps}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  progress: {
    flex: 1,
    height: 4,
    flexDirection: 'row',
    gap: space[4],
  },
  segment: {
    flex: 1,
    borderRadius: radii.pill,
    backgroundColor: colors.surface3,
  },
  segmentDone: {
    backgroundColor: colors.amber,
  },
});
