// Firebase ships separate builds for web and React Native. On the phone, Metro loads the
// React Native build, which has getReactNativePersistence(). TypeScript, however, reads the
// web type definitions, where the function is missing (a known Firebase typing issue).
// This adds the missing declaration, copied from Firebase's own React Native types
// (node_modules/@firebase/auth/dist/rn/src/platform_react_native/persistence/react_native.d.ts).
import type { Persistence, ReactNativeAsyncStorage } from '@firebase/auth';

declare module '@firebase/auth' {
  export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
