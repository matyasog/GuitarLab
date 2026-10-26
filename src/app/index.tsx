import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { PasswordField } from '@/components/PasswordField';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useLayoutClass } from '@/hooks/useLayoutClass';
import { colors, radii, space } from '@/theme';

// Temporary check screen for Phase 1 (fonts, size class, base components).
// Becomes the dev component gallery in step 1.5; the real Today screen comes in Phase 3.
export default function Index() {
  const layoutClass = useLayoutClass();
  const { width, height, fontScale } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [presses, setPresses] = useState(0);

  const pressed = () => setPresses((count) => count + 1);
  const emailError =
    email.length > 0 && !email.includes('@') ? "That doesn't look like an email. Try you@example.com" : undefined;

  return (
    <Screen gap={24}>
      <View style={styles.section}>
        <AppText variant="title32" accessibilityRole="header">
          GuitarLab
        </AppText>
        <AppText variant="mono14" color="muted">
          {layoutClass} · {Math.round(width)} × {Math.round(height)} pt · text {fontScale.toFixed(2)} · {presses}{' '}
          presses
        </AppText>
      </View>

      <View style={styles.card}>
        <AppText variant="title20" accessibilityRole="header">
          Buttons
        </AppText>
        <Button label="Continue" onPress={pressed} fullWidth />
        <Button label="Play" icon="play" onPress={pressed} fullWidth />
        <Button label="Continue" onPress={pressed} disabled fullWidth />
        <Button label="Not now" variant="secondary" onPress={pressed} fullWidth />
        <Button label="Not now" variant="secondary" onPress={pressed} disabled fullWidth />
        <Button label="Skip for now" variant="ghost" onPress={pressed} fullWidth />
        <Button label="Skip for now" variant="ghost" onPress={pressed} disabled fullWidth />
        <View style={styles.row}>
          <Button label="Hugs label" onPress={pressed} />
          <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={pressed} />
          <IconButton icon="sliders-horizontal" accessibilityLabel="Settings" onPress={pressed} />
          <IconButton icon="x" accessibilityLabel="Close" onPress={pressed} disabled />
        </View>
      </View>

      <View style={styles.card}>
        <AppText variant="title20" accessibilityRole="header">
          Fields
        </AppText>
        <TextField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          helper="Type something without @ to see the error."
          error={emailError}
        />
        <PasswordField
          label="Password"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          helper="Reset link sent. Check your inbox (and spam, just in case)."
          helperTone="success"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space[8],
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.card,
    padding: space[16],
    gap: space[12],
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space[8],
  },
});
