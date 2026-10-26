import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useLayoutClass } from '@/hooks/useLayoutClass';
import { colors, space, wideContentMaxWidth } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  // Scrolls by default; instrument screens that must fit one view can turn it off.
  scroll?: boolean;
  // Safe-area edges to pad. Tab screens leave out 'bottom' because the tab bar covers it.
  edges?: Edge[];
  // Space between the direct children (the design uses 8, 16 or 24 per screen).
  gap?: keyof typeof space;
  // Standard screen margins from the design: 16 at the sides, 8 on top, 24 at the bottom.
  padded?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

const allEdges: Edge[] = ['top', 'right', 'bottom', 'left'];

// Wrapper for every screen: safe areas, background colour, margins, optional scrolling,
// and on wide screens (tablets) a centred column instead of stretched content.
export function Screen({
  children,
  scroll = true,
  edges = allEdges,
  gap = 16,
  padded = true,
  contentStyle,
}: ScreenProps) {
  const isWide = useLayoutClass() === 'wide';

  const content = [
    styles.content,
    { gap: space[gap] },
    padded && styles.padded,
    isWide && styles.wide,
    contentStyle,
  ];

  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      {scroll ? (
        // automaticallyAdjustKeyboardInsets (iOS): when the keyboard opens, the scroll area gets
        // room for it and the focused field scrolls into view, so it is never hidden.
        // keyboardShouldPersistTaps: a tap on a button works while the keyboard is open.
        <ScrollView
          contentContainerStyle={content}
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[content, styles.fill]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
  },
  fill: {
    flex: 1,
  },
  padded: {
    paddingTop: space[8],
    paddingHorizontal: space[16],
    paddingBottom: space[24],
  },
  wide: {
    width: '100%',
    maxWidth: wideContentMaxWidth,
    alignSelf: 'center',
  },
});
