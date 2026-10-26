import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { useLayoutClass } from '@/hooks/useLayoutClass';
import { colors, radii, space } from '@/theme';

// Temporary check screen for Phase 1 (fonts, size class, text scaling).
// Replaced by the real Today screen in Phase 3.
export default function Index() {
  const layoutClass = useLayoutClass();
  const { width, height, fontScale } = useWindowDimensions();

  return (
    <Screen>
      <AppText variant="title32" accessibilityRole="header">
        GuitarLab
      </AppText>
      <AppText color="muted">Font check. Each block below should use a different typeface.</AppText>

      <View style={styles.card}>
        <AppText variant="labelStrong12" color="muted">
          Layout
        </AppText>
        <AppText variant="title20">Size class: {layoutClass}</AppText>
        <AppText variant="mono14" color="text2">
          {Math.round(width)} × {Math.round(height)} pt · text scale {fontScale.toFixed(2)}
        </AppText>
      </View>

      <View style={styles.card}>
        <AppText variant="labelStrong12" color="muted">
          Archivo (UI)
        </AppText>
        <AppText variant="title24">Where are you at?</AppText>
        <AppText variant="label16">Eighth notes, steady strumming</AppText>
        <AppText variant="body14" color="text2">
          Up the box and back down, one note per eighth-note click.
        </AppText>
      </View>

      <View style={styles.card}>
        <AppText variant="labelStrong12" color="muted">
          DM Mono (numbers)
        </AppText>
        <AppText variant="readout64">72</AppText>
        <AppText variant="monoStrong14" color="brass">
          1,240 / 1,600 XP
        </AppText>
        <AppText variant="mono14" color="text2">
          −12¢ · 109.2 Hz · avg +20 ms
        </AppText>
      </View>

      <View style={[styles.card, styles.display]}>
        <AppText variant="labelStrong12" color="muted">
          Barlow Semi Condensed (silkscreen)
        </AppText>
        <AppText variant="silkscreen14" color="strobeGlow" maxFontSizeMultiplier={1.2}>
          IN TUNE · AUTO · FLAT
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.card,
    padding: space[16],
    gap: space[8],
  },
  display: {
    backgroundColor: colors.strobeBg,
  },
});
