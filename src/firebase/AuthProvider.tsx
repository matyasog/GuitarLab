import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { createContext, useEffect, useState, type ReactNode } from 'react';

import { auth } from './config';
import { createUserProfile } from './users';

export type AuthState = {
  // The signed-in Firebase user, or null when signed out.
  user: User | null;
  // True until Firebase has restored (or not) the saved sign-in at app start.
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  // Creates the account and its profile document users/{uid}.
  signUp: (displayName: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Sends Firebase's password reset email. For privacy, Firebase reports success even when
  // no account uses that email, so the app can't be used to find out who has an account.
  resetPassword: (email: string) => Promise<void>;
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
    signUp: async (displayName, email, password) => {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // From here the user is signed in, so the route guard already switches to the app.
      // The name is also stored on the Firebase account (shown in the console's user list).
      await updateProfile(newUser, { displayName: displayName.trim() });
      await createUserProfile(newUser.uid, displayName);
    },
    signOut: () => firebaseSignOut(auth),
    resetPassword: (email) => sendPasswordResetEmail(auth, email.trim()),
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}
