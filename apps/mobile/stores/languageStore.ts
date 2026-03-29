import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from '@civique/shared';
import { LANGUAGES } from '@civique/shared';

const LANGUAGE_KEY = 'civique_language';

const RTL_LANGS = new Set(LANGUAGES.filter((l) => l.rtl).map((l) => l.code));

interface LanguageState {
  currentLang: Language;
  isRtl: boolean;
  setLanguage: (lang: Language) => Promise<void>;
  loadStoredLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLang: 'fr',
  isRtl: false,

  setLanguage: async (lang: Language) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    set({ currentLang: lang, isRtl: RTL_LANGS.has(lang) });
  },

  loadStoredLanguage: async () => {
    const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (stored) {
      const lang = stored as Language;
      set({ currentLang: lang, isRtl: RTL_LANGS.has(lang) });
    }
  },
}));
