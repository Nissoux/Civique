import type { User } from '@civique/shared';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  emailVerified?: boolean;
}

export interface FormState {
  error?: string;
  message?: string;
}
