import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { ClickSound, Subdivision, TimeSignature } from '@/audio/metronome/MetronomeEngine';
import { maxBpm, minBpm } from '@/audio/metronome/MetronomeEngine';
import { tempoName } from '@/audio/metronome/tempoNames';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { StepButton } from '@/components/metronome/StepButton';
import { TapTempoSheet } from '@/components/metronome/TapTempoSheet';
import { Screen } from '@/components/Screen';
import { SegmentedControl, type SegmentOption } from '@/components/SegmentedControl';
import { Slider } from '@/components/Slider';
import { ToolHeader } from '@/components/ToolHeader';
import { ToolSwitch } from '@/components/ToolSwitch';
import { useLayoutClass } from '@/hooks/useLayoutClass';
import { useMetronome } from '@/hooks/useMetronome';
import { colors, radii, space } from '@/theme';

const mono = { normal: 'mono14', selected: 'monoStrong14' } as const;
const note = { normal: 'noteGlyph20', selected: 'noteGlyph20' } as const;

const timeSignatures: SegmentOption<TimeSignature>[] = [
  { value: '4/4', label: '4/4', accessibilityLabel: '4 4 time', labelVariant: mono },
  { value: '3/4', label: '3/4', accessibilityLabel: '3 4 time', labelVariant: mono },
  { value: '2/4', label: '2/4', accessibilityLabel: '2 4 time', labelVariant: mono },
  { value: '6/8', label: '6/8', accessibilityLabel: '6 8 time', labelVariant: mono },
];

// The names double as the line under "Subdivision" and as the spoken labels of the glyphs.
const subdivisionNames: Record<Subdivision, string> = {
  quarter: 'Quarter notes',
  eighth: 'Eighth notes',
  triplet: 'Triplets',
  sixteenth: 'Sixteenth notes',
};

const subdivisions: SegmentOption<Subdivision>[] = [
  { value: 'quarter', label: '♩', accessibilityLabel: subdivisionNames.quarter, labelVariant: note },
  { value: 'eighth', label: '♫', accessibilityLabel: subdivisionNames.eighth, labelVariant: note },
  { value: 'triplet', label: '♫', suffix: '3', accessibilityLabel: subdivisionNames.triplet, labelVariant: note },
  { value: 'sixteenth', label: '♬', accessibilityLabel: subdivisionNames.sixteenth, labelVariant: note },
];

const soundOptions: SegmentOption<ClickSound>[] = [
  { value: 'click', label: 'Click' },
  { value: 'woodblock', label: 'Woodblock' },
  { value: 'hihat', label: 'Hi-hat' },
];

