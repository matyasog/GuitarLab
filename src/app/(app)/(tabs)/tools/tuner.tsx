import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { ToolHeader } from '@/components/ToolHeader';

// Tuner. Placeholder until step 7.2 (strobe tuner on mock audio).
export default function Tuner() {
  return (
    <Screen edges={['top', 'left', 'right']}>
      <ToolHeader tool="tuner" />
      <AppText color="muted">Placeholder until step 7.2.</AppText>
    </Screen>
  );
}
