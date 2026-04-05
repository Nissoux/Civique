import { useRandomQuestions } from '../../hooks/useQuestions';
import TrainingSession from '../../components/TrainingSession';

export default function RandomTrainingScreen() {
  const { data: questions, isLoading, error, refetch } = useRandomQuestions(10);

  return (
    <TrainingSession
      questions={questions || []}
      isLoading={isLoading}
      error={error}
      onRefetch={refetch}
    />
  );
}
