import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { Screen } from '@/components/Screen';
import { useProfile } from '@/hooks/useProfile';
import { colors, radii, space } from '@/theme';

const promises = [
  'Listens only while a tool or lesson is open.',
  'Sound is analysed on your phone. Only scores are saved.',
  "A green dot at the top shows whenever it's listening.",
];

// Onboarding step 3, from "Onboarding / regular / microphone" in the design.
// "Allow microphone" only moves on for now; the real permission request comes in step 7.3.
// "Not now" finishes onboarding without the microphone.
export default function OnboardingMicrophone() {
  const { completeOnboarding } = useProfile();

  return (
    <Screen gap={24}>
      <OnboardingHeader step={3} />

      <View style={styles.flexibleSpace} />

      <View style={styles.intro}>
        <View style={styles.iconCircle}>
          <Icon name="mic" size={40} color="amber" />
        </View>
        <AppText variant="title32" accessibilityRole="header" style={styles.centered}>
          Let us hear you
        </AppText>
        <AppText color="muted" style={styles.centered}>
          GuitarLab needs the microphone to hear your notes, timing and buzz.
        </AppText>
      </View>

      <View style={styles.promises}>
        {promises.map((promise) => (
          <View key={promise} style={styles.promise}>
            <Icon name="check" color="green" />
            <AppText color="text2" style={styles.promiseText}>
              {promise}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.flexibleSpace} />

      <View style={styles.actions}>
        <Button label="Allow microphone" onPress={() => router.push('/onboarding/low-e')} fullWidth />
        <Button
          label="Not now, I'll look around first"
          variant="ghost"
          onPress={() => completeOnboarding().catch(() => undefined)}
          fullWidth
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flexibleSpace: {
    flex: 1,
  },
  intro: {
    alignItems: 'center',
    gap: space[20],
    paddingHorizontal: space[8],
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: radii.pill,
    backgroundColor: colors.amberSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    textAlign: 'center',
  },
  promises: {
    gap: space[16],
    paddingHorizontal: space[8],
  },
  promise: {
    flexDirection: 'row',
    gap: space[12],
  },
  promiseText: {
    flex: 1,
  },
  actions: {
    gap: space[4],
  },
});
