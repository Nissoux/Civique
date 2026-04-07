import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import * as questionsService from '../services/questions';
import { useLanguageStore } from '../stores/languageStore';
import { useExamTypeStore } from '../stores/examTypeStore';
import type { Language } from '@civique/shared';

export function useRandomQuestions(
  count: number = 10,
  themeId?: number,
  lang?: Language,
) {
  const { currentLang } = useLanguageStore();
  const { selectedExamType } = useExamTypeStore();
  const effectiveLang = lang || currentLang;

  const initialLangRef = useRef(effectiveLang);

  return useQuery({
    queryKey: ['questions', 'random', count, themeId, selectedExamType],
    queryFn: () =>
      questionsService.getRandomQuestions({
        count,
        themeId,
        lang: initialLangRef.current,
        examType: selectedExamType || undefined,
      }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch questions for a specific level (paginated, not random).
 * Level 1 = offset 0, Level 2 = offset 10, etc.
 * Ensures each level has unique questions.
 */
export function useLevelQuestions(
  themeId: number,
  levelNum: number,
  questionsPerLevel: number = 10,
) {
  const { currentLang } = useLanguageStore();
  const { selectedExamType } = useExamTypeStore();
  const offset = (levelNum - 1) * questionsPerLevel;

  return useQuery({
    queryKey: ['questions', 'level', themeId, levelNum, selectedExamType],
    queryFn: async () => {
      const result = await questionsService.getQuestions({
        themeId,
        examType: selectedExamType || undefined,
        lang: currentLang !== 'fr' ? currentLang : undefined,
        limit: questionsPerLevel,
        offset,
      });
      return result.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useQuestions(params: questionsService.GetQuestionsParams = {}) {
  const { currentLang } = useLanguageStore();
  const { selectedExamType } = useExamTypeStore();
  const effectiveLang = params.lang || currentLang;

  return useQuery({
    queryKey: ['questions', { ...params, lang: effectiveLang, examType: selectedExamType }],
    queryFn: () =>
      questionsService.getQuestions({
        ...params,
        lang: effectiveLang,
        examType: params.examType || selectedExamType || undefined,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useQuestion(id: number, lang?: Language) {
  const { currentLang } = useLanguageStore();
  const effectiveLang = lang || currentLang;

  return useQuery({
    queryKey: ['question', id, effectiveLang],
    queryFn: () => questionsService.getQuestion(id, effectiveLang),
    enabled: id > 0,
    staleTime: 10 * 60 * 1000,
  });
}
