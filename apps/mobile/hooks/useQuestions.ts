import { useQuery } from '@tanstack/react-query';
import * as questionsService from '../services/questions';
import { useLanguageStore } from '../stores/languageStore';
import type { Language } from '@civique/shared';

export function useRandomQuestions(
  count: number = 10,
  themeId?: number,
) {
  // Always fetch in French - translations are loaded separately by TrainingSession
  return useQuery({
    queryKey: ['questions', 'random', count, themeId],
    queryFn: () =>
      questionsService.getRandomQuestions({
        count,
        themeId,
        lang: 'fr',
      }),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

export function useQuestions(params: questionsService.GetQuestionsParams = {}) {
  const { currentLang } = useLanguageStore();
  const effectiveLang = params.lang || currentLang;

  return useQuery({
    queryKey: ['questions', { ...params, lang: effectiveLang }],
    queryFn: () =>
      questionsService.getQuestions({ ...params, lang: effectiveLang }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useQuestion(id: number, lang?: Language) {
  const { currentLang } = useLanguageStore();
  const effectiveLang = lang || currentLang;

  return useQuery({
    queryKey: ['question', id, effectiveLang],
    queryFn: () => questionsService.getQuestion(id, effectiveLang),
    enabled: id > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
