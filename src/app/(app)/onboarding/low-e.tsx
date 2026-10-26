import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { Screen } from '@/components/Screen';
import { useProfile } from '@/hooks/useProfile';
import { space } from '@/theme';

// Onboarding step 4, "Pluck your low E". It needs the microphone, so it is a placeholder
// until step 7.3 builds it on mock audio; "Let's play" finishes onboarding.
export default function OnboardingLowE() {
  const { completeOnboarding } = useProfile();

  return (
    <Screen gap={24}>
      <OnboardingHeader step={4} />

      <View style={styles.titleBlock}>
        <AppText variant="title32" accessibilityRole="header">
          Pluck your low E
        </AppText>
        <AppText color="muted">
          The thickest string, open. Let it ring. We&apos;ll set the input level from it.
        </AppText>
        <AppText variant="mono14" color="subtle">
          Placeholder: the listening part comes in step 7.3.
        </AppText>
      </View>

      <View style={styles.flexibleSpace} />

      <Button label="Let's play" onPress={() => completeOnboarding().catch(() => undefined)} fullWidth />
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    gap: space[8],
  },
  flexibleSpace: {
    flex: 1,
  },
});
