import { useLocalSearchParams } from 'expo-router';
import { THEMES } from '@civique/shared';
import { useSeriesQuestions, useRandomQuestions } from '../../hooks/useQuestions';
import TrainingSession from '../../components/TrainingSession';
import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';

export default function ThemeTrainingScreen() {
  const { themeId, series } = useLocalSearchParams<{ themeId: string; series?: string }>();
  const numericThemeId = parseInt(themeId, 10);
  const seriesNumber = series ? parseInt(series, 10) : 0;
  const navigation = useNavigation();

  const theme = THEMES.find((t) => t.id === numericThemeId);

  useLayoutEffect(() => {
    if (theme) {
      const title = seriesNumber
        ? `${theme.nameFr} — Série ${seriesNumber}`
        : theme.nameFr;
      navigation.setOptions({ headerTitle: title });
    }
  }, [theme, seriesNumber, navigation]);

  // If series specified, use fixed series questions; otherwise random
  const seriesQuery = useSeriesQuestions(numericThemeId, seriesNumber || 1);
  const randomQuery = useRandomQuestions(20, numericThemeId);

  const query = seriesNumber ? seriesQuery : randomQuery;

  return (
    <TrainingSession
      questions={query.data || []}
      isLoading={query.isLoading}
      error={query.error}
      onRefetch={query.refetch}
    />
  );
}
