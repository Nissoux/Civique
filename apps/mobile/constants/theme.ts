import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Color Palette ───────────────────────────────────
export const colors = {
  light: {
    // Backgrounds — Claymorphism: soft lavender-white, never pure white
    background: '#F4F1FA',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',

    // Text
    textPrimary: '#1A1A2E',
    textSecondary: '#635F69',
    textTertiary: '#9994A1',
    textInverse: '#FFFFFF',

    // Brand — Quiz blue + French identity
    primary: '#2563EB',
    primaryLight: '#EFF6FF',
    secondary: '#ED2939',
    accent: '#F59E0B',
    accentBg: 'rgba(245, 158, 11, 0.15)',

    // Feedback — Claymorphism feedback colors
    success: '#16A34A',
    successBg: '#DCFCE7',
    error: '#DC2626',
    errorBg: '#FEE2E2',
    warning: '#F59E0B',
    warningBg: '#FEF3C7',

    // UI
    border: '#E4ECFC',
    divider: '#EDE9F5',
    inputBg: '#F8F6FC',
    tabBar: 'rgba(255, 255, 255, 0.85)',
    tabBarBorder: '#E4ECFC',
    progressBg: '#E4ECFC',
    skeleton: '#EDE9F5',

    // Premium
    premiumGradientStart: '#F59E0B',
    premiumGradientEnd: '#D97706',
    premiumBg: 'rgba(245, 158, 11, 0.1)',
    premiumText: '#92400E',

    // Glass & Gradients
    glassBackground: 'rgba(255, 255, 255, 0.55)',
    glassBorder: 'rgba(255, 255, 255, 0.30)',
    gradientPrimary: ['#2563EB', '#7C3AED'] as const,
    gradientHero: ['#0F172A', '#1E2B50', '#2563EB'] as const,
    gradientSuccess: ['#16A34A', '#4ADE80'] as const,

    // Confetti
    confettiColors: ['#2563EB', '#ED2939', '#F59E0B', '#7C3AED', '#FFFFFF'] as const,
  },
  dark: {
    // Backgrounds — Deep navy
    background: '#0A0E1A',
    surface: '#141829',
    surfaceElevated: '#1C2137',
    card: '#1C2137',

    // Text
    textPrimary: '#F0F0F5',
    textSecondary: '#A0A0B0',
    textTertiary: '#6B6B80',
    textInverse: '#0A0E1A',

    // Brand
    primary: '#60A5FA',
    primaryLight: '#1A2340',
    secondary: '#FF4D5A',
    accent: '#FBBF24',
    accentBg: 'rgba(251, 191, 36, 0.12)',

    // Feedback
    success: '#4ADE80',
    successBg: '#1B2E1C',
    error: '#F87171',
    errorBg: '#2E1B1B',
    warning: '#FBBF24',
    warningBg: '#2E2417',

    // UI
    border: '#2A2E42',
    divider: '#1E2235',
    inputBg: '#141829',
    tabBar: '#0F1320',
    tabBarBorder: '#1E2235',
    progressBg: '#2A2E42',
    skeleton: '#1C2137',

    // Premium
    premiumGradientStart: '#FBBF24',
    premiumGradientEnd: '#D97706',
    premiumBg: 'rgba(251, 191, 36, 0.12)',
    premiumText: '#FBBF24',

    // Glass & Gradients
    glassBackground: 'rgba(255, 255, 255, 0.06)',
    glassBorder: 'rgba(255, 255, 255, 0.10)',
    gradientPrimary: ['#0F172A', '#60A5FA'] as const,
    gradientHero: ['#0A0E1A', '#0F1B3D', '#1E2B50'] as const,
    gradientSuccess: ['#166534', '#4ADE80'] as const,

    // Confetti
    confettiColors: ['#60A5FA', '#FF4D5A', '#FBBF24', '#4ADE80', '#FFFFFF'] as const,
  },
};

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = keyof typeof colors;

// ── Theme Store ─────────────────────────────────────
const THEME_KEY = 'civique_theme';

interface ThemeState {
  mode: ThemeMode;
  scheme: ColorScheme;
  setMode: (mode: ThemeMode) => Promise<void>;
  loadStoredTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'dark' as ThemeMode,
  scheme: 'dark' as ColorScheme,

  setMode: async (mode: ThemeMode) => {
    await AsyncStorage.setItem(THEME_KEY, mode);
    const scheme: ColorScheme = mode === 'system' ? 'dark' : mode;
    set({ mode, scheme });
  },

  loadStoredTheme: async () => {
    const stored = await AsyncStorage.getItem(THEME_KEY);
    if (stored) {
      const mode = stored as ThemeMode;
      const scheme: ColorScheme = mode === 'system' ? 'dark' : mode;
      set({ mode, scheme });
    }
  },
}));

// ── Hook ────────────────────────────────────────────
export function useColors() {
  const { scheme } = useThemeStore();
  return colors[scheme];
}

// ── Spacing & Typography ────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  title: 28,
};

// Claymorphism: generous, bubbly radii
export const borderRadius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  round: 999,
};

// ── Animation Tokens ───────────────────────────────
export const animation = {
  springDefault: { damping: 15, stiffness: 150 },
  springBouncy: { damping: 8, stiffness: 200 },
  springGentle: { damping: 20, stiffness: 120 },
  durationFast: 200,
  durationNormal: 350,
  durationSlow: 500,
};

// ── C Motif Constants ──────────────────────────────
export const cMotif = {
  sizes: { sm: 24, md: 48, lg: 80, xl: 120 },
  opacity: { subtle: 0.04, light: 0.06, medium: 0.08 },
};
