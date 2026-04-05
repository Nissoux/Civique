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

  // Capture the language at first render only — don't refetch on lang change
  const initialLangRef = useRef(effectiveLang);

  return useQuery({
    // NO language in queryKey — same questions regardless of language changes
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

export function useSeriesQuestions(themeId: number, series: number) {
  const { currentLang } = useLanguageStore();
  const { selectedExamType } = useExamTypeStore();

  return useQuery({
    queryKey: ['questions', 'series', themeId, series, selectedExamType],
    queryFn: () =>
      questionsService.getSeriesQuestions(
        themeId,
        series,
        selectedExamType || undefined,
        currentLang,
      ),
    staleTime: Infinity, // Fixed series never change
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
