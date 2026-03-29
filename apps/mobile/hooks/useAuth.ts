import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import * as authService from '../services/auth';
import { useRouter } from 'expo-router';

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const msg = err.response?.data?.message || err.response?.data?.error;
    return typeof msg === 'string' ? msg : fallback;
  }
  return fallback;
}

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    setTokens,
    setUser,
    logout: storeLogout,
    setLoading,
  } = useAuthStore();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setIsSubmitting(true);
      try {
        const response = await authService.login({ email, password });
        await setTokens(response.accessToken, response.refreshToken);
        setUser(response.user);
        router.replace('/(tabs)');
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Identifiants invalides. Veuillez r\u00e9essayer.'));
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [setTokens, setUser, router],
  );

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      setError(null);
      setIsSubmitting(true);
      try {
        const response = await authService.register({
          email,
          password,
          displayName,
        });
        await setTokens(response.accessToken, response.refreshToken);
        setUser(response.user);
        router.replace('/(tabs)');
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Erreur lors de l'inscription. Veuillez r\u00e9essayer."));
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [setTokens, setUser, router],
  );

  const logout = useCallback(async () => {
    await storeLogout();
    router.replace('/(auth)/login');
  }, [storeLogout, router]);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const me = await authService.getMe();
      setUser(me);
    } catch {
      await storeLogout();
    } finally {
      setLoading(false);
    }
  }, [setUser, storeLogout, setLoading]);

  const clearError = useCallback(() => setError(null), []);

  return {
    user,
    isAuthenticated,
    isLoading,
    isSubmitting,
    error,
    login,
    register,
    logout,
    loadUser,
    clearError,
  };
}
