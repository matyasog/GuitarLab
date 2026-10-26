// Turns Firebase Auth error codes into friendly, actionable messages and says which field
// they belong under. Copy marked "design" comes from design/guitarlab.pen; the rest was
// drafted in the design's tone (short, says what to do next) and approved on 2026-10-26.

export type AuthErrorField = 'name' | 'email' | 'password' | 'form';

export type AuthErrorMessage = {
  field: AuthErrorField;
  message: string;
};

const messages: Record<string, AuthErrorMessage> = {
  // design (Sign up / email-error)
  'auth/invalid-email': { field: 'email', message: "That doesn't look like an email. Try you@example.com" },
  'auth/missing-email': { field: 'email', message: 'Enter your email.' },
  'auth/missing-password': { field: 'password', message: 'Enter your password.' },
  // Firebase answers "wrong password" and "no such account" with the same code on purpose,
  // so nobody can find out which emails have an account.
  'auth/invalid-credential': {
    field: 'password',
    message: "That email and password don't match. Check them, or reset your password.",
  },
  'auth/wrong-password': {
    field: 'password',
    message: "That email and password don't match. Check them, or reset your password.",
  },
  'auth/user-not-found': {
    field: 'password',
    message: "That email and password don't match. Check them, or reset your password.",
  },
  'auth/too-many-requests': {
    field: 'form',
    message: 'Too many tries. Wait a few minutes, or reset your password.',
  },
  'auth/network-request-failed': {
    field: 'form',
    message: "You're offline. Connect to the internet and try again.",
  },
  'auth/user-disabled': {
    field: 'form',
    message: "This account can't sign in right now.",
  },
  // Sign up
  'auth/email-already-in-use': {
    field: 'email',
    message: 'That email already has an account. Sign in instead, or reset your password.',
  },
  // The rules themselves are listed under the field (Sign up), so the message points to them.
  'auth/weak-password': {
    field: 'password',
    message: 'Your password needs to meet all the rules below.',
  },
  // Not a Firebase code: our own check before creating the account.
  'app/missing-display-name': {
    field: 'name',
    message: 'Enter a first name or nickname.',
  },
};

const fallback: AuthErrorMessage = { field: 'form', message: 'Something went wrong. Try again.' };

// Accepts anything a Firebase call can throw (FirebaseError has a `code` like "auth/…").
export function getAuthErrorMessage(error: unknown): AuthErrorMessage {
  const code =
    typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: unknown }).code) : '';
  return messages[code] ?? fallback;
}

// Shown after a password reset email was requested (design: Sign in / forgot-password).
export const resetLinkSentMessage = 'Reset link sent. Check your inbox (and spam, just in case).';

// Shown when "Forgot password?" is tapped with an empty email field.
export const resetNeedsEmailMessage = 'Type your email above, then tap Forgot password? again.';
