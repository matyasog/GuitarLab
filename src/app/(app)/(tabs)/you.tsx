import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/hooks/useAuth';

// You tab. Placeholder until step 3.7; the header shows the user's name as in the design.
export default function You() {
  const { user } = useAuth();

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScreenHeader title={user?.displayName ?? 'You'} />
      <AppText color="muted">Placeholder until step 3.7.</AppText>
    </Screen>
  );
}
