import { create } from 'zustand';
import { tokenStorage } from '../services/api';
import type { User } from '@civique/shared';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  loadStoredTokens: () => Promise<{ accessToken: string | null; refreshToken: string | null }>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setTokens: async (accessToken: string, refreshToken: string) => {
    await tokenStorage.setToken('accessToken', accessToken);
    await tokenStorage.setToken('refreshToken', refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  setUser: (user: User) => {
    set({ user });
  },

  logout: async () => {
    await tokenStorage.removeToken('accessToken');
    await tokenStorage.removeToken('refreshToken');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  loadStoredTokens: async () => {
    const accessToken = await tokenStorage.getToken('accessToken');
    const refreshToken = await tokenStorage.getToken('refreshToken');

    if (accessToken && refreshToken) {
      set({
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    }

    return { accessToken, refreshToken };
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
