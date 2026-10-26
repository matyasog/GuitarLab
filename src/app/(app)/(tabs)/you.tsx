import { router } from 'expo-router';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/hooks/useAuth';

// You tab. Placeholder until step 3.7; the header (name + Settings button) is as in the design.
export default function You() {
  const { user } = useAuth();

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScreenHeader
        title={user?.displayName ?? 'You'}
        trailing={
          <IconButton icon="sliders-horizontal" accessibilityLabel="Settings" onPress={() => router.push('/settings')} />
        }
      />
      <AppText color="muted">Placeholder until step 3.7.</AppText>
    </Screen>
  );
}
