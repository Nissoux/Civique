'use client';

import { create } from 'zustand';
import type { Flashcard } from '@/lib/data/flashcards';

const STORAGE_KEY = 'civique_flashcard_progress';

export type CardStatus = 'known' | 'unknown' | 'unseen';

interface FlashcardState {
  progress: Record<number, CardStatus>;
  loaded: boolean;

  loadProgress: () => void;
  saveProgress: () => void;
  markCard: (cardId: number, status: 'known' | 'unknown') => void;
  markCards: (entries: Array<{ id: number; status: 'known' | 'unknown' }>) => void;
  resetProgress: () => void;
  resetTheme: (themeId: number, cards: Flashcard[]) => void;
  getThemeProgress: (
    themeId: number,
    cards: Flashcard[],
  ) => { known: number; unknown: number; total: number };
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  progress: {},
  loaded: false,

  loadProgress: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        set({ progress: JSON.parse(raw) ?? {}, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  saveProgress: () => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(get().progress),
      );
    } catch {
      // silent
    }
  },

  markCard: (cardId, status) => {
    set((state) => ({
      progress: { ...state.progress, [cardId]: status },
    }));
    get().saveProgress();
  },

  markCards: (entries) => {
    set((state) => {
      const next = { ...state.progress };
      for (const e of entries) {
        next[e.id] = e.status;
      }
      return { progress: next };
    });
    get().saveProgress();
  },

  resetProgress: () => {
    set({ progress: {} });
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  },

  resetTheme: (themeId, cards) => {
    set((state) => {
      const next = { ...state.progress };
      for (const c of cards) {
        if (c.themeId === themeId) delete next[c.id];
      }
      return { progress: next };
    });
    get().saveProgress();
  },

  getThemeProgress: (themeId, cards) => {
    const themeCards = cards.filter((c) => c.themeId === themeId);
    const { progress } = get();
    let known = 0;
    let unknown = 0;
    for (const c of themeCards) {
      if (progress[c.id] === 'known') known += 1;
      else if (progress[c.id] === 'unknown') unknown += 1;
    }
    return { known, unknown, total: themeCards.length };
  },
}));
