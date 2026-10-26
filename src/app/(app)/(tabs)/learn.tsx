import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';

// Learn tab. Placeholder until step 3.4 builds the lesson list.
export default function Learn() {
  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScreenHeader title="Learn" />
      <AppText color="muted">Placeholder until step 3.4.</AppText>
    </Screen>
  );
}
