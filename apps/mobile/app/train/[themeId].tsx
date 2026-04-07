import { useLocalSearchParams } from 'expo-router';
import { THEMES } from '@civique/shared';
import { useRandomQuestions } from '../../hooks/useQuestions';
import TrainingSession from '../../components/TrainingSession';
import { useLayoutEffect, useCallback } from 'react';
import { useNavigation } from 'expo-router';
import { useProgressionStore } from '../../stores/progressionStore';

export default function ThemeTrainingScreen() {
  const { themeId, series } = useLocalSearchParams<{ themeId: string; series?: string }>();
  const numericThemeId = parseInt(themeId, 10);
  const levelNum = series ? parseInt(series, 10) : 1;
  const navigation = useNavigation();
  const { completeLevel } = useProgressionStore();

  const theme = THEMES.find((t) => t.id === numericThemeId);

  useLayoutEffect(() => {
    if (theme) {
      navigation.setOptions({
        headerTitle: `${theme.nameFr} · Niveau ${levelNum}`,
      });
    }
  }, [theme, levelNum, navigation]);

  const { data: questions, isLoading, error, refetch } = useRandomQuestions(
    10,
    numericThemeId,
  );

  const handleSessionComplete = useCallback((correctCount: number, totalQuestions: number) => {
    completeLevel(numericThemeId, levelNum, correctCount, totalQuestions);
  }, [numericThemeId, levelNum, completeLevel]);

  return (
    <TrainingSession
      questions={questions || []}
      isLoading={isLoading}
      error={error}
      onRefetch={refetch}
      onSessionComplete={handleSessionComplete}
    />
  );
}
