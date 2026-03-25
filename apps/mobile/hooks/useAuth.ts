import { useState, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import * as authService from '../services/auth';
import { useRouter } from 'expo-router';

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
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Identifiants invalides. Veuillez réessayer.';
        setError(message);
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
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Erreur lors de l'inscription. Veuillez réessayer.";
        setError(message);
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
