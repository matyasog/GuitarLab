import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View, type TextInputInstance } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { PasswordField } from '@/components/PasswordField';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TextField } from '@/components/TextField';
import { Toast } from '@/components/Toast';
import { getAuthErrorMessage } from '@/firebase/authErrors';
import { isStrongEnough, isValidDisplayName, isValidEmail, passwordRules } from '@/firebase/authValidation';
import { useAuth } from '@/hooks/useAuth';
import { space } from '@/theme';

type Errors = { name?: string; email?: string; password?: string; form?: string };

// Sign up, from "Sign up / regular / empty · email-error" in the design.
// "Sign up with Google" and the "or with email" divider are hidden until the Android dev build (D13).
export default function SignUp() {
  const { signUp } = useAuth();
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const showError = (error: unknown) => {
    const { field, message } = getAuthErrorMessage(error);
    setErrors({ [field]: message });
  };

  // Typing in a field clears only that field's error (and a general one), so an email
  // error stays visible while the password is typed, as in the design.
  const clearError = (field: keyof Errors) => {
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  };

  // Email and password are checked when the field loses focus (not on every key), and only
  // once something was typed, so an untouched field never shows an error.
  const checkEmail = () => {
    if (email.trim() && !isValidEmail(email)) {
      const { message } = getAuthErrorMessage({ code: 'auth/invalid-email' });
      setErrors((current) => ({ ...current, email: message }));
    }
  };

  const checkPassword = () => {
    if (password && !isStrongEnough(password)) {
      const { message } = getAuthErrorMessage({ code: 'auth/weak-password' });
      setErrors((current) => ({ ...current, password: message }));
    }
  };

  const submit = async () => {
    if (!isValidDisplayName(name)) {
      return showError({ code: 'app/missing-display-name' });
    }
    if (!email.trim()) {
      return showError({ code: 'auth/missing-email' });
    }
    if (!isValidEmail(email)) {
      return showError({ code: 'auth/invalid-email' });
    }
    if (!isStrongEnough(password)) {
      return showError({ code: 'auth/weak-password' });
    }
    setBusy(true);
    setErrors({});
    try {
      await signUp(name, email, password);
      // The route guard opens the app as soon as the account exists.
    } catch (error) {
      showError(error);
      setBusy(false);
    }
  };

  return (
    <Screen gap={24}>
      <ScreenHeader onBack={() => router.back()} />

      <View style={styles.titleBlock}>
        <AppText variant="title32" accessibilityRole="header">
          Join the band
        </AppText>
        <AppText color="muted">We keep your streak, scores and progress safe across devices.</AppText>
      </View>

      <View style={styles.form}>
        <TextField
          label="What should we call you?"
          placeholder="First name or nickname"
          value={name}
          onChangeText={(text) => {
            setName(text);
            clearError('name');
          }}
          error={errors.name}
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          maxLength={40}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          submitBehavior="submit"
        />
        <TextField
          label="Email"
          placeholder="you@example.com"
          inputRef={emailRef}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            clearError('email');
          }}
          onBlur={checkEmail}
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
          placeholder="At least 8 characters"
          inputRef={passwordRef}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            clearError('password');
          }}
          onBlur={checkPassword}
          error={errors.password}
          // Lets iOS offer a strong password and save it to the keychain.
          textContentType="newPassword"
          autoComplete="new-password"
          footer={<PasswordRules password={password} />}
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </View>

      {/* Pushes the button to the bottom on tall screens. */}
      <View style={styles.flexibleSpace} />

      <View style={styles.actions}>
        {errors.form ? <Toast tone="error" message={errors.form} /> : null}
        <Button label="Create account" onPress={submit} disabled={busy} fullWidth />
      </View>
    </Screen>
  );
}

// "8+ characters" and "A number", turning green with a check as they are met.
function PasswordRules({ password }: { password: string }) {
  return (
    <View style={styles.rules}>
      {passwordRules(password).map((rule) => (
        <View
          key={rule.label}
          style={styles.rule}
          accessible
          accessibilityLabel={`${rule.label}, ${rule.met ? 'done' : 'not yet'}`}
        >
          <Icon name={rule.met ? 'circle-check' : 'circle'} size={16} color={rule.met ? 'green' : 'subtle'} />
          <AppText variant="helper14" color={rule.met ? 'green' : 'muted'}>
            {rule.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    gap: space[8],
  },
  form: {
    gap: space[16],
  },
  flexibleSpace: {
    flex: 1,
  },
  actions: {
    gap: space[12],
  },
  rules: {
    gap: space[8],
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
  },
});
