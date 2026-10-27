import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { colors, space } from '@/theme';

// Scale marks left and right of the slot (from the design's "Scale marks" path, 32 × 64).
const scaleMarks = 'M1 6l5 0m20 0l5 0m-30 13l5 0m20 0l5 0m-30 13l5 0m20 0l5 0m-30 13l5 0m20 0l5 0m-30 13l5 0m20 0l5 0';

// "Illustration / faders at zero" from the empty You design: three mixer faders pulled down,
// one per channel of "Your mix" (rhythm, clean tone, speed). Decorative only.
export function FadersAtZero() {
  return (
    <View style={styles.row} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {[0, 1, 2].map((index) => (
        <Svg key={index} width={32} height={64} viewBox="0 0 32 64">
          <Defs>
            <LinearGradient id={`fader-cap-${index}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.chromeLight} />
              <Stop offset="0.5" stopColor={colors.chrome} />
              <Stop offset="1" stopColor={colors.chromeDark} />
            </LinearGradient>
          </Defs>
          <Path d={scaleMarks} stroke={colors.line2} strokeWidth={1} />
          <Rect x={14} y={4} width={4} height={56} rx={2} fill={colors.sunken} stroke={colors.line} strokeWidth={1} />
          <Rect
            x={5}
            y={52}
            width={22}
            height={12}
            rx={3}
            fill={`url(#fader-cap-${index})`}
            stroke={colors.anodizedDark}
            strokeWidth={1}
          />
          <Rect x={8} y={57} width={16} height={2} fill={colors.enamelInk} />
        </Svg>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[16],
  },
});
