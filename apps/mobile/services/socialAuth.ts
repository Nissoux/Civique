import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import api from './api';
import type { AuthResponse } from './auth';

WebBrowser.maybeCompleteAuthSession();

// ── Configuration ──
const GOOGLE_CLIENT_ID_IOS = '593427095159-lq6gta272m2fulbfporu887i60c0kd59.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = '593427095159-ccfousaqelr1rj1mk9ojhifbo87levud.apps.googleusercontent.com';

// ── Google Sign-In ──
export async function performGoogleSignIn(): Promise<AuthResponse | null> {
  try {
    const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');

    const clientId = Platform.OS === 'ios' ? GOOGLE_CLIENT_ID_IOS : GOOGLE_CLIENT_ID_WEB;

    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'civique',
    });

    const request = new AuthSession.AuthRequest({
      clientId,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      redirectUri,
    });

    const result = await request.promptAsync(discovery);

    if (result.type === 'success' && result.params?.id_token) {
      const { data } = await api.post<AuthResponse>('/auth/google', {
        idToken: result.params.id_token,
      });
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
