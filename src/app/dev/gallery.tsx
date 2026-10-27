import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Dialog } from '@/components/Dialog';
import { IconButton } from '@/components/IconButton';
import { ListeningIndicator } from '@/components/ListeningIndicator';
import { ListRow } from '@/components/ListRow';
import { PasswordField } from '@/components/PasswordField';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionHeader } from '@/components/SectionHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { SkeletonCard, SkeletonListRow } from '@/components/Skeleton';
import { EmptyState, ErrorState } from '@/components/StateMessage';
import { StatTile } from '@/components/StatTile';
import { StreakStrip } from '@/components/StreakStrip';
import { Switch } from '@/components/Switch';
import { mainTabs, TabBar } from '@/components/TabBar';
import { Tag } from '@/components/Tag';
import { TextField } from '@/components/TextField';
import { Toast } from '@/components/Toast';
import { ToolSwitch, type Tool } from '@/components/ToolSwitch';
import { useLayoutClass } from '@/hooks/useLayoutClass';
import { colors, radii, space } from '@/theme';

// Dev-only gallery of every base component, to compare with the design's component kit.
// Not reachable in release builds (redirects home).
export default function Gallery() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }
  return <GalleryContent />;
}

function GalleryContent() {
  const layoutClass = useLayoutClass();
  const { width, height, fontScale } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [presses, setPresses] = useState(0);
  const [tool, setTool] = useState<Tool>('tuner');
  const [sound, setSound] = useState('click');
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [speedTrainer, setSpeedTrainer] = useState(false);
  const [activeTab, setActiveTab] = useState('tools');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  const pressed = () => setPresses((count) => count + 1);
  const emailError =
    email.length > 0 && !email.includes('@') ? "That doesn't look like an email. Try you@example.com" : undefined;

  return (
    <Screen gap={24}>
      <View style={styles.section}>
        <ScreenHeader title="Component gallery" onBack={() => router.back()} />
        <AppText variant="mono14" color="muted">
          {layoutClass} · {Math.round(width)} × {Math.round(height)} pt · text {fontScale.toFixed(2)} · {presses}{' '}
          presses
        </AppText>
      </View>

      <View style={styles.card}>
        <AppText variant="title20" accessibilityRole="header">
          Buttons
        </AppText>
        <Button label="Continue" onPress={pressed} fullWidth />
        <Button label="Play" icon="play" onPress={pressed} fullWidth />
        <Button label="Continue" onPress={pressed} disabled fullWidth />
        <Button label="Not now" variant="secondary" onPress={pressed} fullWidth />
        <Button label="Not now" variant="secondary" onPress={pressed} disabled fullWidth />
        <Button label="Skip for now" variant="ghost" onPress={pressed} fullWidth />
        <Button label="Skip for now" variant="ghost" onPress={pressed} disabled fullWidth />
        <View style={styles.row}>
          <Button label="Hugs label" onPress={pressed} />
          <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={pressed} />
          <IconButton icon="sliders-horizontal" accessibilityLabel="Settings" onPress={pressed} />
          <IconButton icon="x" accessibilityLabel="Close" onPress={pressed} disabled />
        </View>
      </View>

      <View style={styles.card}>
        <AppText variant="title20" accessibilityRole="header">
          Fields
        </AppText>
        <TextField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          helper="Type something without @ to see the error."
          error={emailError}
        />
        <PasswordField
          label="Password"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          helper="Reset link sent. Check your inbox (and spam, just in case)."
          helperTone="success"
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Content" actionLabel="All lessons" onAction={pressed} />
        <StreakStrip
          days={12}
          label="day streak"
          week={[
            { label: 'T', state: 'met' },
            { label: 'W', state: 'met' },
            { label: 'T', state: 'met' },
            { label: 'F', state: 'missed' },
            { label: 'S', state: 'met' },
            { label: 'S', state: 'met' },
            { label: 'M', state: 'today' },
          ]}
          goal={{ minutes: 9, target: 15 }}
        />
        <StreakStrip
          days={0}
          label="day streak"
          week={['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, index) => ({
            label,
            state: index === 2 ? 'today' : 'missed',
          }))}
        />
        <Card eyebrow="Eyebrow" title="Card title">
          <AppText variant="body14" color="text2">
            Content slot. Radius 16, hairline border, no shadow.
          </AppText>
          <ProgressBar
            progress={1240 / 1600}
            title="Level 4 · Bedroom Player"
            valueText="1,240 / 1,600 XP"
            caption="360 XP to level 5 · Garage Band"
            accessibilityLabel="Level progress"
          />
        </Card>
        <View style={styles.tiles}>
          <StatTile value="12" label="day streak" valueColor="brass" style={styles.tile} />
          <StatTile value="7" unit="/12" label="lessons done" style={styles.tile} />
          <StatTile value="86" unit="%" label="Accuracy" style={styles.tile} />
        </View>
        <View style={styles.row}>
          <Tag category="rhythm" />
          <Tag category="scales" />
          <Tag category="melody" />
          <Tag category="arp" />
        </View>
        <View>
          <ListRow
            icon="hand"
            title="Eighth notes, steady strumming"
            subtitle="Rhythm · 80 BPM · best 71%"
            value="71%"
            onPress={pressed}
          />
          <ListRow icon="music" title="Riff in E, palm-muted" subtitle="Melody · 100 BPM · new" onPress={pressed} />
        </View>
        <SectionHeader title="Pick collection" detail="4 of 12" />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Controls" />
        <ToolSwitch value={tool} onChange={setTool} />
        <SegmentedControl
          accessibilityLabel="Sound"
          value={sound}
          onChange={setSound}
          options={[
            { value: 'click', label: 'Click' },
            { value: 'woodblock', label: 'Woodblock' },
            { value: 'hihat', label: 'Hi-hat' },
          ]}
        />
        <SegmentedControl
          accessibilityLabel="Time signature"
          value={timeSignature}
          onChange={setTimeSignature}
          options={['4/4', '3/4', '2/4', '6/8'].map((signature) => ({
            value: signature,
            label: signature,
            labelVariant: { normal: 'mono14', selected: 'monoStrong14' },
          }))}
        />
        <View style={styles.switchRow}>
          <AppText variant="label16" style={styles.switchLabel}>
            Speed trainer
          </AppText>
          <Switch value={speedTrainer} onValueChange={setSpeedTrainer} accessibilityLabel="Speed trainer" />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Navigation & overlays" />
        <ScreenHeader title="Tuner" trailing={<ListeningIndicator level={0.6} />} />
        <ScreenHeader
          title="Matyáš"
          trailing={<IconButton icon="sliders-horizontal" accessibilityLabel="Settings" onPress={pressed} />}
        />
        <ScreenHeader title="Screen title" onBack={pressed} />
        <View style={styles.tabBarFrame}>
          <TabBar tabs={mainTabs} activeKey={activeTab} onPress={setActiveTab} />
        </View>
        <Toast
          tone="info"
          message="You're offline."
          detail="Practice still works. Your scores and streak sync when you're back online."
        />
        <Toast tone="success" message="Session saved." />
        <Toast tone="error" message="Couldn't save this run." actionLabel="Retry" onAction={pressed} />
        <View style={styles.row}>
          <Button label="Open dialog" variant="secondary" onPress={() => setDialogVisible(true)} />
          <Button label="Open sheet" variant="secondary" onPress={() => setSheetVisible(true)} />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Screen state previews" />
        <View style={styles.row}>
          <Button
            label="Learn: loading"
            variant="secondary"
            onPress={() => router.push({ pathname: '/learn', params: { preview: 'loading' } })}
          />
          <Button
            label="Learn: error"
            variant="secondary"
            onPress={() => router.push({ pathname: '/learn', params: { preview: 'error' } })}
          />
        </View>
        <View style={styles.row}>
          <Button
            label="Today: first day"
            variant="secondary"
            onPress={() => router.push({ pathname: '/', params: { preview: 'first-day' } })}
          />
          <Button
            label="Today: offline"
            variant="secondary"
            onPress={() => router.push({ pathname: '/', params: { preview: 'offline' } })}
          />
          <Button
            label="Today: loading"
            variant="secondary"
            onPress={() => router.push({ pathname: '/', params: { preview: 'loading' } })}
          />
          <Button
            label="Today: error"
            variant="secondary"
            onPress={() => router.push({ pathname: '/', params: { preview: 'error' } })}
          />
        </View>
        <View style={styles.row}>
          <Button
            label="You: empty"
            variant="secondary"
            onPress={() => router.push({ pathname: '/you', params: { preview: 'empty' } })}
          />
          <Button
            label="You: loading"
            variant="secondary"
            onPress={() => router.push({ pathname: '/you', params: { preview: 'loading' } })}
          />
          <Button
            label="You: error"
            variant="secondary"
            onPress={() => router.push({ pathname: '/you', params: { preview: 'error' } })}
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="States" />
        <SkeletonCard />
        <SkeletonListRow />
        <SkeletonListRow />
        <EmptyState
          title="No sessions yet"
          body="Finish your first lesson and your progress shows up here."
          actionLabel="Start a lesson"
          onAction={pressed}
        />
        <ErrorState
          title="Couldn't load your progress"
          body="Lessons are on your phone, but your scores live online. Check your connection and try again."
          actionLabel="Try again"
          onAction={pressed}
        />
      </View>

      <Dialog
        visible={dialogVisible}
        title="Dialog title"
        body="One or two short sentences about what happens next."
        cancelLabel="Cancel"
        onCancel={() => setDialogVisible(false)}
        confirmLabel="Confirm"
        onConfirm={() => {
          pressed();
          setDialogVisible(false);
        }}
      />
      <BottomSheet
        visible={sheetVisible}
        title="Sheet title"
        onClose={() => setSheetVisible(false)}
        actionLabel="Done"
        onAction={() => setSheetVisible(false)}
      >
        <AppText variant="body14" color="text2">
          Content slot. Options, a list or a short explanation go here.
        </AppText>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space[8],
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.card,
    padding: space[16],
    gap: space[12],
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space[8],
  },
  tiles: {
    flexDirection: 'row',
    gap: space[8],
  },
  tile: {
    flex: 1,
  },
  switchRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  switchLabel: {
    flex: 1,
  },
  tabBarFrame: {
    marginHorizontal: -space[16],
  },
});
