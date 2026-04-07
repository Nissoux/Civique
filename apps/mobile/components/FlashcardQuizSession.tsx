import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from './ui/MotiView';
import * as Haptics from 'expo-haptics';
import type { Question } from '@civique/shared';
import { useColors, spacing, fontSize, borderRadius } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shuffleChoices, getShuffledCorrectChoice } from '../utils/shuffleChoices';
import { useLanguageStore } from '../stores/languageStore';
import { AnimatedPressable, AnimatedCard, AnimatedCounter, ProgressRing } from './ui';

interface Props {
  questions: Question[];
  onClose: () => void;
}

const CHOICE_LETTERS = ['A', 'B', 'C', 'D'];

export default function FlashcardQuizSession({ questions, onClose }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { currentLang } = useLanguageStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];
  const isSituational = question?.type === 'situational';

  // French is ALWAYS the primary text
  const questionText = question?.textFr;
  const translatedQuestion = (currentLang !== 'fr' && question?.translatedText) ? question.translatedText : null;

  // Shuffle choices so correct answer isn't always "a"
  const rawChoices = question?.choicesFr || [];
  const { choices: shuffledChoices, originalToNew } = question
    ? shuffleChoices(rawChoices, question.id)
    : { choices: rawChoices, originalToNew: {} as Record<string, string> };
  const choices = shuffledChoices;
  const shuffledCorrectChoice = question ? getShuffledCorrectChoice(question.correctChoice, originalToNew) : 'a';

  const translatedChoices = (currentLang !== 'fr' && question?.translatedChoices) ? question.translatedChoices : null;

  const explanation = question?.explanationFr;
  const translatedExplanation = (currentLang !== 'fr' && question?.translatedExplanation) ? question.translatedExplanation : null;

  const handleSelectChoice = useCallback((choiceId: string) => {
    if (hasAnswered) return;
    setSelectedChoice(choiceId);
  }, [hasAnswered]);

  const handleValidate = useCallback(() => {
    if (!selectedChoice || hasAnswered) return;

    setHasAnswered(true);
    const isCorrect = selectedChoice === shuffledCorrectChoice;

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCorrectCount(prev => prev + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setWrongCount(prev => prev + 1);
    }
  }, [selectedChoice, hasAnswered, question]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedChoice(null);
      setHasAnswered(false);
    }
  }, [currentIndex, questions.length]);

  const getChoiceStyle = (choiceId: string) => {
    if (!hasAnswered) {
      return choiceId === selectedChoice
        ? { bg: c.primary + '15', border: c.primary }
        : { bg: c.surface, border: c.border };
    }
    if (choiceId === shuffledCorrectChoice) {
      return { bg: c.successBg, border: c.success };
    }
    if (choiceId === selectedChoice && choiceId !== shuffledCorrectChoice) {
      return { bg: c.errorBg, border: c.error };
    }
    return { bg: c.surface, border: c.border };
  };

  const progressPercent = ((currentIndex + (hasAnswered ? 1 : 0)) / questions.length) * 100;

  // ── Summary ──
  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 80;

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: c.background }}
        contentContainerStyle={[styles.summaryContent, { paddingBottom: insets.bottom + 40 }]}
      >
        <AnimatedCard delay={0}>
          <View style={styles.summaryCenter}>
            <ProgressRing
              progress={score}
              size={120}
              strokeWidth={8}
              color={passed ? c.success : c.warning}
              bgColor={c.progressBg}
              duration={1200}
              valueFontSize={28}
              valueColor={c.textPrimary}
            />
          </View>
        </AnimatedCard>

        <AnimatedCard delay={200}>
          <Text style={[styles.summaryTitle, { color: c.textPrimary }]}>
            {passed ? 'Excellent !' : 'Continuez vos efforts !'}
          </Text>
          <Text style={[styles.summarySubtitle, { color: c.textSecondary }]}>
            {correctCount}/{questions.length} réponses correctes
          </Text>
        </AnimatedCard>

        <AnimatedCard delay={400}>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryBox, { backgroundColor: c.successBg }]}>
              <Ionicons name="checkmark-circle" size={28} color={c.success} />
              <AnimatedCounter value={correctCount} style={[styles.summaryBoxValue, { color: c.success }]} />
              <Text style={[styles.summaryBoxLabel, { color: c.success }]}>Correctes</Text>
            </View>
            <View style={[styles.summaryBox, { backgroundColor: c.errorBg }]}>
              <Ionicons name="close-circle" size={28} color={c.error} />
              <AnimatedCounter value={wrongCount} style={[styles.summaryBoxValue, { color: c.error }]} />
              <Text style={[styles.summaryBoxLabel, { color: c.error }]}>Incorrectes</Text>
            </View>
          </View>
        </AnimatedCard>

        <AnimatedCard delay={600}>
          <AnimatedPressable onPress={onClose} scaleDown={0.97}>
            <LinearGradient
              colors={c.gradientPrimary}
              style={styles.summaryButton}
            >
              <Text style={styles.summaryButtonText}>Terminer</Text>
            </LinearGradient>
          </AnimatedPressable>
        </AnimatedCard>
      </ScrollView>
    );
  }

  // ── Question screen ──
  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      {/* Progress bar */}
      <View style={styles.progressArea}>
        <Text style={[styles.progressText, { color: c.textSecondary }]}>
          {currentIndex + 1}/{questions.length}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: c.progressBg }]}>
          <MotiView
            animate={{ width: `${progressPercent}%` as any }}
            transition={{ type: 'timing', duration: 300 }}
            style={[styles.progressFill, { backgroundColor: c.primary }]}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.questionContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Question type badge */}
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={currentIndex}
            from={{ opacity: 0, translateX: 30 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: -30 }}
            transition={{ type: 'timing', duration: 250 }}
          >
            {isSituational && (
              <View style={[styles.typeBadge, { backgroundColor: c.warning + '20' }]}>
                <Ionicons name="people" size={14} color={c.warning} />
                <Text style={[styles.typeBadgeText, { color: c.warning }]}>Mise en situation</Text>
              </View>
            )}

            {/* Question text — French always primary */}
            <View style={[styles.questionCard, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Text style={[styles.questionText, { color: c.textPrimary }]}>
                {questionText}
              </Text>
              {translatedQuestion && (
                <Text style={[styles.questionOriginal, { color: c.textTertiary }]}>
                  {translatedQuestion}
                </Text>
              )}
            </View>

            {/* Choices */}
            <View style={styles.choicesContainer}>
              {choices?.map((choice, i) => {
                const choiceStyle = getChoiceStyle(choice.id);
                const isCorrectAnswer = hasAnswered && choice.id === shuffledCorrectChoice;
                const isWrongSelected = hasAnswered && choice.id === selectedChoice && choice.id !== shuffledCorrectChoice;

                return (
                  <AnimatedPressable
                    key={choice.id}
                    onPress={() => handleSelectChoice(choice.id)}
                    disabled={hasAnswered}
                    haptic={!hasAnswered}
                    scaleDown={0.98}
                  >
                    <View style={[
                      styles.choiceItem,
                      {
                        backgroundColor: choiceStyle.bg,
                        borderColor: choiceStyle.border,
                      },
                    ]}>
                      <View style={[
                        styles.choiceLetter,
                        {
                          backgroundColor: isCorrectAnswer ? c.success : isWrongSelected ? c.error : selectedChoice === choice.id ? c.primary : c.progressBg,
                        },
                      ]}>
                        <Text style={[
                          styles.choiceLetterText,
                          { color: selectedChoice === choice.id || hasAnswered ? '#FFF' : c.textSecondary },
                        ]}>
                          {CHOICE_LETTERS[i]}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.choiceText, { color: c.textPrimary }]}>
                          {choice.text}
                        </Text>
                        {translatedChoices && (
                          <Text style={[styles.choiceTranslated, { color: c.textTertiary }]}>
                            {translatedChoices.find(tc => tc.id === choice.id)?.text}
                          </Text>
                        )}
                      </View>
                      {isCorrectAnswer && (
                        <Ionicons name="checkmark-circle" size={20} color={c.success} />
                      )}
                      {isWrongSelected && (
                        <Ionicons name="close-circle" size={20} color={c.error} />
                      )}
                    </View>
                  </AnimatedPressable>
                );
              })}
            </View>

            {/* Explanation */}
            {hasAnswered && explanation && (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 200 }}
              >
                <View style={[styles.explanationCard, { backgroundColor: c.primary + '10', borderColor: c.primary + '30' }]}>
                  <Ionicons name="bulb" size={18} color={c.primary} style={{ marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.explanationText, { color: c.textPrimary }]}>
                      {explanation}
                    </Text>
                    {translatedExplanation && (
                      <Text style={[styles.choiceTranslated, { color: c.textTertiary, marginTop: 8 }]}>
                        {translatedExplanation}
                      </Text>
                    )}
                  </View>
                </View>
              </MotiView>
            )}
          </MotiView>
        </AnimatePresence>
      </ScrollView>

      {/* Bottom action button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        {!hasAnswered ? (
          <AnimatedPressable
            onPress={handleValidate}
            disabled={!selectedChoice}
            scaleDown={0.97}
          >
            <LinearGradient
              colors={selectedChoice ? c.gradientPrimary : [c.progressBg, c.progressBg]}
              style={[styles.actionButton, !selectedChoice && { opacity: 0.5 }]}
            >
              <Text style={styles.actionButtonText}>Valider</Text>
            </LinearGradient>
          </AnimatedPressable>
        ) : (
          <AnimatedPressable onPress={handleNext} scaleDown={0.97}>
            <LinearGradient
              colors={c.gradientPrimary}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>
                {currentIndex + 1 >= questions.length ? 'Voir les résultats' : 'Question suivante'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </LinearGradient>
          </AnimatedPressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressArea: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  progressText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  questionContent: {
    padding: spacing.xl,
    paddingBottom: 100,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.round,
    marginBottom: spacing.md,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 26,
  },
  questionOriginal: {
    fontSize: fontSize.sm,
    fontStyle: 'italic',
    marginTop: spacing.md,
    lineHeight: 20,
  },
  choicesContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  choiceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1.5,
    gap: spacing.md,
  },
  choiceLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceLetterText: {
    fontSize: 14,
    fontWeight: '700',
  },
  choiceText: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  choiceTranslated: {
    fontSize: fontSize.sm,
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 18,
  },
  explanationCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  explanationText: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  bottomBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  actionButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.lg,
    fontWeight: '700',
  },

  // Summary
  summaryContent: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  summaryCenter: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.xxl,
  },
  summaryTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  summarySubtitle: {
    fontSize: fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xxxl,
    width: '100%',
  },
  summaryBox: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryBoxValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  summaryBoxLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  summaryButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: 16,
    paddingHorizontal: spacing.xxxl,
    alignItems: 'center',
    width: '100%',
  },
  summaryButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});
