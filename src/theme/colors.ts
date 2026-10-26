// Colour tokens, mirrored 1:1 from the `color.*` variables in design/guitarlab.pen.
// Names are camelCase versions of the .pen names (color.surface-2 → surface2).
// The design is dark-only for now; a light palette would be a second object of the same type.

export const darkColors = {
  // Surfaces
  bg: '#13110E',
  surface: '#1D1A16',
  surface2: '#26221D',
  surface3: '#302B25',
  sunken: '#0D0B09',
  display: '#0A0907',
  navBg: '#0E0C0A',
  scrim: '#13110EE6',
  shadow: '#00000055',

  // Lines
  line: '#3A342C',
  line2: '#4A4339',

  // Text
  text: '#F4EEE3',
  text2: '#DDD4C5',
  muted: '#B3A898',
  subtle: '#A39887',

  // Roles: amber = act / now, brass = achievement, green = correct, red = error
  amber: '#F5A524',
  amberInk: '#1C1206',
  amberSoft: '#3A2A10',
  amberWash: '#F5A52414',
  amberPressed: '#FFC35C',
  brass: '#E2C48A',
  brassSoft: '#3A3122',
  green: '#4CC97E',
  greenSoft: '#16301F',
  red: '#FF6A5C',
  redSoft: '#3A1B17',

  // Lesson categories
  catRhythm: '#F6A877',
  catRhythmBg: '#F08A4B2E',
  catScales: '#9FCDF7',
  catScalesBg: '#6FB3F22E',
  catMelody: '#F6AED3',
  catMelodyBg: '#F28DC02E',
  catArp: '#EFD58F',
  catArpBg: '#E9C46A2E',

  // Fretboard drawing
  fret: '#C9C2B4',
  nut: '#EFE6D2',
  inlay: '#E8DFCB',
  wound: '#C8A86B',
  plain: '#E2E2E2',

  // Instrument materials
  wood: '#4A2C1C',
  woodDark: '#2A170E',
  woodLight: '#6E4029',
  brassMetal: '#B8924A',
  brassMetalLight: '#E8CF94',
  brassMetalDark: '#6E5226',
  anodized: '#1F1D1B',
  anodizedLight: '#34312D',
  anodizedDark: '#131211',
  chrome: '#8E8C88',
  chromeLight: '#E6E4DF',
  chromeDark: '#45433F',
  enamelCream: '#EDE3CC',
  enamelInk: '#2B231B',
  enamelShade: '#D9CCAF',
  silkscreen: '#EFE6D2',
  specular: '#FFFFFF38',

  // Displays and lamps
  strobeBg: '#0E0A06',
  strobeGlow: '#FFB547',
  strobeDim: '#33220F',
  glass: '#FFFFFF14',
  glassClear: '#FFFFFF00',
  ledOff: '#2A2520',

  // Gradient stops and overlays
  bgClear: '#13110E00',
  shade: '#00000073',
  shadeClear: '#00000000',

  // Metronome edge flash
  flashAccent: '#F5A52455',
  flashBeat: '#EFE6D2AA',
} as const;

export type ColorName = keyof typeof darkColors;
export type ColorTokens = Record<ColorName, string>;

// The palette the app uses. A light theme would switch this object.
export const colors: ColorTokens = darkColors;
