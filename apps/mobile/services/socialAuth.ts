import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import api from './api';
import type { AuthResponse } from './auth';

// ── Configuration ──
const GOOGLE_CLIENT_ID_IOS = '593427095159-lq6gta272m2fulbfporu887i60c0kd59.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = '593427095159-ccfousaqelr1rj1mk9ojhifbo87levud.apps.googleusercontent.com';
const GOOGLE_IOS_REVERSED = 'com.googleusercontent.apps.593427095159-lq6gta272m2fulbfporu887i60c0kd59';

function getGoogleRedirectUri(): string {
  // Expo auth proxy works in both dev and production
  return 'https://auth.expo.io/@nissouz/civique';
}

function getGoogleClientId(): string {
  if (Platform.OS === 'ios' && !__DEV__) return GOOGLE_CLIENT_ID_IOS;
  return GOOGLE_CLIENT_ID_WEB;
}

// ── Google Sign-In ──
export async function performGoogleSignIn(): Promise<AuthResponse | null> {
  try {
    WebBrowser.maybeCompleteAuthSession();

    const redirectUri = getGoogleRedirectUri();
    const clientId = getGoogleClientId();
    const nonce = Date.now().toString();

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=id_token` +
      `&scope=${encodeURIComponent('openid profile email')}` +
      `&nonce=${nonce}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === 'success' && result.url) {
      // Extract id_token from the URL fragment
      const url = result.url;
      const fragment = url.includes('#') ? url.split('#')[1] : '';
      const query = url.includes('?') ? url.split('?')[1]?.split('#')[0] : '';

      const params = new URLSearchParams(fragment || query);
      const idToken = params.get('id_token');

      if (!idToken) {
        console.error('Google Sign-In: no id_token in response', result.url);
        return null;
      }

      const { data } = await api.post<AuthResponse>('/auth/google', { idToken });
      return data;
    }
    return null;
  } catch (err) {
    console.error('Google Sign-In error:', err);
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
