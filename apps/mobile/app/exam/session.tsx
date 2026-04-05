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
import { useLanguageStore } from '../../stores/languageStore';
import * as examsService from '../../services/exams';
import type { Choice, Question } from '@civique/shared';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { shuffleChoices, getShuffledCorrectChoice } from '../../utils/shuffleChoices';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ExamSessionScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const c = useColors();
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

  const insets = useSafeAreaInsets();
  const { currentLang, isRtl } = useLanguageStore();
  const effectiveSessionId = sessionId || currentSession?.id;

  const getQuestionText = (q: Question): string =>
    currentLang !== 'fr' && q.translatedText ? q.translatedText : q.textFr;

  const getChoices = (q: Question): Choice[] =>
    currentLang !== 'fr' && q.translatedChoices?.length ? q.translatedChoices : q.choicesFr;

  // Load questions
  useEffect(() => {
    async function loadExam() {
      if (!effectiveSessionId) {
        setError("Aucune session d'examen trouvée");
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

  const handleFinishRef = useRef<() => void>(() => {});

  // Timer — FIX 3: use local variable for interval, proper cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // FIX 2 & FIX 5: Store ORIGINAL choice ID, add null safety
  const handleSelectChoice = useCallback(
    async (choiceId: 'a' | 'b' | 'c' | 'd') => {
      if (!effectiveSessionId || !questions.length || !questions[currentIndex]) return;

      const question = questions[currentIndex];
      if (!question) return;

      // Map shuffled label back to original choice ID for storage and API
      const rawCh = question.choicesFr || [];
      const { originalToNew: mapping } = shuffleChoices(rawCh, question.id);
      const reverseMap = Object.fromEntries(Object.entries(mapping).map(([k, v]) => [v, k]));
      const originalChoiceId = (reverseMap[choiceId] || choiceId) as 'a' | 'b' | 'c' | 'd';

      // Store the ORIGINAL choice ID (not the shuffled one)
      setAnswer(question.id, originalChoiceId);
      setIsSubmittingAnswer(true);

      try {
        await examsService.submitAnswer(effectiveSessionId, {
          questionId: question.id,
          selectedChoice: originalChoiceId,
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

    try {
      await examsService.finishExam(effectiveSessionId);
    } catch {
      // Continue to results even if finish call fails
    }

    router.replace(`/exam/results?sessionId=${effectiveSessionId}`);
  }, [effectiveSessionId, isFinishing, router]);

  useEffect(() => { handleFinishRef.current = handleFinish; }, [handleFinish]);

  const confirmFinish = () => {
    const answered = Object.keys(answers).length;
    const total = questions.length;

    if (answered < total) {
      Alert.alert(
        'Terminer l\'examen ?',
        `Vous avez répondu à ${answered}/${total} questions. Les questions sans réponse seront comptées comme incorrectes.`,
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
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.primary} />
        <Text style={[styles.loadingText, { color: c.textSecondary }]}>Chargement de l'examen...</Text>
      </View>
    );
  }

  if (error || !questions.length) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <Ionicons name="alert-circle" size={48} color={c.secondary} />
        <Text style={[styles.errorText, { color: c.textSecondary }]}>{error || 'Aucune question'}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: c.primary }]}
          onPress={() => router.replace('/exam')}
        >
          <Text style={[styles.retryButtonText, { color: c.textInverse }]}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const rawChoices: Choice[] = getChoices(currentQuestion);
  const { choices, originalToNew } = shuffleChoices(rawChoices, currentQuestion.id);
  const questionText = getQuestionText(currentQuestion);

  // Map stored answer (original ID) to shuffled label for display
  // Only show selection if this specific question was answered
  const storedAnswer = currentQuestion.id in answers ? answers[currentQuestion.id] : null;
  const selectedChoice = storedAnswer ? (originalToNew[storedAnswer] || null) : null;

  const showTranslation = currentLang !== 'fr';
  const translatedText = showTranslation && currentQuestion.translatedText && currentQuestion.translatedText !== currentQuestion.textFr
    ? currentQuestion.translatedText : null;
  const rawTranslatedChoices = showTranslation && currentQuestion.translatedChoices?.length &&
    JSON.stringify(currentQuestion.translatedChoices) !== JSON.stringify(currentQuestion.choicesFr)
    ? currentQuestion.translatedChoices : null;
  // Shuffle translated choices in the same order
  const translatedChoices = rawTranslatedChoices
    ? choices.map((c) => {
        // Find the original ID that maps to this new label
        const origId = Object.entries(originalToNew).find(([_, v]) => v === c.id)?.[0];
        const translated = rawTranslatedChoices.find((tc) => tc.id === origId);
        return translated ? { id: c.id, text: translated.text } : { id: c.id, text: c.text };
      })
    : null;
  const isTimeLow = timeLeft < 5 * 60;

  return (
    <View style={[styles.container, { backgroundColor: c.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.progress, { color: c.textPrimary }]}>
          {currentIndex + 1} / {totalQuestions}
        </Text>
        <Text style={[styles.timer, { color: c.primary }, isTimeLow && { color: c.secondary }]}>
          {formatTime(timeLeft)}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressBar, { backgroundColor: c.progressBg }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: c.primary,
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            },
          ]}
        />
      </View>

      {/* Answered indicator */}
      <Text style={[styles.answeredText, { color: c.textTertiary }]}>
        {answeredCount}/{totalQuestions} répondues
      </Text>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Question */}
        <View style={[styles.questionCard, { backgroundColor: c.card }]}>
          <Text style={[styles.questionText, { color: c.textPrimary }]}>{questionText}</Text>
          {translatedText && (
            <Text style={[styles.translatedText, { color: c.textSecondary, borderTopColor: c.border }, isRtl && { writingDirection: 'rtl', textAlign: 'right' }]}>
              {translatedText}
            </Text>
          )}
        </View>

        {/* Choices */}
        <View style={styles.choices}>
          {choices.map((choice) => {
            const isSelected = selectedChoice === choice.id;

            return (
              <TouchableOpacity
                key={choice.id}
                activeOpacity={0.7}
                style={[
                  styles.choiceButton,
                  { backgroundColor: c.card, borderColor: c.border },
                  isSelected && { borderColor: c.primary, backgroundColor: c.primary, transform: [{ scale: 0.98 }] },
                ]}
                onPress={() =>
                  handleSelectChoice(choice.id as 'a' | 'b' | 'c' | 'd')
                }
                disabled={isSubmittingAnswer}
              >
                <View
                  style={[
                    styles.choiceIdBadge,
                    { backgroundColor: c.surfaceElevated },
                    isSelected && { backgroundColor: 'rgba(255,255,255,0.3)' },
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceId,
                      { color: c.textPrimary },
                      isSelected && { color: c.textInverse },
                    ]}
                  >
                    {choice.id.toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1, flexShrink: 1 }}>
                  <Text
                    style={[
                      styles.choiceText,
                      { color: c.textPrimary },
                      isSelected && { color: c.textInverse },
                    ]}
                  >
                    {choice.text}
                  </Text>
                  {translatedChoices && (
                    <Text
                      style={[
                        styles.choiceTranslated,
                        { color: c.textSecondary },
                        isSelected && { color: 'rgba(255,255,255,0.7)' },
                        isRtl && { writingDirection: 'rtl', textAlign: 'right' },
                      ]}
                    >
                      {translatedChoices.find((tc) => tc.id === choice.id)?.text}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Validate button */}
      <View style={[styles.validateRow, { paddingBottom: insets.bottom }]}>
        {currentIndex < totalQuestions - 1 ? (
          <TouchableOpacity
            style={[styles.validateButton, { backgroundColor: c.success }, !selectedChoice && { opacity: 0.4 }]}
            onPress={nextQuestion}
            disabled={!selectedChoice}
          >
            <Text style={styles.validateButtonText}>Valider</Text>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          /* FIX 4: Require answer before finishing on last question */
          <TouchableOpacity
            style={[
              styles.validateButton,
              { backgroundColor: selectedChoice ? c.primary : c.textTertiary },
              (isFinishing || !selectedChoice) && { opacity: 0.5 },
            ]}
            onPress={confirmFinish}
            disabled={isFinishing || !selectedChoice}
          >
            {isFinishing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.validateButtonText}>Terminer l'examen</Text>
                <Ionicons name="flag" size={20} color="#FFFFFF" />
              </>
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
    padding: spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  loadingText: {
    fontSize: fontSize.lg,
    marginTop: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  retryButton: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: 14,
  },
  retryButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progress: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  timer: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  answeredText: {
    fontSize: fontSize.xs,
    textAlign: 'right',
    marginBottom: spacing.lg,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  questionCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
    minHeight: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: fontSize.xl,
    lineHeight: 26,
  },
  translatedText: {
    fontSize: fontSize.md,
    lineHeight: 22,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    fontStyle: 'italic',
  },
  choices: {
    gap: spacing.md,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
  },
  choiceIdBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  choiceId: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  choiceText: {
    fontSize: fontSize.md,
    flex: 1,
    flexWrap: 'wrap',
    lineHeight: 22,
  },
  choiceTranslated: {
    fontSize: fontSize.sm,
    marginTop: 3,
    fontStyle: 'italic',
  },
  validateRow: {
    paddingTop: spacing.lg,
  },
  validateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    height: 56,
  },
  validateButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
});
