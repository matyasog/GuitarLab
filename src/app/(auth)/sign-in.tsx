import { useState } from 'react';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PasswordField } from '@/components/PasswordField';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/hooks/useAuth';

// Temporary sign-in form for step 2.3 (checks the auth flow).
// The designed Sign in screen with friendly error messages replaces it in step 2.4.
export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const submit = async () => {
    setBusy(true);
    setError(undefined);
    try {
      await signIn(email, password);
      // Nothing else to do: the route guard switches to the app when the user changes.
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
      setBusy(false);
    }
  };

  return (
    <Screen>
      <AppText variant="title32" accessibilityRole="header">
        Sign in
      </AppText>
      <AppText variant="body14" color="muted">
        Temporary test form. Use the test user from the Firebase console.
      </AppText>
      <TextField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <PasswordField
        label="Password"
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        error={error}
        onSubmitEditing={submit}
      />
      <Button label={busy ? 'Signing in…' : 'Sign in'} onPress={submit} disabled={busy} fullWidth />
    </Screen>
  );
}
