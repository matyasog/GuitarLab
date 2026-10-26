import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';

import { mainTabs, TabBar } from '@/components/TabBar';
import { colors } from '@/theme';

// The five main tabs: Today, Learn, Tools (Tuner and Metronome), Chord Lab and You.
// Expo Router's Tabs handles the navigation; our TabBar component draws the bar.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
      tabBar={(props) => <RouterTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="tools" />
      <Tabs.Screen name="chord-lab" />
      <Tabs.Screen name="you" />
    </Tabs>
  );
}

// Connects the router's tab state to our TabBar. A press works like the default tab bar:
// it first announces "tabPress" (a screen could cancel it), then switches tabs.
function RouterTabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index];

  const onPress = (routeName: string) => {
    const route = state.routes.find((candidate) => candidate.name === routeName);
    if (!route) {
      return;
    }
    const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (route.key !== activeRoute.key && !event.defaultPrevented) {
      navigateToTab(route.key);
    }
  };

  return <TabBar tabs={mainTabs} activeKey={activeRoute.name} onPress={onPress} />;
}
