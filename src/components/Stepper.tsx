import { StyleSheet, View } from 'react-native';

import { space } from '@/theme';

import { AppText } from './AppText';
import { IconButton } from './IconButton';

type StepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  // How the value is shown, e.g. 440 → "440 Hz".
  format: (value: number) => string;
  // What is being changed, e.g. "Reference pitch", for the button labels.
  accessibilityLabel: string;
};

// − value + control, from "Stepper (430–450)" on the Settings design.
// The buttons dim at the ends of the range.
export function Stepper({ value, min, max, onChange, format, accessibilityLabel }: StepperProps) {
  return (
    <View style={styles.row}>
      <IconButton
        icon="minus"
        accessibilityLabel={`Lower ${accessibilityLabel.toLowerCase()}`}
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      />
      <View style={styles.value} accessible accessibilityLabel={`${accessibilityLabel}, ${format(value)}`}>
        <AppText variant="monoStrong16">{format(value)}</AppText>
      </View>
      <IconButton
        icon="plus"
        accessibilityLabel={`Raise ${accessibilityLabel.toLowerCase()}`}
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
  },
  value: {
    minWidth: 64,
    alignItems: 'center',
  },
});
