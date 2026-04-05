import api from './api';
import type { User, Language } from '@civique/shared';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
  preferredLang?: Language;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  displayName?: string;
  avatarUrl?: string;
  preferredLang?: Language;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function refreshTokens(refreshToken: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<{ data: User }>('/auth/me');
  return data.data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await api.patch<{ data: User }>('/auth/me', payload);
  return data.data;
}

// ── Password Reset ─────────────────────────────

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email });
  return data;
}

export async function verifyResetCode(
  email: string,
  code: string,
): Promise<{ valid: boolean; resetToken: string }> {
  const { data } = await api.post<{ valid: boolean; resetToken: string }>(
    '/auth/verify-reset-code',
    { email, code },
  );
  return data;
}

// ── Social Login ──────────────────────────────

export interface SocialLoginPayload {
  provider: 'google' | 'apple';
  token: string;
  email?: string;
  displayName?: string;
}

export async function socialLogin(
  provider: 'google' | 'apple',
  token: string,
  email?: string,
  displayName?: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/social-login', {
    provider,
    token,
    email,
    displayName,
  });
  return data;
}

export async function resetPassword(
  email: string,
  resetToken: string,
  newPassword: string,
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/reset-password', {
    email,
    resetToken,
    newPassword,
  });
  return data;
}
