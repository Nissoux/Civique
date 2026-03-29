import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Question, Language, Choice } from '@civique/shared';
import { LANGUAGES } from '@civique/shared';
import { recordPractice } from '../services/stats';
import { getQuestionsByIds } from '../services/questions';
import { useLanguageStore } from '../stores/languageStore';
import { useColors, spacing as themeSpacing, fontSize as themeFontSize, borderRadius as themeBorderRadius } from '../constants/theme';
import { shuffleChoices, getShuffledCorrectChoice } from '../utils/shuffleChoices';
import { useTrainingStore } from '../stores/trainingStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QuotaPaywall from './QuotaPaywall';

interface TrainingSessionProps {
  questions: Question[];
  isLoading: boolean;
  error: Error | null;
  onRefetch: () => void;
}

export default function TrainingSession({
  questions,
  isLoading,
  error,
  onRefetch,
}: TrainingSessionProps) {
  const router = useRouter();
  const { currentLang, isRtl, setLanguage } = useLanguageStore();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { saveSession, loadSession, clearSession } = useTrainingStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredMap, setAnsweredMap] = useState<Record<number, string>>({});
  const [wrongAnswers, setWrongAnswers] = useState<{ question: string; selected: string; correct: string }[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localQuestions, setLocalQuestions] = useState<Question[]>(questions);
  const [isChangingLang, setIsChangingLang] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState<{ limit: number; used: number; resetsAt?: string } | null>(null);
  const [restoredFromSave, setRestoredFromSave] = useState(false);

  // Track the question IDs we've loaded to avoid re-syncing the same set
  const loadedIdsRef = useRef<string>('');

  // Load questions on first mount or when a genuinely NEW set arrives (new session)
  useEffect(() => {
    if (!questions.length) return;
    const newIds = questions.map((q) => q.id).sort().join(',');
    if (newIds === loadedIdsRef.current) return; // Same questions, skip

    // Check for saved session first
    if (!restoredFromSave) {
      loadSession().then((saved) => {
        if (saved && saved.isActive && saved.questions.length > 0) {
          const savedIds = saved.questions.map((q) => q.id).sort().join(',');
          if (savedIds === newIds) {
            setLocalQuestions(saved.questions);
            setCurrentIndex(saved.currentIndex);
            setCorrectCount(saved.correctCount);
          setAnsweredMap(saved.answers || {});
            loadedIdsRef.current = newIds;
            setRestoredFromSave(true);
            return;
          }
        }
        setLocalQuestions(questions);
        loadedIdsRef.current = newIds;
        setRestoredFromSave(true);
      });
    } else {
      // New session (e.g. user clicked "Nouvelle session")
      setLocalQuestions(questions);
      loadedIdsRef.current = newIds;
    }
  }, [questions]);

  const currentQuestion = localQuestions[currentIndex];

  const showTranslation = currentLang !== 'fr';

  const getChoices = useCallback(
    (q: Question): Choice[] => q.choicesFr,
    [],
  );

  const getTranslatedChoices = useCallback(
    (q: Question): Choice[] | null => {
      if (showTranslation && q.translatedChoices && q.translatedChoices.length > 0 &&
          JSON.stringify(q.translatedChoices) !== JSON.stringify(q.choicesFr)) {
        return q.translatedChoices;
      }
      return null;
    },
    [showTranslation],
  );

  const getQuestionText = useCallback(
    (q: Question): string => q.textFr,
    [],
  );

  const getTranslatedText = useCallback(
    (q: Question): string | null => {
      if (showTranslation && q.translatedText && q.translatedText !== q.textFr) {
        return q.translatedText;
      }
      return null;
    },
    [showTranslation],
  );

  const getExplanation = useCallback(
    (q: Question): string | undefined => q.explanationFr,
    [],
  );

  const getTranslatedExplanation = useCallback(
    (q: Question): string | null => {
      if (showTranslation && q.translatedExplanation) {
        return q.translatedExplanation;
      }
      return null;
    },
    [showTranslation],
  );

  const handleAnswer = async (choiceId: string) => {
    if (showFeedback || isSubmitting) return;
    setSelectedChoice(choiceId);
    setAnsweredMap((prev) => ({ ...prev, [currentQuestion.id]: choiceId }));
    setIsSubmitting(true);

    // Map shuffled choice ID back to original for API
    const { originalToNew: mapping } = shuffleChoices(getChoices(currentQuestion), currentQuestion.id);
    const reverseMap = Object.fromEntries(Object.entries(mapping).map(([k, v]) => [v, k]));
    const originalChoiceId = (reverseMap[choiceId] || choiceId) as 'a' | 'b' | 'c' | 'd';
    const localShuffledCorrect = getShuffledCorrectChoice(currentQuestion.correctChoice, mapping);

    try {
      const result = await recordPractice({
        questionId: currentQuestion.id,
        selectedChoice: originalChoiceId,
      });
      setIsCorrect(result.isCorrect);
      if (result.isCorrect) {
        setCorrectCount((prev) => prev + 1);
      } else {
        const { choices: shuffledCh } = shuffleChoices(getChoices(currentQuestion), currentQuestion.id);
        const selectedText = shuffledCh.find((c) => c.id === choiceId)?.text || choiceId;
        const correctText = shuffledCh.find((c) => c.id === localShuffledCorrect)?.text || currentQuestion.correctChoice;
        setWrongAnswers((prev) => [...prev, { question: getQuestionText(currentQuestion), selected: selectedText, correct: correctText }]);
      }
    } catch (err: unknown) {
      const axiosErr = err as any;
      if (axiosErr?.response?.status === 429) {
        setQuotaExceeded({
          limit: axiosErr.response.data?.limit || 10,
          used: axiosErr.response.data?.used || 10,
          resetsAt: axiosErr.response.data?.resetsAt,
        });
        setIsSubmitting(false);
        return;
      }
      // Fallback to local check
      const correct = choiceId === localShuffledCorrect;
      setIsCorrect(correct);
      if (correct) {
        setCorrectCount((prev) => prev + 1);
      } else {
        const { choices: shuffledCh2 } = shuffleChoices(getChoices(currentQuestion), currentQuestion.id);
        const selectedText = shuffledCh2.find((c) => c.id === choiceId)?.text || choiceId;
        const correctText = shuffledCh2.find((c) => c.id === localShuffledCorrect)?.text || currentQuestion.correctChoice;
        setWrongAnswers((prev) => [...prev, { question: getQuestionText(currentQuestion), selected: selectedText, correct: correctText }]);
      }
    } finally {
      setShowFeedback(true);
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) {
      setIsFinished(true);
      clearSession();
      return;
    }
    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);
    setSelectedChoice(null);
    setShowFeedback(false);
    setIsCorrect(false);

    // Save progress for "continue training"
    saveSession({
      questions: localQuestions,
      currentIndex: nextIdx,
      answers: answeredMap,
      correctCount,
      isActive: true,
    });
  };

  const toggleLanguage = async () => {
    const codes = LANGUAGES.map((l) => l.code);
    const idx = codes.indexOf(currentLang);
    const newLang: Language = codes[(idx + 1) % codes.length];
    await setLanguage(newLang);

    // Refetch same questions with new language translations
    if (localQuestions.length > 0) {
      if (newLang === 'fr') {
        // Reset to original French-only questions (clear translated fields)
        setLocalQuestions(localQuestions.map((q) => ({
          ...q,
          translatedText: q.textFr,
          translatedChoices: q.choicesFr,
          translatedExplanation: q.explanationFr,
        })));
      } else {
        setIsChangingLang(true);
        try {
          const ids = localQuestions.map((q) => q.id);
          const updated = await getQuestionsByIds(ids, newLang);
          const byId = new Map(updated.map((q) => [q.id, q]));
          setLocalQuestions(localQuestions.map((q) => byId.get(q.id) || q));
        } catch {
          // Keep existing questions if refetch fails
        } finally {
          setIsChangingLang(false);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background, paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={c.primary} />
        <Text style={[styles.loadingText, { color: c.textSecondary }]}>Chargement des questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background, paddingTop: insets.top }]}>
        <Ionicons name="alert-circle" size={48} color={c.secondary} />
        <Text style={[styles.errorText, { color: c.textSecondary }]}>Erreur de chargement</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: c.primary }]} onPress={onRefetch}>
          <Text style={[styles.retryButtonText, { color: c.textInverse }]}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (quotaExceeded) {
    return (
      <QuotaPaywall
        type="daily"
        used={quotaExceeded.used}
        limit={quotaExceeded.limit}
        resetsAt={quotaExceeded.resetsAt}
      />
    );
  }

  if (!questions.length) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background, paddingTop: insets.top }]}>
        <Ionicons name="help-circle" size={48} color={c.textTertiary} />
        <Text style={[styles.errorText, { color: c.textSecondary }]}>Aucune question disponible</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: c.primary }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.retryButtonText, { color: c.textInverse }]}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Summary screen
  if (isFinished) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= 80;

    return (
      <ScrollView style={[styles.container, { backgroundColor: c.background }]} contentContainerStyle={[styles.summaryContent, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
        <View style={[styles.summaryCard, { backgroundColor: c.card }]}>
          <View
            style={[
              styles.summaryBadge,
              { backgroundColor: passed ? c.successBg : c.warningBg },
            ]}
          >
            <Ionicons
              name={passed ? 'checkmark-circle' : 'trending-up'}
              size={56}
              color={passed ? c.success : c.warning}
            />
          </View>

          <Text style={[styles.summaryTitle, { color: c.textPrimary }]}>
            {passed ? 'Excellent !' : 'Bon effort !'}
          </Text>

          <Text style={[styles.summaryScore, { color: c.primary }]}>
            {correctCount}/{questions.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: c.textSecondary }]}>bonnes réponses</Text>

          <View style={[styles.summaryPercentBadge, { backgroundColor: passed ? c.successBg : c.warningBg }]}>
            <Text style={[styles.summaryPercent, { color: passed ? c.success : c.warning }]}>{percentage}%</Text>
          </View>

          {wrongAnswers.length > 0 && (
            <View style={styles.wrongAnswersSection}>
              <Text style={[styles.wrongAnswersTitle, { color: c.error }]}>
                {'À'} revoir ({wrongAnswers.length})
              </Text>
              {wrongAnswers.map((wa, i) => (
                <View key={i} style={[styles.wrongAnswerCard, { backgroundColor: c.errorBg, borderLeftColor: c.error }]}>
                  <Text style={[styles.wrongQuestion, { color: c.textPrimary }]}>{wa.question}</Text>
                  <Text style={[styles.wrongSelected, { color: c.error }]}>{'\u2717'} {wa.selected}</Text>
                  <Text style={[styles.wrongCorrect, { color: c.success }]}>{'\u2713'} {wa.correct}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: c.primary }]}
            onPress={() => {
              setCurrentIndex(0);
              setSelectedChoice(null);
              setShowFeedback(false);
              setIsCorrect(false);
              setCorrectCount(0);
              setAnsweredMap({});
              setWrongAnswers([]);
              setIsFinished(false);
              clearSession();
              onRefetch();
            }}
          >
            <Ionicons name="refresh" size={20} color={c.textInverse} />
            <Text style={[styles.primaryButtonText, { color: c.textInverse }]}>Nouvelle session</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: c.surfaceElevated }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.secondaryButtonText, { color: c.textPrimary }]}>Retour</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  const rawChoices = getChoices(currentQuestion);
  const { choices, originalToNew } = shuffleChoices(rawChoices, currentQuestion.id);
  const shuffledCorrectChoice = getShuffledCorrectChoice(currentQuestion.correctChoice, originalToNew);
  const rawTranslatedChoices = getTranslatedChoices(currentQuestion);
  // Reorder translated choices to match shuffle
  const translatedChoices = rawTranslatedChoices
    ? choices.map((c) => {
        const origId = Object.entries(originalToNew).find(([_, v]) => v === c.id)?.[0];
        const translated = rawTranslatedChoices.find((tc) => tc.id === origId);
        return translated ? { id: c.id, text: translated.text } : { id: c.id, text: c.text };
      })
    : null;
  const questionText = getQuestionText(currentQuestion);
  const translatedText = getTranslatedText(currentQuestion);
  const explanation = getExplanation(currentQuestion);
  const translatedExplanation = getTranslatedExplanation(currentQuestion);
  const langLabel =
    LANGUAGES.find((l) => l.code === currentLang)?.nativeName || 'Français';

  return (
    <ScrollView style={[styles.container, { backgroundColor: c.background }]} contentContainerStyle={[styles.questionContent, { paddingTop: insets.top + themeSpacing.xl, paddingBottom: insets.bottom + 16 }]}>
      {/* Header */}
      <View style={[styles.header, isRtl && { flexDirection: 'row-reverse' }]}>
        <Text style={[styles.progress, { color: c.textPrimary }]}>
          {currentIndex + 1} / {questions.length}
        </Text>
        <TouchableOpacity
          style={[styles.langButton, { backgroundColor: c.primaryLight, borderColor: c.primary + '30' }]}
          onPress={toggleLanguage}
          disabled={isChangingLang}
        >
          <Ionicons name="language" size={18} color={c.primary} />
          <Text style={[styles.langButtonText, { color: c.primary }]}>
            {showTranslation ? `FR + ${langLabel}` : 'FR'}
          </Text>
          {isChangingLang && <ActivityIndicator size="small" color={c.primary} />}
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressBar, { backgroundColor: c.progressBg }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: c.primary,
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            },
          ]}
        />
      </View>

      {/* Question */}
      <View style={[styles.questionCard, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[styles.questionText, { color: c.textPrimary }]}>{questionText}</Text>
        {translatedText && (
          <Text style={[styles.translatedQuestionText, { color: c.textSecondary, borderTopColor: c.border }, isRtl && { writingDirection: 'rtl', textAlign: 'right' }]}>
            {translatedText}
          </Text>
        )}
      </View>

      {/* Choices */}
      <View style={styles.choices}>
        {choices.map((choice) => {
          const isSelected = selectedChoice === choice.id;
          const isCorrectChoice = choice.id === shuffledCorrectChoice;

          let choiceStyle: any = {
            backgroundColor: c.card,
            borderColor: c.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          };
          let textStyle: any = { color: c.textPrimary };
          let badgeBg = c.surfaceElevated;
          let badgeTextColor = c.textPrimary;

          if (showFeedback) {
            if (isCorrectChoice) {
              choiceStyle = { backgroundColor: c.success, borderColor: c.success };
              textStyle = { color: c.textInverse };
              badgeBg = 'rgba(255,255,255,0.3)';
              badgeTextColor = c.textInverse;
            } else if (isSelected && !isCorrectChoice) {
              choiceStyle = { backgroundColor: c.error, borderColor: c.error };
              textStyle = { color: c.textInverse };
              badgeBg = 'rgba(255,255,255,0.3)';
              badgeTextColor = c.textInverse;
            }
          } else if (isSelected) {
            choiceStyle = { backgroundColor: c.primary, borderColor: c.primary };
            textStyle = { color: c.textInverse };
            badgeBg = 'rgba(255,255,255,0.3)';
            badgeTextColor = c.textInverse;
          }

          return (
            <TouchableOpacity
              key={choice.id}
              activeOpacity={0.7}
              style={[styles.choiceButton, choiceStyle, isRtl && { flexDirection: 'row-reverse' }]}
              onPress={() => handleAnswer(choice.id)}
              disabled={showFeedback || isSubmitting}
            >
              <View
                style={[
                  styles.choiceIdBadge,
                  { backgroundColor: badgeBg },
                ]}
              >
                <Text
                  style={[
                    styles.choiceId,
                    { color: badgeTextColor },
                  ]}
                >
                  {choice.id.toUpperCase()}
                </Text>
              </View>
              <View style={styles.choiceTextContainer}>
                <Text style={[styles.choiceText, textStyle]}>{choice.text}</Text>
                {translatedChoices && (
                  <Text style={[styles.choiceTranslatedText, textStyle, { opacity: 0.8 }, isRtl && { writingDirection: 'rtl', textAlign: 'right' }]}>
                    {translatedChoices.find((tc) => tc.id === choice.id)?.text}
                  </Text>
                )}
              </View>
              {showFeedback && isCorrectChoice && (
                <Ionicons name="checkmark-circle" size={24} color={c.textInverse} />
              )}
              {showFeedback && isSelected && !isCorrectChoice && (
                <Ionicons name="close-circle" size={24} color={c.textInverse} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback */}
      {showFeedback && (
        <View
          style={[
            styles.feedbackCard,
            isCorrect
              ? { backgroundColor: c.successBg, borderWidth: 1.5, borderColor: c.success }
              : { backgroundColor: c.errorBg, borderWidth: 1.5, borderColor: c.error },
          ]}
        >
          <View style={styles.feedbackHeader}>
            <Ionicons
              name={isCorrect ? 'checkmark-circle' : 'close-circle'}
              size={28}
              color={isCorrect ? c.success : c.error}
            />
            <Text style={[styles.feedbackTitle, { color: c.textPrimary }]}>
              {isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse'}
            </Text>
          </View>
          {explanation && (
            <Text style={[styles.feedbackExplanation, { color: c.textSecondary }]}>{explanation}</Text>
          )}
          {translatedExplanation && (
            <Text style={[styles.feedbackTranslation, { color: c.textTertiary, borderTopColor: c.border }, isRtl && { writingDirection: 'rtl', textAlign: 'right' }]}>
              {translatedExplanation}
            </Text>
          )}
        </View>
      )}

      {/* Next / Validate button */}
      {showFeedback && (
        <TouchableOpacity style={[styles.nextButton, { backgroundColor: c.primary }]} onPress={handleNext}>
          <Text style={[styles.nextButtonText, { color: c.textInverse }]}>
            {currentIndex >= questions.length - 1 ? 'Voir le résumé' : 'Suivant'}
          </Text>
          <Ionicons name="arrow-forward" size={22} color={c.textInverse} />
        </TouchableOpacity>
      )}

      {!showFeedback && !selectedChoice && (
        <View style={[styles.validateHint]}>
          <Ionicons name="hand-left-outline" size={16} color={c.textTertiary} />
          <Text style={[styles.validateHintText, { color: c.textTertiary }]}>
            Sélectionnez une réponse
          </Text>
        </View>
      )}

      {isSubmitting && (
        <ActivityIndicator
          size="small"
          color={c.primary}
          style={{ marginTop: themeSpacing.lg }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: themeSpacing.xxl,
  },
  loadingText: {
    fontSize: themeFontSize.lg,
    marginTop: themeSpacing.lg,
  },
  errorText: {
    fontSize: themeFontSize.lg,
    marginTop: themeSpacing.md,
    marginBottom: themeSpacing.xl,
  },
  retryButton: {
    borderRadius: themeBorderRadius.md,
    paddingHorizontal: themeSpacing.xxxl,
    paddingVertical: 14,
  },
  retryButtonText: {
    fontSize: themeFontSize.lg,
    fontWeight: '600',
  },
  questionContent: {
    padding: themeSpacing.xl,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: themeSpacing.lg,
  },
  progress: {
    fontSize: themeFontSize.xl,
    fontWeight: '700',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: themeBorderRadius.round,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  langButtonText: {
    fontSize: themeFontSize.sm,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: themeSpacing.xxl,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  questionCard: {
    borderRadius: themeBorderRadius.xl,
    padding: 24,
    marginBottom: themeSpacing.xxl,
    minHeight: 110,
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  questionText: {
    fontSize: 19,
    lineHeight: 30,
    fontWeight: '500',
  },
  translatedQuestionText: {
    fontSize: themeFontSize.md,
    lineHeight: 24,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    fontStyle: 'italic',
  },
  choices: {
    gap: themeSpacing.md,
    marginBottom: themeSpacing.xxl,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: themeBorderRadius.lg,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 2,
    minHeight: 60,
  },
  choiceIdBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: themeSpacing.lg,
  },
  choiceId: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  choiceTextContainer: {
    flex: 1,
    flexShrink: 1,
  },
  choiceText: {
    fontSize: themeFontSize.lg,
    lineHeight: 24,
    flexWrap: 'wrap',
  },
  choiceTranslatedText: {
    fontSize: themeFontSize.sm,
    marginTop: themeSpacing.xs,
    fontStyle: 'italic',
  },
  feedbackCard: {
    borderRadius: themeBorderRadius.lg,
    padding: themeSpacing.xl,
    marginBottom: themeSpacing.xl,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  feedbackTitle: {
    fontSize: themeFontSize.xl,
    fontWeight: '700',
  },
  feedbackExplanation: {
    fontSize: themeFontSize.md,
    lineHeight: 22,
    paddingLeft: 38,
  },
  feedbackTranslation: {
    fontSize: themeFontSize.sm,
    lineHeight: 20,
    marginTop: themeSpacing.md,
    paddingTop: themeSpacing.md,
    paddingLeft: 38,
    borderTopWidth: 1,
    fontStyle: 'italic',
  },
  nextButton: {
    borderRadius: themeBorderRadius.lg,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: themeSpacing.sm,
    width: '100%',
    shadowColor: '#002395',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: themeFontSize.xl,
    fontWeight: '700',
  },
  validateHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: themeSpacing.md,
  },
  validateHintText: {
    fontSize: themeFontSize.sm,
    fontWeight: '500',
  },
  summaryContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: themeSpacing.xl,
  },
  summaryCard: {
    borderRadius: themeBorderRadius.xl,
    padding: themeSpacing.xxxl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  summaryBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: themeSpacing.xl,
  },
  summaryTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: themeSpacing.lg,
  },
  summaryScore: {
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -1,
  },
  summaryLabel: {
    fontSize: themeFontSize.md,
    marginTop: themeSpacing.xs,
    fontWeight: '500',
  },
  summaryPercentBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: themeBorderRadius.round,
    marginTop: themeSpacing.md,
    marginBottom: themeSpacing.xxxl,
  },
  summaryPercent: {
    fontSize: themeFontSize.xxl,
    fontWeight: '800',
  },
  primaryButton: {
    borderRadius: themeBorderRadius.lg,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    marginBottom: themeSpacing.md,
    shadowColor: '#002395',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: themeFontSize.lg,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: themeBorderRadius.lg,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    fontSize: themeFontSize.lg,
    fontWeight: '500',
  },
  wrongAnswersSection: {
    width: '100%',
    marginBottom: themeSpacing.xxl,
  },
  wrongAnswersTitle: {
    fontSize: themeFontSize.lg,
    fontWeight: '700',
    marginBottom: themeSpacing.md,
  },
  wrongAnswerCard: {
    borderRadius: themeBorderRadius.md,
    padding: themeSpacing.lg,
    marginBottom: themeSpacing.sm,
    borderLeftWidth: 4,
  },
  wrongQuestion: {
    fontSize: themeFontSize.md,
    fontWeight: '600',
    marginBottom: 8,
  },
  wrongSelected: {
    fontSize: themeFontSize.sm,
    marginBottom: 3,
  },
  wrongCorrect: {
    fontSize: themeFontSize.sm,
  },
});
