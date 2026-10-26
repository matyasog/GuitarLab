import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChoiceRow } from '@/components/Choice';
import type { IconName } from '@/components/Icon';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { Screen } from '@/components/Screen';
import { useProfile } from '@/hooks/useProfile';
import { space } from '@/theme';
import type { OnboardingLevel } from '@/types/user';

const levels: { value: OnboardingLevel; title: string; subtitle: string; icon: IconName }[] = [
  { value: 'brand-new', title: 'Brand new', subtitle: 'A few weeks in, or never held one', icon: 'signal-low' },
  { value: 'campfire', title: 'Campfire chords', subtitle: 'I know a handful of open chords', icon: 'signal-medium' },
  { value: 'songs', title: 'Playing songs', subtitle: 'I can get through whole songs', icon: 'signal-high' },
  { value: 'gigging', title: 'Gigging', subtitle: 'I play with other people or on stage', icon: 'signal' },
];

// Onboarding step 1, from "Onboarding / regular / level · level-empty" in the design.
export default function OnboardingLevelScreen() {
  const { profile, setOnboardingLevel } = useProfile();
  // Starts with the saved answer, so coming back to this screen shows the earlier choice.
  const [level, setLevel] = useState<OnboardingLevel | null>(profile?.onboarding.level ?? null);

  const next = (chosen: OnboardingLevel | null) => {
    // Saved in the background; the next screen doesn't wait for the network.
    setOnboardingLevel(chosen).catch(() => undefined);
    router.push('/onboarding/guitar');
  };

  return (
    <Screen gap={24}>
      <OnboardingHeader step={1} />

      <View style={styles.titleBlock}>
        <AppText variant="title32" accessibilityRole="header">
          Where are you at?
        </AppText>
        <AppText color="muted">
          We&apos;ll pick your first exercises and starting tempo. You can change this later.
        </AppText>
      </View>

      <View style={styles.options} accessibilityRole="radiogroup">
        {levels.map((option) => (
          <ChoiceRow
            key={option.value}
            title={option.title}
            subtitle={option.subtitle}
            icon={option.icon}
            selected={level === option.value}
            onSelect={() => setLevel(option.value)}
          />
        ))}
      </View>

      <View style={styles.flexibleSpace} />

      <View style={styles.actions}>
        <Button label="Continue" onPress={() => next(level)} disabled={level === null} fullWidth />
        <Button label="Skip, I'll pick later" variant="ghost" onPress={() => next(null)} fullWidth />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    gap: space[8],
  },
  options: {
    gap: space[12],
  },
  flexibleSpace: {
    flex: 1,
  },
  actions: {
    gap: space[4],
  },
});
