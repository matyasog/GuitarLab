import { useRef, useState } from 'react';
import { StyleSheet, View, type TextInputInstance } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { LinkButton } from '@/components/LinkButton';
import { PasswordField } from '@/components/PasswordField';
import { Screen } from '@/components/Screen';
import { SignInHero } from '@/components/SignInHero';
import { TextField } from '@/components/TextField';
import { Toast } from '@/components/Toast';
import { getAuthErrorMessage, resetLinkSentMessage, resetNeedsEmailMessage } from '@/firebase/authErrors';
import { useAuth } from '@/hooks/useAuth';
import { space } from '@/theme';

type Errors = { email?: string; password?: string; form?: string };

// Sign in, from "Sign in / regular / default · forgot-password" in the design.
// The "Continue with Google" button is hidden until the Android dev build (decision D13);
// "New here? Create an account" is added with the Sign up screen in step 2.5.
export default function SignIn() {
  const { signIn, resetPassword } = useAuth();
  const passwordRef = useRef<TextInputInstance>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [resetSent, setResetSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const showError = (error: unknown) => {
    const { field, message } = getAuthErrorMessage(error);
    setErrors({ [field]: message });
  };

  const submit = async () => {
    setResetSent(false);
    if (!email.trim()) {
      return showError({ code: 'auth/missing-email' });
    }
    if (!password) {
      return showError({ code: 'auth/missing-password' });
    }
    setBusy(true);
    setErrors({});
    try {
      await signIn(email, password);
      // Nothing else to do: the route guard opens the app when the user changes.
    } catch (error) {
      showError(error);
      setBusy(false);
    }
  };

  const forgotPassword = async () => {
    setResetSent(false);
    if (!email.trim()) {
      return setErrors({ email: resetNeedsEmailMessage });
    }
    setErrors({});
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (error) {
      showError(error);
    }
  };

  return (
    // No top safe-area edge: the hero image runs behind the status bar, as in the design.
    <Screen edges={['left', 'right', 'bottom']} padded={false}>
      <View style={styles.page}>
        <SignInHero />

        <View style={styles.content}>
          <View style={styles.brand}>
            <AppText variant="title32" accessibilityRole="header">
              GuitarLab
            </AppText>
            <AppText color="muted">Plug in. Play. It listens and tells you what to fix.</AppText>
          </View>

          {/* Pushes the form to the bottom on tall screens; collapses on small ones. */}
          <View style={styles.flexibleSpace} />

          <View style={styles.form}>
            <TextField
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({});
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="username"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              submitBehavior="submit"
            />
            <PasswordField
              label="Password"
              placeholder="Your password"
              inputRef={passwordRef}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({});
              }}
              error={errors.password}
              helper={resetSent ? resetLinkSentMessage : undefined}
              helperTone="success"
              labelAccessory={
                <LinkButton
                  label="Forgot password?"
                  onPress={forgotPassword}
                  accessibilityHint="Sends a password reset link to the email above"
                  style={styles.forgotButton}
                />
              }
              returnKeyType="go"
              onSubmitEditing={submit}
            />
          </View>

          <View style={styles.actions}>
            {errors.form ? <Toast tone="error" message={errors.form} /> : null}
            <Button label="Sign in" onPress={submit} disabled={busy} fullWidth />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: space[16],
    paddingBottom: space[8],
  },
  brand: {
    gap: space[8],
  },
  flexibleSpace: {
    flex: 1,
    minHeight: space[24],
  },
  form: {
    gap: space[16],
  },
  forgotButton: {
    paddingLeft: space[12],
    paddingRight: 0,
  },
  actions: {
    gap: space[12],
    paddingTop: space[24],
  },
});
