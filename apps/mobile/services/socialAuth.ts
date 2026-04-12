import { Platform } from 'react-native';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import api from './api';
import type { AuthResponse } from './auth';

// ── Google OAuth Configuration ──
// Uses @react-native-google-signin/google-signin — the official native SDK
// recommended by both Expo and Google for production mobile apps.
//
// On Android: uses Google Play Services under the hood. The Android OAuth
// client (com.civique.app + SHA-1) is matched automatically by GMS.
//
// On iOS: uses the native Google Sign-In SDK. The iosUrlScheme is
// configured via the config plugin in app.json.
//
// webClientId is required to get an idToken that can be verified server-side.
//
// Docs:
//   https://docs.expo.dev/guides/google-authentication/
//   https://react-native-google-signin.github.io/docs/setting-up/expo

// Web client ID (required for backend idToken verification)
const GOOGLE_WEB_CLIENT_ID =
  '593427095159-ccfousaqelr1rj1mk9ojhifbo87levud.apps.googleusercontent.com';
// iOS client ID (for iOS native sign-in)
const GOOGLE_IOS_CLIENT_ID =
  '593427095159-374od3aoal2tvm9lutvp383po7kaknrf.apps.googleusercontent.com';

/**
 * Must be called once before any signIn call.
 * Typically from the root _layout.tsx at module level.
 */
export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    offlineAccess: false,
  });
}

// ── Google Sign-In ──
export async function performGoogleSignIn(): Promise<AuthResponse | null> {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();

    const idToken = response.data?.idToken;
    if (!idToken) {
      console.error('Google Sign-In: no idToken in response');
      return null;
    }

    // Send to our backend for verification and account creation/login
    const { data } = await api.post<AuthResponse>('/auth/google', { idToken });
    return data;
  } catch (error: any) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // User cancelled — not an error
          return null;
        case statusCodes.IN_PROGRESS:
          // Sign-in already in progress
          return null;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.error('Google Play Services not available');
          return null;
        default:
          console.error('Google Sign-In error code:', error.code, error.message);
          return null;
      }
    }
    console.error('Google Sign-In exception:', error);
    return null;
  }
}

// ── Apple Sign-In (lazy loaded, iOS only) ──
export async function performAppleSignIn(): Promise<AuthResponse | null> {
  if (Platform.OS !== 'ios') return null;

  try {
    const AppleAuth = await import('expo-apple-authentication');

    const credential = await AppleAuth.signInAsync({
      requestedScopes: [
        AppleAuth.AppleAuthenticationScope.FULL_NAME,
        AppleAuth.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error('No identity token');
    }

    const displayName = credential.fullName
      ? [credential.fullName.givenName, credential.fullName.familyName].filter(Boolean).join(' ')
      : undefined;

    const { data } = await api.post<AuthResponse>('/auth/apple', {
      identityToken: credential.identityToken,
      displayName: displayName || undefined,
    });
    return data;
  } catch (err: any) {
    if (err.code === 'ERR_CANCELED') return null;
    console.error('Apple Sign-In error:', err);
    return null;
  }
}

// ── Check Apple availability ──
export async function isAppleSignInAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;
  try {
    const AppleAuth = await import('expo-apple-authentication');
    return AppleAuth.isAvailableAsync();
  } catch {
    return false;
  }
}
