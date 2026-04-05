import { useLocalSearchParams } from 'expo-router';
import { THEMES } from '@civique/shared';
import { useRandomQuestions } from '../../hooks/useQuestions';
import TrainingSession from '../../components/TrainingSession';
import { useLayoutEffect, useEffect, useRef } from 'react';
import { useNavigation } from 'expo-router';
import { useProgressionStore } from '../../stores/progressionStore';

export default function ThemeTrainingScreen() {
  const { themeId, series } = useLocalSearchParams<{ themeId: string; series?: string }>();
  const numericThemeId = parseInt(themeId, 10);
  const levelNum = series ? parseInt(series, 10) : 1;
  const navigation = useNavigation();
  const { completeLevel } = useProgressionStore();
  const completedRef = useRef(false);

  const theme = THEMES.find((t) => t.id === numericThemeId);

  useLayoutEffect(() => {
    if (theme) {
      navigation.setOptions({
        headerTitle: `${theme.nameFr} · Niveau ${levelNum}`,
      });
    }
  }, [theme, levelNum, navigation]);

  const { data: questions, isLoading, error, refetch } = useRandomQuestions(
    10, // 10 questions per level (Duolingo style)
    numericThemeId,
  );

  // Track completion via the training store's session results
  // We use a ref to prevent double-completion
  useEffect(() => {
    return () => {
      // On unmount, if there are results, save them
      // This is a best-effort approach - the real completion
      // should be triggered from TrainingSession's completion callback
    };
  }, []);

  return (
    <TrainingSession
      questions={questions || []}
      isLoading={isLoading}
      error={error}
      onRefetch={refetch}
    />
  );
}
