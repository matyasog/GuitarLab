// Checks done on the phone before talking to Firebase, so the user gets instant feedback.

// Deliberately simple: something@something.something. Firebase does the real check.
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export type PasswordRule = { label: string; met: boolean };

// The live rules shown under the password on Sign up. The first two are from the design;
// the upper- and lowercase rules were added on 2026-10-26.
export function passwordRules(password: string): PasswordRule[] {
  return [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'A number', met: /\d/.test(password) },
    // A letter is uppercase if lowercasing changes it. Unlike [A-Z], this also counts
    // Czech letters such as Č or Ř.
    { label: 'An uppercase letter', met: password !== password.toLowerCase() },
    { label: 'A lowercase letter', met: password !== password.toUpperCase() },
  ];
}

export function isStrongEnough(password: string): boolean {
  return passwordRules(password).every((rule) => rule.met);
}

// Display name limits match the Firestore rules (1–40 characters).
export function isValidDisplayName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= 40;
}
