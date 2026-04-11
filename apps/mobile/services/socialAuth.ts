import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import api from './api';
import type { AuthResponse } from './auth';

WebBrowser.maybeCompleteAuthSession();

// ── Google OAuth Configuration ──
// We use the iOS OAuth client on BOTH platforms for the browser-based flow.
//   - iOS clients accept the browser flow with a custom scheme redirect URI.
//   - Android clients are designed for the native Google Play Services SDK
//     and reject browser-based auth requests.
//   - The reversed scheme redirect URI is caught natively on both iOS and
//     Android thanks to the scheme declarations in app.json.
// This avoids the deprecated auth.expo.io proxy entirely.
//
// The Android OAuth client (with its SHA-1) remains configured for
// RevenueCat / Play Store billing; it is not used here for Sign-In.
const GOOGLE_CLIENT_ID = '593427095159-374od3aoal2tvm9lutvp383po7kaknrf.apps.googleusercontent.com';
const GOOGLE_REVERSED_SCHEME = 'com.googleusercontent.apps.593427095159-374od3aoal2tvm9lutvp383po7kaknrf';

// ── Google Sign-In ──
// Uses the OAuth 2.0 Authorization Code flow with PKCE — the only flow
// that Google accepts for native mobile apps (iOS/Android OAuth clients).
// The implicit id_token flow returns "unsupported_response_type" on these
// client types. We request an authorization code, then exchange it
// client-side for an id_token using PKCE (no client secret needed), and
// finally send the id_token to our backend for verification as before.
export async function performGoogleSignIn(): Promise<AuthResponse | null> {
  try {
    const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
    // Google's official iOS OAuth redirect URI format:
    //   com.googleusercontent.apps.{CLIENT_ID}:/oauth2redirect
    // (single colon single slash, path literal "oauth2redirect" with the "2")
    // Any other format triggers Google's "doesn't comply with OAuth 2.0 policy"
    // error on Android. The module-level WebBrowser.maybeCompleteAuthSession()
    // call in app/_layout.tsx now handles the single-slash redirect correctly
    // on cold-start wakeups, so we no longer need the double-slash workaround.
    const redirectUri = `${GOOGLE_REVERSED_SCHEME}:/oauth2redirect`;

    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
      usePKCE: true,
    });

    const result = await request.promptAsync(discovery);

    if (result.type !== 'success' || !result.params?.code) {
      if (result.type === 'error') {
        console.error('Google Sign-In auth error:', result.error, result.params);
      }
      return null;
    }

    // Exchange the authorization code for tokens (PKCE).
    const tokenResponse = await AuthSession.exchangeCodeAsync(
      {
        clientId: GOOGLE_CLIENT_ID,
        code: result.params.code,
        redirectUri,
        extraParams: {
          code_verifier: request.codeVerifier ?? '',
        },
      },
      discovery,
    );

    const idToken = tokenResponse.idToken;
    if (!idToken) {
      console.error('Google Sign-In: no id_token in token response');
      return null;
    }

    const { data } = await api.post<AuthResponse>('/auth/google', { idToken });
    return data;
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
