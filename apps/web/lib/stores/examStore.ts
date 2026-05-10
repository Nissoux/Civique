'use client';

import { create } from 'zustand';

const STORAGE_KEY = 'civique_exam_session';

export type ChoiceLabel = 'a' | 'b' | 'c' | 'd';

export interface PersistedExamState {
  sessionId: string;
  /** ms-since-epoch when the session started (used to compute remaining time). */
  startedAt: number;
  /** Total time limit in seconds (server-controlled, default 2700 = 45min). */
  timeLimitSec: number;
  /** Index in the questions array — index, not question id. */
  currentIndex: number;
  /** questionId → ORIGINAL (unshuffled) choice id. */
  answers: Record<number, ChoiceLabel>;
}

interface ExamStore {
  state: PersistedExamState | null;

  /** Initialize from server data; preserves matching answers if same session. */
  initSession: (init: {
    sessionId: string;
    startedAt: number;
    timeLimitSec: number;
    initialAnswers?: Record<number, ChoiceLabel>;
  }) => void;
  setAnswer: (questionId: number, choice: ChoiceLabel) => void;
  setIndex: (index: number) => void;
  next: (totalQuestions: number) => void;
  prev: () => void;
  /** Hydrate from localStorage. Call once on client mount. */
  hydrate: () => PersistedExamState | null;
  /** Clear the persisted session (after finishing or abandoning). */
  clear: () => void;
}

function readStorage(): PersistedExamState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedExamState;
    if (
      typeof parsed?.sessionId !== 'string' ||
      typeof parsed?.startedAt !== 'number' ||
      typeof parsed?.timeLimitSec !== 'number'
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(state: PersistedExamState | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (state === null) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // quota / privacy mode — silent
  }
}

export const useExamStore = create<ExamStore>((set, get) => ({
  state: null,

  initSession: ({ sessionId, startedAt, timeLimitSec, initialAnswers = {} }) => {
    const existing = get().state;
    const sameSession = existing?.sessionId === sessionId;
    const next: PersistedExamState = {
      sessionId,
      startedAt,
      timeLimitSec,
      currentIndex: sameSession ? existing!.currentIndex : 0,
      // Merge: server answers take precedence (source of truth) but keep any
      // local answers the server hasn't seen yet.
      answers: sameSession
        ? { ...existing!.answers, ...initialAnswers }
        : { ...initialAnswers },
    };
    writeStorage(next);
    set({ state: next });
  },

  setAnswer: (questionId, choice) => {
    const cur = get().state;
    if (!cur) return;
    const next: PersistedExamState = {
      ...cur,
      answers: { ...cur.answers, [questionId]: choice },
    };
    writeStorage(next);
    set({ state: next });
  },

  setIndex: (index) => {
    const cur = get().state;
    if (!cur) return;
    const next = { ...cur, currentIndex: Math.max(0, index) };
    writeStorage(next);
    set({ state: next });
  },

  next: (totalQuestions) => {
    const cur = get().state;
    if (!cur) return;
    if (cur.currentIndex < totalQuestions - 1) {
      const next = { ...cur, currentIndex: cur.currentIndex + 1 };
      writeStorage(next);
      set({ state: next });
    }
  },

  prev: () => {
    const cur = get().state;
    if (!cur) return;
    if (cur.currentIndex > 0) {
      const next = { ...cur, currentIndex: cur.currentIndex - 1 };
      writeStorage(next);
      set({ state: next });
    }
  },

  hydrate: () => {
    const stored = readStorage();
    set({ state: stored });
    return stored;
  },

  clear: () => {
    writeStorage(null);
    set({ state: null });
  },
}));
