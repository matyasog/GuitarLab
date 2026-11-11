import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { ExpoAudioEngine } from '@/audio/metronome/ExpoAudioEngine';
import type { MetronomeConfig, MetronomeEngine } from '@/audio/metronome/MetronomeEngine';
import { clampBpm } from '@/audio/metronome/scheduler';

export const defaultMetronomeConfig: MetronomeConfig = {
  bpm: 72,
  timeSignature: '4/4',
  subdivision: 'quarter',
  sound: 'click',
};

// The settings survive leaving the screen (it is rebuilt when you come back), but not closing
// the app: they are not saved to the profile.
let lastConfig = defaultMetronomeConfig;

// State of the Metronome screen: the settings, whether it is playing, and the sound engine.
// The engine is created here and nowhere else, so swapping in the dev-build engine later is
// a one-line change.
export function useMetronome() {
  const [engine] = useState<MetronomeEngine>(() => new ExpoAudioEngine());
  const [config, setConfig] = useState(lastConfig);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  // Prepare the sounds once; free the player when the screen goes away.
  useEffect(() => {
    let mounted = true;
    engine
      .load()
      .then(() => mounted && setReady(true))
      .catch(() => undefined);
    return () => {
      mounted = false;
      engine.dispose();
    };
  }, [engine]);

  const stop = useCallback(() => {
    engine.stop();
    setPlaying(false);
  }, [engine]);

  // Stop when the user switches to another tab or tool …
  useFocusEffect(useCallback(() => stop, [stop]));

  // … and when the app goes to the background (the engine stops itself there too).
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        stop();
      }
    });
    return () => subscription.remove();
  }, [stop]);

  const change = (changes: Partial<MetronomeConfig>) => {
    const next = { ...config, ...changes };
    next.bpm = clampBpm(next.bpm);
    lastConfig = next;
    setConfig(next);
    if (playing) {
      engine.update(next);
    }
  };

  const start = () => {
    engine.start(config);
    setPlaying(true);
  };

  return { config, playing, ready, engine, change, start, stop };
}
