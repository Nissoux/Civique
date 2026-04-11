import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import api from './api';
import type { AuthResponse } from './auth';

WebBrowser.maybeCompleteAuthSession();

// ── Google OAuth Configuration ──
// We use the iOS OAuth client on BOTH platforms for the browser-based flow.
// Reasons:
//   - iOS clients support the `id_token` response type via browser flow.
//   - Android clients are designed for the native Google Play Services SDK
//     and reject browser-based id_token requests ("invalid request").
//   - The reversed scheme redirect URI is caught natively on both iOS and
//     Android thanks to the scheme declarations in app.json.
// This avoids the deprecated auth.expo.io proxy entirely.
//
// The Android OAuth client (with its SHA-1) is still needed for RevenueCat
// / Play Store billing, but is not used for Sign-In here.
const GOOGLE_CLIENT_ID = '593427095159-374od3aoal2tvm9lutvp383po7kaknrf.apps.googleusercontent.com';
const GOOGLE_REVERSED_SCHEME = 'com.googleusercontent.apps.593427095159-374od3aoal2tvm9lutvp383po7kaknrf';

// ── Google Sign-In ──
export async function performGoogleSignIn(): Promise<AuthResponse | null> {
  try {
    const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');

    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      redirectUri: `${GOOGLE_REVERSED_SCHEME}:/oauthredirect`,
      // PKCE is not compatible with the IdToken (implicit) response type.
      // Google returns "parameter not allowed for this message type:
      // code_challenge_method" when PKCE params are included.
      usePKCE: false,
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
