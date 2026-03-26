import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useExamStore } from '../../stores/examStore';
import * as examsService from '../../services/exams';
import type { Choice } from '@civique/shared';

export default function ExamSessionScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const {
    currentSession,
    questions,
    currentIndex,
    answers,
    setQuestions,
    setAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
  } = useExamStore();

  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const effectiveSessionId = sessionId || currentSession?.id;

  // Load questions
  useEffect(() => {
    async function loadExam() {
      if (!effectiveSessionId) {
        setError("Aucune session d'examen trouv\u00e9e");
        setIsLoading(false);
        return;
      }

      try {
        const examData = await examsService.getExam(effectiveSessionId);
        setQuestions(examData.questions);
      } catch {
        setError('Impossible de charger les questions');
      } finally {
        setIsLoading(false);
      }
    }
    loadExam();
  }, [effectiveSessionId]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectChoice = useCallback(
    async (choiceId: 'a' | 'b' | 'c' | 'd') => {
      if (!effectiveSessionId || !questions[currentIndex]) return;

      const question = questions[currentIndex];
      setAnswer(question.id, choiceId);
      setIsSubmittingAnswer(true);

      try {
        await examsService.submitAnswer(effectiveSessionId, {
          questionId: question.id,
          selectedChoice: choiceId,
        });
      } catch {
        // Answer saved locally even if API fails
      } finally {
        setIsSubmittingAnswer(false);
      }
    },
    [effectiveSessionId, questions, currentIndex, setAnswer],
  );

  const handleFinish = useCallback(async () => {
    if (!effectiveSessionId || isFinishing) return;
    setIsFinishing(true);

    if (timerRef.current) clearInterval(timerRef.current);

    try {
      await examsService.finishExam(effectiveSessionId);
    } catch {
      // Continue to results even if finish call fails
    }

    router.replace(`/exam/results?sessionId=${effectiveSessionId}`);
  }, [effectiveSessionId, isFinishing, router]);

  const confirmFinish = () => {
    const answered = Object.keys(answers).length;
    const total = questions.length;

    if (answered < total) {
      Alert.alert(
        'Terminer l\u2019examen ?',
        `Vous avez r\u00e9pondu \u00e0 ${answered}/${total} questions. Les questions sans r\u00e9ponse seront compt\u00e9es comme incorrectes.`,
        [
          { text: 'Continuer', style: 'cancel' },
          { text: 'Terminer', style: 'destructive', onPress: handleFinish },
        ],
      );
    } else {
      handleFinish();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#002395" />
        <Text style={styles.loadingText}>Chargement de l'examen...</Text>
      </View>
    );
  }

  if (error || !questions.length) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color="#ED2939" />
        <Text style={styles.errorText}>{error || 'Aucune question'}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.replace('/exam')}
        >
          <Text style={styles.retryButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedChoice = currentQuestion ? answers[currentQuestion.id] : undefined;
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const choices: Choice[] = currentQuestion.choicesFr;
  const isTimeLow = timeLeft < 5 * 60;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.progress}>
          {currentIndex + 1} / {totalQuestions}
        </Text>
        <Text style={[styles.timer, isTimeLow && styles.timerLow]}>
          {formatTime(timeLeft)}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            },
          ]}
        />
      </View>

      {/* Answered indicator */}
      <Text style={styles.answeredText}>
        {answeredCount}/{totalQuestions} r{'\u00e9'}pondues
      </Text>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.textFr}</Text>
        </View>

        {/* Choices */}
        <View style={styles.choices}>
          {choices.map((choice) => {
            const isSelected = selectedChoice === choice.id;

            return (
              <TouchableOpacity
                key={choice.id}
                style={[
                  styles.choiceButton,
                  isSelected && styles.choiceSelected,
                ]}
                onPress={() =>
                  handleSelectChoice(choice.id as 'a' | 'b' | 'c' | 'd')
                }
                disabled={isSubmittingAnswer}
              >
                <View
                  style={[
                    styles.choiceIdBadge,
                    isSelected && styles.choiceIdSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceId,
                      isSelected && styles.choiceIdTextWhite,
                    ]}
                  >
                    {choice.id.toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.choiceText,
                    isSelected && styles.choiceTextSelected,
                  ]}
                >
                  {choice.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Question Dots */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dotsScroll}
        contentContainerStyle={styles.dotsContainer}
      >
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCurrent = idx === currentIndex;
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dot,
                isAnswered && styles.dotAnswered,
                isCurrent && styles.dotCurrent,
              ]}
              onPress={() => goToQuestion(idx)}
            >
              <Text
                style={[
                  styles.dotText,
                  isAnswered && styles.dotTextAnswered,
                  isCurrent && styles.dotTextCurrent,
                ]}
              >
                {idx + 1}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={prevQuestion}
          disabled={currentIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={currentIndex === 0 ? '#CCC' : '#002395'}
          />
          <Text
            style={[
              styles.navButtonText,
              currentIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Pr{'\u00e9'}c{'\u00e9'}dent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.finishSmallButton]}
          onPress={confirmFinish}
          disabled={isFinishing}
        >
          {isFinishing ? (
            <ActivityIndicator color="#ED2939" size="small" />
          ) : (
            <Text style={styles.finishSmallButtonText}>Terminer</Text>
          )}
        </TouchableOpacity>

        {currentIndex < totalQuestions - 1 ? (
          <TouchableOpacity style={styles.navButton} onPress={nextQuestion}>
            <Text style={styles.navButtonText}>Suivant</Text>
            <Ionicons name="chevron-forward" size={20} color="#002395" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.finishButton, isFinishing && styles.finishButtonDisabled]}
            onPress={confirmFinish}
            disabled={isFinishing}
          >
            {isFinishing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.finishButtonText}>Terminer</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#002395',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002395',
  },
  timerLow: {
    color: '#ED2939',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#002395',
    borderRadius: 3,
  },
  answeredText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginBottom: 16,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    minHeight: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
  },
  choices: {
    gap: 12,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#EEE',
  },
  choiceSelected: {
    borderColor: '#002395',
    backgroundColor: '#002395',
  },
  choiceIdBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  choiceIdSelected: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  choiceId: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
  choiceIdTextWhite: {
    color: '#FFFFFF',
  },
  choiceText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  choiceTextSelected: {
    color: '#FFFFFF',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#002395',
  },
  navButtonTextDisabled: {
    color: '#CCC',
  },
  finishButton: {
    backgroundColor: '#ED2939',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    minWidth: 120,
    alignItems: 'center',
  },
  finishButtonDisabled: {
    backgroundColor: '#F5A0A8',
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  finishSmallButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  finishSmallButtonText: {
    color: '#ED2939',
    fontSize: 13,
    fontWeight: '600',
  },
  dotsScroll: {
    maxHeight: 44,
    marginBottom: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dotAnswered: {
    backgroundColor: '#002395',
  },
  dotCurrent: {
    borderColor: '#002395',
    backgroundColor: '#FFFFFF',
  },
  dotText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
  },
  dotTextAnswered: {
    color: '#FFFFFF',
  },
  dotTextCurrent: {
    color: '#002395',
  },
});
