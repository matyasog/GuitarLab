import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { addTap, tempoFromTaps } from '@/audio/metronome/tapTempo';
import { colors, radii, space } from '@/theme';

import { AppText } from '../AppText';
import { BottomSheet } from '../BottomSheet';

type TapTempoSheetProps = {
  visible: boolean;
  // Called with the tapped tempo when the user confirms it.
  onUse: (bpm: number) => void;
  onClose: () => void;
};

// Sheet with one big pad to tap a tempo, opened by the TAP button on the Metronome.
// Not in the design: the small TAP button alone was hard to hit in rhythm (added 2026-11-11).
export function TapTempoSheet({ visible, onUse, onClose }: TapTempoSheetProps) {
  const taps = useRef<number[]>([]);
  const [bpm, setBpm] = useState<number | null>(null);

  const reset = () => {
    taps.current = [];
    setBpm(null);
  };

  const tap = () => {
    taps.current = addTap(taps.current, performance.now());
    setBpm(tempoFromTaps(taps.current));
  };

  const close = () => {
    reset();
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      title="Tap tempo"
      actionLabel={bpm === null ? 'Cancel' : `Use ${bpm} BPM`}
      onAction={() => {
        if (bpm !== null) {
          onUse(bpm);
        }
        close();
      }}
      onClose={close}
    >
      <Pressable
        // onPressIn fires the moment the finger lands, so the timing is that of the tap itself.
        onPressIn={tap}
        accessibilityRole="button"
        accessibilityLabel="Tap pad"
        accessibilityHint="Tap in time to set the tempo"
        accessibilityValue={{ text: bpm === null ? 'no tempo yet' : `${bpm} BPM` }}
        style={({ pressed }) => [styles.pad, pressed && styles.padPressed]}
      >
        <View style={styles.bpm}>
          <AppText variant="readout64" color={bpm === null ? 'subtle' : 'text'} maxFontSizeMultiplier={1.2}>
            {bpm ?? '–'}
          </AppText>
          <AppText variant="mono14" color="muted" style={styles.unit}>
            BPM
          </AppText>
        </View>
        <AppText variant="labelCaps14" color="amber">
          TAP HERE
        </AppText>
      </Pressable>
      <AppText variant="helper14" color="muted" style={styles.hint}>
        Tap the pad in time with the beat. Two taps are enough; four are more exact.
      </AppText>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  pad: {
    height: 220,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line2,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[12],
  },
  padPressed: {
    borderColor: colors.amber,
    backgroundColor: colors.amberSoft,
  },
  bpm: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[8],
  },
  unit: {
    paddingBottom: space[8],
  },
  hint: {
    textAlign: 'center',
  },
});
