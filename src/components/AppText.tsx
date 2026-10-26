import { Text, type TextProps } from 'react-native';

import { colors, textStyles, type ColorName, type TextStyleName } from '@/theme';

export type AppTextProps = TextProps & {
  // A named text style from src/theme/typography.ts.
  variant?: TextStyleName;
  // A colour token from src/theme/colors.ts.
  color?: ColorName;
};

// The only Text the app uses, so every text gets a design font, size and colour.
// Text scales with the phone's text size setting; only labels inside instruments
// should pass `maxFontSizeMultiplier` to cap it.
export function AppText({ variant = 'body16', color = 'text', style, ...rest }: AppTextProps) {
  return <Text style={[textStyles[variant], { color: colors[color] }, style]} {...rest} />;
}
