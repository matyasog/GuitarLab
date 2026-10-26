import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, minTouchTarget, radii, space } from '@/theme';

import { AppText } from './AppText';
import { TextField, type TextFieldProps } from './TextField';

type PasswordFieldProps = Omit<TextFieldProps, 'trailing' | 'secureTextEntry'>;

// TextField with a "Show" / "Hide" button. The screens in the design use this text button
// (the kit's version shows an eye icon; the screens are the source of truth).
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      autoCapitalize="none"
      autoCorrect={false}
      textContentType="password"
      autoComplete="password"
      {...props}
      secureTextEntry={!visible}
      trailing={
        <Pressable
          onPress={() => setVisible((current) => !current)}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
        >
          <AppText variant="labelStrong14" color="text2">
            {visible ? 'Hide' : 'Show'}
          </AppText>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  toggle: {
    minHeight: minTouchTarget,
    minWidth: minTouchTarget,
    paddingHorizontal: space[12],
    borderRadius: radii.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  togglePressed: {
    backgroundColor: colors.surface2,
  },
});
