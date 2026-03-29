import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Color Palette ───────────────────────────────────
export const colors = {
  light: {
    // Backgrounds
    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',

    // Text
    textPrimary: '#1A1A2E',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textInverse: '#FFFFFF',

    // Brand
    primary: '#002395',
    primaryLight: '#EEF1F9',
    secondary: '#ED2939',
    accent: '#FFD700',
    accentBg: 'rgba(255, 215, 0, 0.15)',

    // Feedback
    success: '#2E7D32',
    successBg: '#E8F5E9',
    error: '#C62828',
    errorBg: '#FFEBEE',
    warning: '#E65100',
    warningBg: '#FFF3E0',

    // UI
    border: '#E8E8E8',
    divider: '#F0F0F0',
    inputBg: '#F9F9F9',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E0E0E0',
    progressBg: '#E0E0E0',
    skeleton: '#EEEEEE',

    // Premium
    premiumGradientStart: '#FFB347',
    premiumGradientEnd: '#FF8C00',
    premiumBg: 'rgba(255, 215, 0, 0.1)',
    premiumText: '#B8860B',
  },
  dark: {
    // Backgrounds
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
    primary: '#4D7CFF',
    primaryLight: '#1A2340',
    secondary: '#FF4D5A',
    accent: '#FFD700',
    accentBg: 'rgba(255, 215, 0, 0.12)',

    // Feedback
    success: '#4CAF50',
    successBg: '#1B2E1C',
    error: '#EF5350',
    errorBg: '#2E1B1B',
    warning: '#FFB74D',
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
    premiumGradientStart: '#FFB347',
    premiumGradientEnd: '#FF8C00',
    premiumBg: 'rgba(255, 179, 71, 0.12)',
    premiumText: '#FFD700',
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

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 999,
};
