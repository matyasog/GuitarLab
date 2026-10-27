import { useNetInfo } from '@react-native-community/netinfo';

// True when the phone has no network connection (e.g. airplane mode), for Today's offline banner.
// While NetInfo is still checking, isConnected is null and we treat the phone as online,
// so the banner never flashes on start.
export function useIsOffline(): boolean {
  const { isConnected } = useNetInfo();
  return isConnected === false;
}
