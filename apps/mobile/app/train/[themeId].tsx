import { useLocalSearchParams } from 'expo-router';
import { THEMES } from '@civique/shared';
import { useRandomQuestions } from '../../hooks/useQuestions';
import TrainingSession from '../../components/TrainingSession';
import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';

export default function ThemeTrainingScreen() {
  const { themeId } = useLocalSearchParams<{ themeId: string }>();
  const numericThemeId = parseInt(themeId, 10);
  const navigation = useNavigation();

  const theme = THEMES.find((t) => t.id === numericThemeId);

  useLayoutEffect(() => {
    if (theme) {
      navigation.setOptions({
        headerTitle: theme.nameFr,
      });
    }
  }, [theme, navigation]);

  const { data: questions, isLoading, error, refetch } = useRandomQuestions(
    10,
    numericThemeId,
  );

  return (
    <TrainingSession
      questions={questions || []}
      isLoading={isLoading}
      error={error}
      onRefetch={refetch}
    />
  );
}
