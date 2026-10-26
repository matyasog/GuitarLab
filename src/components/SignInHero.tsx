import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors, radii } from '@/theme';

// Top image of the Sign in screen, from "Hero" in the design (390 × 240): rosewood photo,
// a dark layer that calms the wood, frets and strings drawn on top, and a fade into the
// background at the bottom. Purely decorative, so screen readers skip it.

const heroHeight = 240;
// Positions from the design, in points from the top / left of the 390 × 240 frame.
const frets = [92, 300];
const strings = [
  { top: 60, thickness: 1.5, color: colors.plain }, // high e
  { top: 88, thickness: 1.5, color: colors.plain }, // B
  { top: 116, thickness: 2, color: colors.plain }, // G
  { top: 144, thickness: 2.5, color: colors.wound }, // D
  { top: 172, thickness: 3, color: colors.wound }, // A
  { top: 200, thickness: 3.5, color: colors.wound }, // low E
];

export function SignInHero() {
  return (
    <View style={styles.hero} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Image source={require('@/assets/images/sign-in-hero.webp')} contentFit="cover" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.dim]} />

      {/* Frets: a 3 pt fret with a 2 pt shadow on its right (light from the top left). */}
      {frets.map((left) => (
        <View key={left} style={[styles.fret, { left }]}>
          <View style={styles.fretShade} />
        </View>
      ))}
      <View style={styles.inlay} />

      {/* Strings: each with a 2 pt shadow just below it. */}
      {strings.map((string) => (
        <View key={string.top} style={[styles.string, { top: string.top }]}>
          <View style={{ height: string.thickness, backgroundColor: string.color }} />
          <View style={styles.stringShade} />
        </View>
      ))}

      {/* Fade into the screen background: clear until 35 % of the height, then bg. */}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0.35" stopColor={colors.bg} stopOpacity={0} />
            <Stop offset="1" stopColor={colors.bg} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#fade)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: heroHeight,
    overflow: 'hidden',
    backgroundColor: colors.woodDark,
  },
  dim: {
    backgroundColor: colors.shade,
  },
  fret: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.fret,
  },
  fretShade: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 3,
    width: 2,
    backgroundColor: colors.shade,
  },
  inlay: {
    position: 'absolute',
    left: 189,
    top: 123,
    width: 14,
    height: 14,
    borderRadius: radii.pill,
    opacity: 0.85,
    backgroundColor: colors.inlay,
  },
  string: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  stringShade: {
    height: 2,
    backgroundColor: colors.shade,
  },
});
