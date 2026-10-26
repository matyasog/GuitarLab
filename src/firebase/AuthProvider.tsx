import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { createContext, useEffect, useState, type ReactNode } from 'react';

import { auth } from './config';

export type AuthState = {
  // The signed-in Firebase user, or null when signed out.
  user: User | null;
  // True until Firebase has restored (or not) the saved sign-in at app start.
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

// Keeps the current user in React state, so every screen can read it with useAuth().
// Firebase tells us about every change (sign in, sign out, restored session) through
// onAuthStateChanged; the screens never track the user themselves.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Returns the unsubscribe function, which React calls on unmount.
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
  }, []);

  const value: AuthState = {
    user,
    isLoading,
    // No navigation here: when `user` changes, the route guards in src/app/_layout.tsx
    // show the right screens automatically.
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    },
    signOut: () => firebaseSignOut(auth),
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}
