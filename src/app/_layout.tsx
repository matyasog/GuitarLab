import { Archivo_400Regular } from '@expo-google-fonts/archivo/400Regular';
import { Archivo_500Medium } from '@expo-google-fonts/archivo/500Medium';
import { Archivo_600SemiBold } from '@expo-google-fonts/archivo/600SemiBold';
import { BarlowSemiCondensed_600SemiBold } from '@expo-google-fonts/barlow-semi-condensed/600SemiBold';
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono/400Regular';
import { DMMono_500Medium } from '@expo-google-fonts/dm-mono/500Medium';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider } from '@/firebase/AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme';

// Keep the splash screen up until fonts and the saved sign-in are ready, so no text flashes
// in the system font and no wrong screen (sign-in vs. app) appears for a moment.
// Called at module scope because inside the component it could run after the splash is gone.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  // Keys are the font family names used in src/theme/typography.ts (fontFamilies).
  const [fontsLoaded, fontError] = useFonts({
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    DMMono_400Regular,
    DMMono_500Medium,
    BarlowSemiCondensed_600SemiBold,
  });
  const { user, isLoading } = useAuth();

  // If a font fails to load, continue with the system font rather than hang on the splash.
  const ready = (fontsLoaded || fontError !== null) && !isLoading;

  useEffect(() => {
    if (ready) {
      SplashScreen.hide();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  const signedIn = user !== null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        {/* Route guards: only one of the two groups exists at a time. When the user signs in
            or out, Expo Router removes the other group's screens and shows the right one.
            redirectTo says where a blocked user goes; without it the router falls back to the
            other group, which has no screen at "/", and shows "Unmatched Route". */}
        <Stack.Protected guard={signedIn} redirectTo="/sign-in">
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!signedIn} redirectTo="/">
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        {/* Developer gallery, reachable in development only (the screen checks __DEV__). */}
        <Stack.Screen name="dev/gallery" />
      </Stack>
    </>
  );
}
