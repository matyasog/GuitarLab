import { useId, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { colors } from '@/theme';

// Guitar-pick outline from the design ("Pick shape", viewBox 100 × 110).
const pickPath = 'M50 108c-12-12-46-48-48-74-2-22 20-32 48-32 28 0 50 10 48 32-2 26-36 62-48 74z';

type PickProps = {
  width: number;
  height: number;
  // metal: earned / current (brass gradient); next: brass outline; dim: not earned / future.
  look: 'metal' | 'next' | 'dim';
  // Glyph in the wide upper part of the pick.
  children?: ReactNode;
};

// A brass guitar pick, used for achievements and ranks on You (and the level badge there).
export function Pick({ width, height, look, children }: PickProps) {
  // Each pick needs its own gradient id; useId gives ":r1:"-style ids, so keep only letters/digits.
  const gradientId = `pick${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 100 110" preserveAspectRatio="none">
        {look === 'metal' ? (
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.brassMetalLight} />
              <Stop offset="0.55" stopColor={colors.brassMetal} />
              <Stop offset="1" stopColor={colors.brassMetalDark} />
            </LinearGradient>
          </Defs>
        ) : null}
        <Path
          d={pickPath}
          fill={look === 'metal' ? `url(#${gradientId})` : 'none'}
          stroke={look === 'metal' ? colors.brassMetalLight : look === 'next' ? colors.brass : colors.line2}
          // The path is scaled from 100 units to `width` points; this keeps the line 1–1.5 pt wide.
          strokeWidth={((look === 'metal' ? 1 : 1.5) * 100) / width}
        />
      </Svg>
      {/* The glyph sits in the top 82 % of the pick, where it is wide enough (51 of 62 in the design). */}
      <View style={[styles.glyph, { height: height * 0.82 }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  glyph: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
