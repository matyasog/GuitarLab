import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { ToolHeader } from '@/components/ToolHeader';

// Metronome. Placeholder until Phase 4.
export default function Metronome() {
  return (
    <Screen edges={['top', 'left', 'right']}>
      <ToolHeader tool="metronome" />
      <AppText color="muted">Placeholder until Phase 4.</AppText>
    </Screen>
  );
}
