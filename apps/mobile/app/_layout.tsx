import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../stores/authStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useLanguageStore } from '../stores/languageStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useExamTypeStore } from '../stores/examTypeStore';
import { useThemeStore } from '../constants/theme';
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

    if (!isAuthenticated && !onboardingDone && segments[0] !== 'onboarding') {
      router.replace('/onboarding');
    } else if (!isAuthenticated && onboardingDone && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      if (!selectedExamType) {
        router.replace('/(tabs)/choose-exam');
      } else {
        router.replace('/(tabs)');
      }
    } else if (isAuthenticated && !selectedExamType && !onChooseExam) {
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
