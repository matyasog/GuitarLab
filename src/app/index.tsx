import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radii, space, textStyles } from '@/theme';

// Temporary font check for step 1.1: shows each font and the main text styles.
// Replaced by the real Today screen in Phase 3.
export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[textStyles.title32, styles.text]}>GuitarLab</Text>
        <Text style={[textStyles.body16, styles.muted]}>
          Font check. Each block below should use a different typeface.
        </Text>

        <View style={styles.card}>
          <Text style={[textStyles.labelStrong12, styles.muted]}>Archivo (UI)</Text>
          <Text style={[textStyles.title24, styles.text]}>Where are you at?</Text>
          <Text style={[textStyles.label16, styles.text]}>Eighth notes, steady strumming</Text>
          <Text style={[textStyles.body14, styles.text2]}>
            Up the box and back down, one note per eighth-note click.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={[textStyles.labelStrong12, styles.muted]}>DM Mono (numbers)</Text>
          <Text style={[textStyles.readout64, styles.text]}>72</Text>
          <Text style={[textStyles.monoStrong14, styles.brass]}>1,240 / 1,600 XP</Text>
          <Text style={[textStyles.mono14, styles.text2]}>−12¢ · 109.2 Hz · avg +20 ms</Text>
        </View>

        <View style={[styles.card, styles.display]}>
          <Text style={[textStyles.labelStrong12, styles.muted]}>Barlow Semi Condensed (silkscreen)</Text>
          <Text style={[textStyles.silkscreen14, styles.strobe]}>IN TUNE · AUTO · FLAT</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: space[20],
    gap: space[16],
  },
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
  text: {
    color: colors.text,
  },
  text2: {
    color: colors.text2,
  },
  muted: {
    color: colors.muted,
  },
  brass: {
    color: colors.brass,
  },
  strobe: {
    color: colors.strobeGlow,
  },
});
