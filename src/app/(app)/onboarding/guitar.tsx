import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChoiceCard } from '@/components/Choice';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { Screen } from '@/components/Screen';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useProfile } from '@/hooks/useProfile';
import { space } from '@/theme';
import type { UserSettings } from '@/types/user';

// Onboarding step 2, from "Onboarding / regular / guitar · guitar-empty" in the design.
// The guitar type must be picked; hand and pegs start at the most common choice.
export default function OnboardingGuitar() {
  const { updateSettings } = useProfile();
  const [guitar, setGuitar] = useState<UserSettings['guitar'] | null>(null);
  const [hand, setHand] = useState<UserSettings['hand']>('right');
  const [headstock, setHeadstock] = useState<UserSettings['headstock']>('3+3');

  const next = () => {
    if (!guitar) {
      return;
    }
    // Saved into the same settings the Settings screen edits.
    updateSettings({ guitar, hand, headstock }).catch(() => undefined);
    router.push('/onboarding/microphone');
  };

  return (
    <Screen gap={24}>
      <OnboardingHeader step={2} />

      <View style={styles.titleBlock}>
        <AppText variant="title32" accessibilityRole="header">
          Your guitar
        </AppText>
        <AppText color="muted">
          Acoustic and electric guitars sound very different to a microphone, so we tune the listening to yours.
        </AppText>
      </View>

      <View style={styles.cards} accessibilityRole="radiogroup">
        <ChoiceCard
          title="Acoustic"
          image={require('@/assets/images/guitar-acoustic.webp')}
          selected={guitar === 'acoustic'}
          onSelect={() => setGuitar('acoustic')}
        />
        <ChoiceCard
          title="Electric"
          image={require('@/assets/images/guitar-electric.webp')}
          selected={guitar === 'electric'}
          onSelect={() => setGuitar('electric')}
        />
      </View>

      <View style={styles.question}>
        <AppText variant="label14" color="text2">
          Which hand strums?
        </AppText>
        <SegmentedControl
          accessibilityLabel="Which hand strums?"
          value={hand}
          onChange={setHand}
          options={[
            { value: 'right', label: 'Right hand' },
            { value: 'left', label: 'Left hand' },
          ]}
        />
        <AppText variant="helper14" color="muted">
          Left-handed mirrors every fretboard and chord diagram in the app.
        </AppText>
      </View>

      <View style={styles.question}>
        <AppText variant="label14" color="text2">
          Where are the tuning pegs?
        </AppText>
        <SegmentedControl
          accessibilityLabel="Where are the tuning pegs?"
          value={headstock}
          onChange={setHeadstock}
          options={[
            { value: '3+3', label: '3 each side' },
            { value: '6-in-line', label: 'All 6 on one side' },
          ]}
        />
      </View>

      <View style={styles.flexibleSpace} />

      <Button label="Continue" onPress={next} disabled={guitar === null} fullWidth />
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    gap: space[8],
  },
  cards: {
    flexDirection: 'row',
    gap: space[12],
  },
  question: {
    gap: space[8],
  },
  flexibleSpace: {
    flex: 1,
  },
});
