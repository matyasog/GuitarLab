import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, space } from '@/theme';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

export type TabItem = {
  key: string;
  label: string;
  icon: IconName;
};

// The five tabs from "Tab bar" in the design.
export const mainTabs: TabItem[] = [
  { key: 'today', label: 'Today', icon: 'guitar' },
  { key: 'learn', label: 'Learn', icon: 'book-open' },
  { key: 'tools', label: 'Tuner', icon: 'speaker' },
  { key: 'chord-lab', label: 'Chord Lab', icon: 'grid-3x3' },
  { key: 'you', label: 'You', icon: 'user' },
];

type TabBarProps = {
  tabs: TabItem[];
  activeKey: string;
  onPress: (key: string) => void;
};

// Bottom tab bar, from "Tab bar" + "Tab item" in the design: 50 pt of tabs plus the
// phone's bottom safe area (the design's 84 pt includes a 34 pt home indicator area).
// Step 3.1 connects it to Expo Router's Tabs as a custom tab bar.
export function TabBar({ tabs, activeKey, onPress }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]} accessibilityRole="tablist">
      <View style={styles.tabs}>
        {tabs.map((tab) => {
          const active = tab.key === activeKey;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onPress(tab.key)}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: active }}
              style={styles.tab}
            >
              {/* Small amber "LED" above the active tab. */}
              <View style={[styles.led, active && styles.ledOn]} />
              <Icon name={tab.icon} size={22} color={active ? 'text' : 'muted'} />
              <AppText
                variant={active ? 'labelStrong12' : 'label12'}
                color={active ? 'text' : 'muted'}
                numberOfLines={1}
              >
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.navBg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  tabs: {
    minHeight: 50,
    flexDirection: 'row',
    paddingHorizontal: space[8],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[4],
    paddingVertical: space[4],
  },
  led: {
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.glassClear,
  },
  ledOn: {
    backgroundColor: colors.amber,
  },
});
