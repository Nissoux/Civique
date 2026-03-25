import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from '@civique/shared';

const LANGUAGE_KEY = 'civique_language';

interface LanguageState {
  currentLang: Language;
  setLanguage: (lang: Language) => Promise<void>;
  loadStoredLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLang: 'fr',

  setLanguage: async (lang: Language) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    set({ currentLang: lang });
  },

  loadStoredLanguage: async () => {
    const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (stored) {
      set({ currentLang: stored as Language });
    }
  },
}));
