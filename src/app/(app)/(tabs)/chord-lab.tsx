import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';

// Chord Lab tab. Placeholder until Phase 5.
export default function ChordLab() {
  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScreenHeader title="Chord Lab" />
      <AppText color="muted">Placeholder until Phase 5.</AppText>
    </Screen>
  );
}
