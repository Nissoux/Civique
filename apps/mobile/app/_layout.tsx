import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { useAuthStore } from '../stores/authStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useLanguageStore } from '../stores/languageStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useExamTypeStore } from '../stores/examTypeStore';
import { useThemeStore } from '../constants/theme';
import * as authService from '../services/auth';
import { initRevenueCat, identifyUser } from '../services/revenuecat';

Sentry.init({
  dsn: 'https://9a327ca9daf3af53d2ea26b014979b3d@o4511176778186752.ingest.de.sentry.io/4511176784937040',
  tracesSampleRate: 0.2,
  enabled: !__DEV__,
});

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
  const { fetchSubscription } = useSubscriptionStore();
  const { selectedExamType, loadStoredExamType } = useExamTypeStore();
  const { loadStoredTheme } = useThemeStore();
  const { done: onboardingDone, setDone: setOnboardingDone } = useOnboardingStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        // Initialize RevenueCat
        await initRevenueCat();

        await loadStoredLanguage();
        await loadStoredExamType();
        await loadStoredTheme();

        const onboardingFlag = await AsyncStorage.getItem('onboarding_done');
        setOnboardingDone(onboardingFlag === 'true' ? true : false);

        const { loadStoredTokens } = useAuthStore.getState();
        const { accessToken } = await loadStoredTokens();

        if (accessToken) {
          try {
            const user = await authService.getMe();
            setUser(user);
            await identifyUser(user.id);
            fetchSubscription();
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
    const onChooseExam = segments[1] === 'choose-exam';

    const onVerifyEmail = segments[1] === 'verify-email';

    if (!isAuthenticated && !onboardingDone && segments[0] !== 'onboarding') {
      router.replace('/onboarding');
    } else if (!isAuthenticated && onboardingDone && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup && !onVerifyEmail) {
      if (!selectedExamType) {
        router.replace('/(tabs)/choose-exam');
      } else {
        router.replace('/(tabs)');
      }
    } else if (isAuthenticated && !selectedExamType && !onChooseExam && !onVerifyEmail) {
      router.replace('/(tabs)/choose-exam');
    }
  }, [isAuthenticated, selectedExamType, segments, isReady, isLoading, onboardingDone]);

  if (!isReady || isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#002395" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
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
      <Stack.Screen name="glossaire" options={{ headerShown: false }} />
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
    backgroundColor: '#0A0E1A',
  },
});
