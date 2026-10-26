import type { TextStyle } from 'react-native';

// Font families and text styles from design/guitarlab.pen
// (`font.ui` = Archivo, `font.mono` = DM Mono, `font.silkscreen` = Barlow Semi Condensed).
//
// Each weight is loaded as its own font family (e.g. "Archivo_600SemiBold"), and styles pick
// the family instead of setting `fontWeight`. This renders the same on iOS and Android.
// The names must match the keys passed to useFonts() in src/app/_layout.tsx.
export const fontFamilies = {
  ui400: 'Archivo_400Regular',
  ui500: 'Archivo_500Medium',
  ui600: 'Archivo_600SemiBold',
  mono400: 'DMMono_400Regular',
  mono500: 'DMMono_500Medium',
  silkscreen600: 'BarlowSemiCondensed_600SemiBold',
} as const;

// Type scale (`type.*`). Nothing below 12.
export const typeSize = {
  12: 12,
  14: 14,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  44: 44,
  64: 64,
  96: 96,
} as const;

// The .pen file stores line height as a multiple of the font size; React Native wants points.
function lineHeight(size: number, multiple: number): number {
  return Math.round(size * multiple);
}

function style(fontFamily: string, fontSize: number, extra: TextStyle = {}): TextStyle {
  return { fontFamily, fontSize, ...extra };
}

const f = fontFamilies;
const t = typeSize;

// Named text styles: the combinations of font, size, line height and letter spacing
// that the screens in the design actually use. Screens use these, never raw values.
export const textStyles = {
  // Big readouts (note names, chord name)
  display96: style(f.ui600, t[96], { lineHeight: lineHeight(t[96], 1) }),
  display64: style(f.ui600, t[64], { lineHeight: lineHeight(t[64], 1) }),
  display44: style(f.ui600, t[44], { lineHeight: lineHeight(t[44], 1.1) }),

  // Titles (Archivo semibold, sentence case)
  title32: style(f.ui600, t[32]),
  title24: style(f.ui600, t[24]),
  title20: style(f.ui600, t[20]),
  heading16: style(f.ui600, t[16]),

  // Body text
  body16: style(f.ui400, t[16], { lineHeight: lineHeight(t[16], 1.45) }),
  body14: style(f.ui400, t[14], { lineHeight: lineHeight(t[14], 1.45) }),
  caption12: style(f.ui400, t[12], { lineHeight: lineHeight(t[12], 1.35) }),

  // Labels (row titles, control labels, tabs, tags)
  label16: style(f.ui500, t[16]),
  label14: style(f.ui500, t[14]),
  labelStrong14: style(f.ui600, t[14]),
  labelCaps14: style(f.ui600, t[14], { letterSpacing: 1.5 }),
  label12: style(f.ui500, t[12]),
  labelStrong12: style(f.ui600, t[12]),

  // Numbers: always DM Mono (BPM, cents, Hz, ms, XP)
  readout64: style(f.mono400, t[64], { lineHeight: lineHeight(t[64], 1) }),
  readoutStrong64: style(f.mono500, t[64], { lineHeight: lineHeight(t[64], 1) }),
  mono32: style(f.mono400, t[32], { lineHeight: lineHeight(t[32], 1) }),
  monoStrong20: style(f.mono500, t[20]),
  mono16: style(f.mono400, t[16]),
  monoStrong16: style(f.mono500, t[16]),
  mono14: style(f.mono400, t[14]),
  monoStrong14: style(f.mono500, t[14]),
  mono12: style(f.mono400, t[12]),
  monoStrong12: style(f.mono500, t[12]),

  // Silkscreen labels on instruments (FLAT, AUTO, IN TUNE, PERSONAL BEST)
  silkscreen12: style(f.silkscreen600, t[12], { letterSpacing: 1.5 }),
  silkscreen14: style(f.silkscreen600, t[14], { letterSpacing: 1.5 }),
} satisfies Record<string, TextStyle>;

export type TextStyleName = keyof typeof textStyles;
