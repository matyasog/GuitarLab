import { isStrongEnough, isValidDisplayName, isValidEmail, passwordRules } from '../authValidation';

test.each([
  ['you@example.com', true],
  ['  matyas@gmail.com ', true],
  ['matyas@gmail', false], // the design's error example
  ['abc', false],
  ['a b@c.d', false],
  ['', false],
])('isValidEmail(%j) is %s', (email, expected) => {
  expect(isValidEmail(email)).toBe(expected);
});

// Order: 8+ characters, a number, an uppercase letter, a lowercase letter.
test.each([
  ['', [false, false, false, false]],
  ['abc', [false, false, false, true]],
  ['abcdefgh', [true, false, false, true]],
  ['ABC1', [false, true, true, false]],
  ['strum4ever', [true, true, false, true]],
  ['Strum4ever', [true, true, true, true]],
  ['čtyři4Řady', [true, true, true, true]], // Czech letters count as upper- and lowercase
  ['12345678', [true, true, false, false]], // digits are neither upper- nor lowercase
] as const)('password rules for %j', (password, expected) => {
  expect(passwordRules(password).map((rule) => rule.met)).toEqual(expected);
});

test('a password is strong enough only when every rule is met', () => {
  expect(isStrongEnough('strum4ever')).toBe(false);
  expect(isStrongEnough('Strum4ever')).toBe(true);
});

test('display names must be 1–40 characters after trimming spaces', () => {
  expect(isValidDisplayName('Matyáš')).toBe(true);
  expect(isValidDisplayName('   ')).toBe(false);
  expect(isValidDisplayName('x'.repeat(40))).toBe(true);
  expect(isValidDisplayName('x'.repeat(41))).toBe(false);
});
