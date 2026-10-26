import { getAuthErrorMessage } from '../authErrors';

// Firebase throws FirebaseError objects; only the `code` matters here.
function firebaseError(code: string) {
  return Object.assign(new Error(`Firebase: Error (${code}).`), { code });
}

test('a bad email address is shown under the email field, with the design copy', () => {
  expect(getAuthErrorMessage(firebaseError('auth/invalid-email'))).toEqual({
    field: 'email',
    message: "That doesn't look like an email. Try you@example.com",
  });
});

test('wrong password and unknown account give the same message', () => {
  const wrongPassword = getAuthErrorMessage(firebaseError('auth/wrong-password'));
  const unknownUser = getAuthErrorMessage(firebaseError('auth/user-not-found'));
  const invalidCredential = getAuthErrorMessage(firebaseError('auth/invalid-credential'));

  expect(wrongPassword).toEqual(invalidCredential);
  expect(unknownUser).toEqual(invalidCredential);
  expect(invalidCredential.field).toBe('password');
});

test('network and rate-limit errors are about the whole form', () => {
  expect(getAuthErrorMessage(firebaseError('auth/network-request-failed')).field).toBe('form');
  expect(getAuthErrorMessage(firebaseError('auth/too-many-requests')).field).toBe('form');
});

test('sign-up errors point at the field to fix', () => {
  expect(getAuthErrorMessage(firebaseError('auth/email-already-in-use')).field).toBe('email');
  expect(getAuthErrorMessage(firebaseError('auth/weak-password')).field).toBe('password');
  expect(getAuthErrorMessage({ code: 'app/missing-display-name' }).field).toBe('name');
});

test('unknown codes and non-Firebase errors fall back to a general message', () => {
  const fallback = { field: 'form', message: 'Something went wrong. Try again.' };
  expect(getAuthErrorMessage(firebaseError('auth/something-new'))).toEqual(fallback);
  expect(getAuthErrorMessage(new Error('boom'))).toEqual(fallback);
  expect(getAuthErrorMessage(undefined)).toEqual(fallback);
});
