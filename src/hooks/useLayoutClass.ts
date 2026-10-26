import { useWindowDimensions } from 'react-native';

import { getLayoutClass, type LayoutClass } from '@/theme';

// The current size class. Re-renders when the window size changes (rotation, split screen).
export function useLayoutClass(): LayoutClass {
  const { width, height } = useWindowDimensions();
  return getLayoutClass(width, height);
}
