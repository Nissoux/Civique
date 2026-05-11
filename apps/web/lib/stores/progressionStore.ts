'use client';

import { create } from 'zustand';

const STORAGE_KEY = 'civique_progression';

export interface LevelProgress {
  themeId: number;
  levelNum: number;
  crowns: number; // 0-3
  bestScore: number; // 0-100
  attempts: number;
  completedAt?: string;
}

interface ProgressionState {
  xp: number;
  streak: number;
  lastPracticeDate: string | null;
  levels: Record<string, LevelProgress>; // key: "themeId-levelNum"
  loaded: boolean;

  loadProgress: () => void;
  clearProgress: () => void;
  saveProgress: () => void;
  getLevelProgress: (themeId: number, levelNum: number) => LevelProgress;
  isLevelUnlocked: (themeId: number, levelNum: number, totalLevels: number) => boolean;
  completeLevel: (
    themeId: number,
    levelNum: number,
    score: number,
    totalQuestions: number,
  ) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  getThemeCrowns: (
    themeId: number,
    totalLevels: number,
  ) => { earned: number; total: number };
}

function levelKey(themeId: number, levelNum: number): string {
  return `${themeId}-${levelNum}`;
}

function getCrownsForScore(score: number): number {
  if (score >= 100) return 3;
  if (score >= 80) return 2;
  if (score >= 60) return 1;
  return 0;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export const useProgressionStore = create<ProgressionState>((set, get) => ({
  xp: 0,
  streak: 0,
  lastPracticeDate: null,
  levels: {},
  loaded: false,

  loadProgress: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set({
          xp: data.xp || 0,
          streak: data.streak || 0,
          lastPracticeDate: data.lastPracticeDate || null,
          levels: data.levels || {},
          loaded: true,
        });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  saveProgress: () => {
    if (typeof window === 'undefined') return;
    const { xp, streak, lastPracticeDate, levels } = get();
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ xp, streak, lastPracticeDate, levels }),
      );
    } catch {
      // silent
    }
  },

  clearProgress: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    set({ xp: 0, streak: 0, lastPracticeDate: null, levels: {} });
  },

  getLevelProgress: (themeId, levelNum) => {
    const key = levelKey(themeId, levelNum);
    return (
      get().levels[key] ?? {
        themeId,
        levelNum,
        crowns: 0,
        bestScore: 0,
        attempts: 0,
      }
    );
  },

  isLevelUnlocked: (themeId, levelNum) => {
    if (levelNum === 1) return true;
    const prev = get().getLevelProgress(themeId, levelNum - 1);
    return prev.crowns >= 1;
  },

  completeLevel: (themeId, levelNum, score, totalQuestions) => {
    const key = levelKey(themeId, levelNum);
    const current = get().getLevelProgress(themeId, levelNum);
    const scorePercent = Math.round((score / totalQuestions) * 100);
    const newCrowns = getCrownsForScore(scorePercent);

    const xpEarned = score * 10 + (newCrowns > current.crowns ? 100 : 0) + 50;

    set((state) => ({
      levels: {
        ...state.levels,
        [key]: {
          themeId,
          levelNum,
          crowns: Math.max(current.crowns, newCrowns),
          bestScore: Math.max(current.bestScore, scorePercent),
          attempts: current.attempts + 1,
          completedAt: new Date().toISOString(),
        },
      },
      xp: state.xp + xpEarned,
    }));

    get().updateStreak();
    get().saveProgress();
  },

  addXP: (amount) => {
    set((state) => ({ xp: state.xp + amount }));
    get().saveProgress();
  },

  updateStreak: () => {
    const today = todayStr();
    const { lastPracticeDate, streak } = get();
    if (lastPracticeDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];

    const newStreak = lastPracticeDate === yStr ? streak + 1 : 1;
    set({ streak: newStreak, lastPracticeDate: today });
    get().saveProgress();
  },

  getThemeCrowns: (themeId, totalLevels) => {
    let earned = 0;
    const total = totalLevels * 3;
    for (let i = 1; i <= totalLevels; i++) {
      earned += get().getLevelProgress(themeId, i).crowns;
    }
    return { earned, total };
  },
}));
