import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase web-app config from .env (see .env.example). These values identify the project;
// they are not secrets. Security comes from Authentication and the Firestore rules.
// Each variable must be written out in full: Expo inlines EXPO_PUBLIC_* values at build time
// only for direct `process.env.NAME` accesses.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Fail early with a clear message instead of a confusing Firebase error later.
const missing = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);
if (missing.length > 0) {
  throw new Error(
    `Firebase config is missing: ${missing.join(', ')}. Copy .env.example to .env, fill it in and restart Expo.`,
  );
}

// On fast refresh this file runs again, but Firebase keeps its app in memory. Initialising a
// second time would throw, so the existing app and auth are reused.
const isFirstLoad = getApps().length === 0;

export const app = isFirstLoad ? initializeApp(firebaseConfig) : getApp();

// Auth keeps the signed-in user in AsyncStorage, so the user stays signed in after the app
// is closed and reopened.
export const auth: Auth = isFirstLoad
  ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
  : getAuth(app);

export const db = getFirestore(app);
