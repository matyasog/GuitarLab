import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { SkeletonCard } from '@/components/Skeleton';
import { Slider } from '@/components/Slider';
import { ErrorState } from '@/components/StateMessage';
import { Stepper } from '@/components/Stepper';
import { SwitchRow } from '@/components/SwitchRow';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { colors, radii, space } from '@/theme';
import type { UserSettings } from '@/types/user';

// Settings, from "Settings / regular / default" in the design. Every change is saved to the
// profile document at once; the screen shows Firestore's local copy, so it updates instantly.
// "Run an input check" (Listening) is added with the Input check screen in step 7.3.
export default function Settings() {
  const { user, signOut } = useAuth();
  const { profile, status, updateSettings } = useProfile();
  // The slider shows its own value while dragging and saves once when released.
  const [sensitivityDraft, setSensitivityDraft] = useState<number | null>(null);

  const header = <ScreenHeader title="Settings" onBack={() => router.back()} />;

  if (status === 'error') {
    return (
      <Screen>
        {header}
        <ErrorState title="Couldn't load your settings" body="Check your connection and try again." />
      </Screen>
    );
  }

  if (!profile) {
    return (
      <Screen>
        {header}
        <SkeletonCard />
        <SkeletonCard />
      </Screen>
    );
  }

  const settings = profile.settings;
  const save = (changes: Partial<UserSettings>) => {
    // Errors are rare (the write is queued even offline); the listener shows the real state.
    updateSettings(changes).catch(() => undefined);
  };
  const monoSegment = { normal: 'mono14', selected: 'monoStrong14' } as const;
  const sensitivity = sensitivityDraft ?? settings.inputSensitivity;

  return (
    <Screen gap={8}>
      {header}

      <SectionTitle title="Playing" />
      <View style={styles.card}>
        <SettingBlock label="Strumming hand" helper="Left mirrors every fretboard, chord shape and the tuner headstock.">
          <SegmentedControl
            accessibilityLabel="Strumming hand"
            value={settings.hand}
            onChange={(hand) => save({ hand })}
            options={[
              { value: 'right', label: 'Right hand' },
              { value: 'left', label: 'Left hand' },
            ]}
          />
        </SettingBlock>
        <SettingBlock label="Guitar">
          <SegmentedControl
            accessibilityLabel="Guitar"
            value={settings.guitar}
            onChange={(guitar) => save({ guitar })}
            options={[
              { value: 'acoustic', label: 'Acoustic' },
              { value: 'electric', label: 'Electric' },
            ]}
          />
        </SettingBlock>
        <SettingBlock label="Headstock" helper="Sets which way the tuner tells you to turn each peg.">
          <SegmentedControl
            accessibilityLabel="Headstock"
            value={settings.headstock}
            onChange={(headstock) => save({ headstock })}
            options={[
              { value: '3+3', label: '3 + 3', accessibilityLabel: '3 pegs on each side' },
              { value: '6-in-line', label: '6 in line', accessibilityLabel: 'All 6 pegs on one side' },
            ]}
          />
        </SettingBlock>
        <SettingBlock label="Daily goal" helper="Hitting it each day keeps your streak going.">
          <SegmentedControl
            accessibilityLabel="Daily goal"
            value={String(settings.dailyGoalMin)}
            onChange={(minutes) => save({ dailyGoalMin: Number(minutes) as UserSettings['dailyGoalMin'] })}
            options={[
              { value: '5', label: '5 min', accessibilityLabel: '5 minutes', labelVariant: monoSegment },
              { value: '10', label: '10', accessibilityLabel: '10 minutes', labelVariant: monoSegment },
              { value: '15', label: '15', accessibilityLabel: '15 minutes', labelVariant: monoSegment },
              { value: '20', label: '20', accessibilityLabel: '20 minutes', labelVariant: monoSegment },
            ]}
          />
        </SettingBlock>
        <View style={[styles.block, styles.inline]}>
          <View style={styles.inlineText}>
            <AppText variant="label16">Reference pitch</AppText>
            <AppText variant="helper14" color="muted">
              Standard is A4 = 440 Hz
            </AppText>
          </View>
          <Stepper
            value={settings.a4Hz}
            min={430}
            max={450}
            onChange={(a4Hz) => save({ a4Hz })}
            format={(hz) => `${hz} Hz`}
            accessibilityLabel="Reference pitch"
          />
        </View>
      </View>

      <SectionTitle title="Listening" />
      <View style={styles.card}>
        <View style={[styles.block, styles.divider]}>
          <View style={styles.labelRow}>
            <AppText variant="label16">Input sensitivity</AppText>
            <AppText variant="monoStrong16" color="text2">
              {sensitivity}%
            </AppText>
          </View>
          <Slider
            value={sensitivity}
            onChange={setSensitivityDraft}
            onChangeEnd={(value) => {
              save({ inputSensitivity: value });
              setSensitivityDraft(null);
            }}
            accessibilityLabel="Input sensitivity"
          />
          <AppText variant="helper14" color="muted">
            Raise it for a quiet acoustic, lower it next to a loud amp.
          </AppText>
        </View>
        <SwitchRow
          title="Noise gate"
          subtitle="Ignore sounds quieter than your guitar"
          value={settings.noiseGate}
          onValueChange={(noiseGate) => save({ noiseGate })}
          last
        />
      </View>

      <SectionTitle title="Feedback" />
      <View style={styles.card}>
        <SwitchRow
          title="Feel the beat"
          subtitle="Phone taps on every metronome beat"
          value={settings.feelTheBeat}
          onValueChange={(feelTheBeat) => save({ feelTheBeat })}
        />
        <SwitchRow
          title="Visual pulse"
          subtitle="Screen edge flashes on the beat (up to 170 BPM)"
          value={settings.visualPulse}
          onValueChange={(visualPulse) => save({ visualPulse })}
        />
        <SwitchRow
          title="Count-in clicks"
          subtitle="Four clicks before each run"
          value={settings.countIn}
          onValueChange={(countIn) => save({ countIn })}
        />
        <SwitchRow
          title="Sound effects"
          subtitle="Hit sounds, streak and level-up"
          value={settings.soundEffects}
          onValueChange={(soundEffects) => save({ soundEffects })}
          last
        />
      </View>

      <SectionTitle title="Account" />
      <View style={styles.card}>
        <View style={[styles.accountRow, styles.divider]} accessible accessibilityLabel={`Email, ${user?.email ?? ''}`}>
          <AppText variant="label16" style={styles.inlineText}>
            Email
          </AppText>
          <AppText variant="helper14" color="muted" numberOfLines={1} style={styles.email}>
            {user?.email}
          </AppText>
        </View>
        <Pressable
          onPress={signOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          style={({ pressed }) => [styles.accountRow, pressed && styles.pressed]}
        >
          <AppText variant="label16" color="red" style={styles.inlineText}>
            Sign out
          </AppText>
          <Icon name="chevron-right" color="subtle" />
        </Pressable>
      </View>
    </Screen>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <AppText variant="labelStrong14" color="muted" accessibilityRole="header" style={styles.sectionTitle}>
      {title}
    </AppText>
  );
}

// One setting stacked vertically: label, control, optional helper line.
function SettingBlock({ label, helper, children }: { label: string; helper?: string; children: ReactNode }) {
  return (
    <View style={[styles.block, styles.divider]}>
      <AppText variant="label16">{label}</AppText>
      {children}
      {helper ? (
        <AppText variant="helper14" color="muted">
          {helper}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    paddingTop: space[16],
    paddingHorizontal: space[4],
    paddingBottom: space[4],
  },
  card: {
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  block: {
    gap: space[12],
    padding: space[16],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineText: {
    flex: 1,
    gap: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
  },
  email: {
    flexShrink: 1,
  },
  pressed: {
    backgroundColor: colors.surface2,
  },
});
