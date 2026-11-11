import { Redirect, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { ExpoAudioEngine } from '@/audio/metronome/ExpoAudioEngine';
import type { ClickSound } from '@/audio/metronome/MetronomeEngine';
import { timingStats, type TimingStats } from '@/audio/metronome/timingStats';
import { colors, radii, space } from '@/theme';

type Bpm = '60' | '120' | '200';

// Development screen for step 4.1: plays the metronome and shows whether its audio track keeps
// time with the phone's clock, and how quickly the app notices each click (that delay is what
// the pendulum and lamps will show). Used to check the Expo Go engine (decision D1, risk R3).
export default function MetronomeTiming() {
  const engineRef = useRef<ExpoAudioEngine | null>(null);
  const lateRef = useRef<number[]>([]);
  const startRef = useRef(0);
  const [state, setState] = useState<'loading' | 'ready' | 'playing' | 'error'>('loading');
  const [bpm, setBpm] = useState<Bpm>('120');
  const [sound, setSound] = useState<ClickSound>('click');
  const [stats, setStats] = useState<TimingStats>(timingStats([]));
  const [audio, setAudio] = useState({ driftMs: 0, loops: 0, trackMs: 0 });
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    const engine = new ExpoAudioEngine();
    engineRef.current = engine;
    const unsubscribe = engine.onTick((tick) => {
      lateRef.current.push(tick.time - tick.plannedTime);
    });
    engine
      .load()
      .then(() => setState('ready'))
      .catch(() => setState('error'));
    return () => {
      unsubscribe();
      engine.dispose();
    };
  }, []);

  // Refresh the numbers twice a second while playing (not on every click).
  useEffect(() => {
    if (state !== 'playing') {
      return;
    }
    const id = setInterval(() => {
      setStats(timingStats(lateRef.current));
      setAudio(engineRef.current?.getDebugInfo() ?? { driftMs: 0, loops: 0, trackMs: 0 });
      setElapsedSec(Math.floor((performance.now() - startRef.current) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, [state]);

  const start = () => {
    lateRef.current = [];
    startRef.current = performance.now();
    setStats(timingStats([]));
    setElapsedSec(0);
    engineRef.current?.start({ bpm: Number(bpm), timeSignature: '4/4', subdivision: 'quarter', sound });
    setState('playing');
  };

  const stop = () => {
    engineRef.current?.stop();
    setStats(timingStats(lateRef.current));
    setState('ready');
  };

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  const format = (ms: number) => `${ms.toFixed(1)} ms`;

  return (
    <Screen>
      <ScreenHeader title="Metronome timing" onBack={() => router.back()} />

      <SegmentedControl
        accessibilityLabel="Tempo"
        value={bpm}
        onChange={(value) => {
          setBpm(value);
          engineRef.current?.update({ bpm: Number(value) });
        }}
        options={[
          { value: '60', label: '60 BPM' },
          { value: '120', label: '120 BPM' },
          { value: '200', label: '200 BPM' },
        ]}
      />
      <SegmentedControl
        accessibilityLabel="Sound"
        value={sound}
        onChange={(value) => {
          setSound(value);
          engineRef.current?.update({ sound: value });
        }}
        options={[
          { value: 'click', label: 'Click' },
          { value: 'woodblock', label: 'Woodblock' },
          { value: 'hihat', label: 'Hi-hat' },
        ]}
      />

      {state === 'loading' ? <AppText color="muted">Preparing sounds…</AppText> : null}
      {state === 'error' ? <AppText color="red">{"Couldn't prepare the sounds."}</AppText> : null}

      <Button
        label={state === 'playing' ? 'Stop' : 'Start'}
        icon={state === 'playing' ? 'square' : 'play'}
        fullWidth
        disabled={state === 'loading' || state === 'error'}
        onPress={state === 'playing' ? stop : start}
      />

      <View style={styles.card}>
        <Row label="Running" value={`${Math.floor(elapsedSec / 60)}:${String(elapsedSec % 60).padStart(2, '0')}`} />
        <Row label="Clicks" value={String(stats.clicks)} />
        <Row label="Audio behind phone clock" value={format(audio.driftMs)} />
        <Row label="Track length / loops" value={`${(audio.trackMs / 1000).toFixed(1)} s / ${audio.loops}`} />
        <Row label="Click noticed after (average)" value={format(stats.meanLateMs)} />
        <Row label="Click noticed after (worst)" value={format(stats.maxLateMs)} />
      </View>

      <AppText variant="helper14" color="muted">
        {'The clicks are one audio track played in a loop, so their spacing is exact. "Audio behind phone clock" ' +
          'should stay within a few ms; watch it when "loops" goes up (about every 30 s). "Click noticed after" is ' +
          'how late the screen learns about a click. Changing tempo or sound restarts at beat 1.'}
      </AppText>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppText variant="body14" color="text2">
        {label}
      </AppText>
      <AppText variant="monoStrong14">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space[8],
    padding: space[16],
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
