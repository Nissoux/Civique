import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import * as authService from '../services/auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function RootLayoutNav() {
  const { isAuthenticated, isLoading, setUser, logout, setLoading } =
    useAuthStore();
  const { loadStoredLanguage } = useLanguageStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        await loadStoredLanguage();
        const { loadStoredTokens } = useAuthStore.getState();
        const { accessToken } = await loadStoredTokens();

        if (accessToken) {
          try {
            const user = await authService.getMe();
            setUser(user);
          } catch {
            await logout();
          }
        }
      } catch {
        // ignore bootstrap errors
      } finally {
        setLoading(false);
        setIsReady(true);
      }
    }
    bootstrap();
  }, []);

  useEffect(() => {
    if (!isReady || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isReady, isLoading]);

  if (!isReady || isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#002395" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="exam"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="train"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="fiches" options={{ headerShown: false }} />
      <Stack.Screen name="social" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <RootLayoutNav />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
