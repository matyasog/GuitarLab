/// <reference types="node" />
// Node types only in tests: app code runs on the phone, where `fs` doesn't exist.
import { readFileSync } from 'fs';
import { join } from 'path';

// .env.example documents which keys the app needs. This test fails if the
// Firebase config starts reading a key that .env.example doesn't list (or vice versa).
const root = join(__dirname, '..');

function keysInEnvExample(): string[] {
  const text = readFileSync(join(root, '.env.example'), 'utf8');
  return text
    .split(/\r?\n/)
    .filter((line) => line.startsWith('EXPO_PUBLIC_'))
    .map((line) => line.split('=')[0])
    .sort();
}

function keysReadByFirebaseConfig(): string[] {
  const code = readFileSync(join(root, 'src/firebase/config.ts'), 'utf8');
  const matches = code.match(/process\.env\.(EXPO_PUBLIC_\w+)/g) ?? [];
  return matches.map((m) => m.replace('process.env.', '')).sort();
}

test('.env.example lists exactly the env keys the Firebase config reads', () => {
  expect(keysInEnvExample()).toEqual(keysReadByFirebaseConfig());
});
