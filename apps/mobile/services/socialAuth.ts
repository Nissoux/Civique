import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import api from './api';
import type { AuthResponse } from './auth';

WebBrowser.maybeCompleteAuthSession();

// ── Google OAuth Configuration ──
// Platform-specific OAuth client IDs from Google Cloud Console.
// Each platform has its own client type (iOS / Android) with its own
// reversed scheme used as the native redirect URI. This avoids the
// deprecated auth.expo.io proxy and works in production builds.
//
// The reversed schemes below MUST be declared in app.json under `scheme`.
const GOOGLE_CLIENT_ID_IOS = '593427095159-374od3aoal2tvm9lutvp383po7kaknrf.apps.googleusercontent.com';
const GOOGLE_IOS_REVERSED = 'com.googleusercontent.apps.593427095159-374od3aoal2tvm9lutvp383po7kaknrf';

const GOOGLE_CLIENT_ID_ANDROID = '593427095159-lq6gta272m2fulbfporu887i60c0kd59.apps.googleusercontent.com';
const GOOGLE_ANDROID_REVERSED = 'com.googleusercontent.apps.593427095159-lq6gta272m2fulbfporu887i60c0kd59';

function getGoogleConfig(): { clientId: string; redirectUri: string } {
  if (Platform.OS === 'ios') {
    return {
      clientId: GOOGLE_CLIENT_ID_IOS,
      redirectUri: `${GOOGLE_IOS_REVERSED}:/oauthredirect`,
    };
  }
  return {
    clientId: GOOGLE_CLIENT_ID_ANDROID,
    redirectUri: `${GOOGLE_ANDROID_REVERSED}:/oauthredirect`,
  };
}

// ── Google Sign-In ──
export async function performGoogleSignIn(): Promise<AuthResponse | null> {
  try {
    const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
    const { clientId, redirectUri } = getGoogleConfig();

    const request = new AuthSession.AuthRequest({
      clientId,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      redirectUri,
      extraParams: {
        nonce: Math.random().toString(36).substring(2, 15),
      },
    });

    const result = await request.promptAsync(discovery);

    if (result.type === 'success' && result.params?.id_token) {
      const { data } = await api.post<AuthResponse>('/auth/google', {
        idToken: result.params.id_token,
      });
      return data;
    }
    if (result.type === 'error') {
      console.error('Google Sign-In error:', result.error, result.params);
    }
    return null;
  } catch (err) {
    console.error('Google Sign-In exception:', err);
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