// Metronome, from "Metronome / regular · compact / stopped" in the design. This step (4.2) has
// the tempo and rhythm controls; the pyramid instrument (4.3), beat lamps (4.4), speed trainer
// and histogram (4.5) are added in their own steps.
export default function Metronome() {
  const compact = useLayoutClass() === 'compact';
  const { config, playing, ready, change, start, stop } = useMetronome();
  const [tapOpen, setTapOpen] = useState(false);
  // While the slider is dragged the readout follows the finger; the tempo is set on release.
  const [dragBpm, setDragBpm] = useState<number | null>(null);
  const bpm = dragBpm ?? config.bpm;
  const step = (amount: number) => change({ bpm: config.bpm + amount });

  const slider = (
    <Slider
      accessibilityLabel="Tempo"
      thumb="knob"
      min={minBpm}
      max={maxBpm}
      step={1}
      value={bpm}
      valueText={(value) => `${value} BPM`}
      onChange={setDragBpm}
      onChangeEnd={(value) => {
        setDragBpm(null);
        change({ bpm: value });
      }}
    />
  );

  return (
    <Screen edges={['top', 'left', 'right']} gap={12}>
      {compact ? (
        // The compact design has no title, only the switch.
        <ToolSwitch
          value="metronome"
          onChange={(next) => {
            if (next === 'tuner') {
              router.replace('/tools/tuner');
            }
          }}
        />
      ) : (
        <ToolHeader tool="metronome" />
      )}

      <View style={styles.readout}>
        <AppText variant="label14" color="text2">
          {tempoName(bpm)}
        </AppText>
        <View style={styles.bpm} accessible accessibilityLabel={`${bpm} BPM`}>
          <AppText variant="readout64" maxFontSizeMultiplier={1.2}>
            {bpm}
          </AppText>
          <AppText variant="mono14" color="muted" style={styles.bpmUnit}>
            BPM
          </AppText>
        </View>
        <View style={styles.stepRow}>
          <StepButton step={-1} onPress={() => step(-1)} style={styles.grow} />
          <StepButton step={1} onPress={() => step(1)} style={styles.grow} />
        </View>
        {compact ? null : (
          <View style={styles.stepRow}>
            <StepButton step={-5} onPress={() => step(-5)} style={styles.grow} />
            <StepButton step={5} onPress={() => step(5)} style={styles.grow} />
          </View>
        )}
      </View>

      {compact ? (
        <View style={styles.tempoRow}>
          <StepButton step={-5} onPress={() => step(-5)} />
          <View style={styles.grow}>{slider}</View>
          <StepButton step={5} onPress={() => step(5)} />
        </View>
      ) : (
        <View>
          {slider}
          <View style={styles.range}>
            <AppText variant="mono12" color="subtle">
              {minBpm}
            </AppText>
            <AppText variant="mono12" color="subtle">
              {maxBpm}
            </AppText>
          </View>
        </View>
      )}

      <View style={styles.transport}>
        <Button
          label={playing ? 'Stop' : 'Start'}
          icon={playing ? 'square' : 'play'}
          disabled={!ready}
          onPress={playing ? stop : start}
          style={styles.start}
        />
        <Pressable
          // Tapping along to a click at another tempo is hard, so the sound stops first.
          onPress={() => {
            stop();
            setTapOpen(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Tap tempo"
          accessibilityHint="Opens a big pad to tap the tempo"
          style={({ pressed }) => [styles.tap, pressed && styles.tapPressed]}
        >
          <AppText variant="labelCaps14">TAP</AppText>
        </Pressable>
      </View>

      <View style={styles.settings}>
        <SettingRow title="Time signature" compact={compact}>
          <SegmentedControl
            accessibilityLabel="Time signature"
            options={timeSignatures}
            value={config.timeSignature}
            onChange={(timeSignature) => change({ timeSignature })}
          />
        </SettingRow>
        <SettingRow title="Subdivision" value={subdivisionNames[config.subdivision]} compact={compact}>
          <SegmentedControl
            accessibilityLabel="Subdivision"
            options={subdivisions}
            value={config.subdivision}
            onChange={(subdivision) => change({ subdivision })}
          />
        </SettingRow>
        <SettingRow title="Sound" compact={compact}>
          <SegmentedControl
            accessibilityLabel="Sound"
            options={soundOptions}
            value={config.sound}
            onChange={(sound) => change({ sound })}
          />
        </SettingRow>
      </View>

      <TapTempoSheet visible={tapOpen} onUse={(tapped) => change({ bpm: tapped })} onClose={() => setTapOpen(false)} />
    </Screen>
  );
}

type SettingRowProps = { title: string; value?: string; compact: boolean; children: ReactNode };

// "Row / Time signature" … in the design: a label column, then the segmented control.
function SettingRow({ title, value, compact, children }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingLabel, { width: compact ? 96 : 104 }]}>
        <AppText variant="label14" color="text2">
          {title}
        </AppText>
        {value ? (
          <AppText variant="caption12" color="muted">
            {value}
          </AppText>
        ) : null}
      </View>
      <View style={styles.grow}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  grow: {
    flex: 1,
  },
  readout: {
    gap: space[12],
  },
  bpm: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[8],
  },
  bpmUnit: {
    paddingBottom: space[8],
  },
  stepRow: {
    flexDirection: 'row',
    gap: space[8],
  },
  tempoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
  },
  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transport: {
    flexDirection: 'row',
    gap: space[12],
  },
  start: {
    flex: 1,
    minHeight: 56,
  },
  tap: {
    width: 112,
    height: 56,
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapPressed: {
    backgroundColor: colors.surface2,
  },
  settings: {
    gap: space[8],
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  settingLabel: {
    gap: 2,
  },
});
