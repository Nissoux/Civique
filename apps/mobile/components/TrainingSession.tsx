import { useState, useCallback } from 'react';
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
import { useLanguageStore } from '../stores/languageStore';

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
  const { currentLang, setLanguage } = useLanguageStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];

  const getChoices = useCallback(
    (q: Question): Choice[] => {
      if (currentLang !== 'fr' && q.translatedChoices && q.translatedChoices.length > 0) {
        return q.translatedChoices;
      }
      return q.choicesFr;
    },
    [currentLang],
  );

  const getQuestionText = useCallback(
    (q: Question): string => {
      if (currentLang !== 'fr' && q.translatedText) {
        return q.translatedText;
      }
      return q.textFr;
    },
    [currentLang],
  );

  const getExplanation = useCallback(
    (q: Question): string | undefined => {
      if (currentLang !== 'fr' && q.translatedExplanation) {
        return q.translatedExplanation;
      }
      return q.explanationFr;
    },
    [currentLang],
  );

  const handleAnswer = async (choiceId: string) => {
    if (showFeedback || isSubmitting) return;
    setSelectedChoice(choiceId);
    setIsSubmitting(true);

    try {
      const result = await recordPractice({
        questionId: currentQuestion.id,
        selectedChoice: choiceId as 'a' | 'b' | 'c' | 'd',
      });
      setIsCorrect(result.isCorrect);
      if (result.isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }
    } catch {
      // Fallback to local check
      const correct = choiceId === currentQuestion.correctChoice;
      setIsCorrect(correct);
      if (correct) {
        setCorrectCount((prev) => prev + 1);
      }
    } finally {
      setShowFeedback(true);
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) {
      setIsFinished(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedChoice(null);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const toggleLanguage = async () => {
    const newLang: Language = currentLang === 'fr' ? 'ar' : 'fr';
    await setLanguage(newLang);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#002395" />
        <Text style={styles.loadingText}>Chargement des questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color="#ED2939" />
        <Text style={styles.errorText}>Erreur de chargement</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefetch}>
          <Text style={styles.retryButtonText}>R{'\u00e9'}essayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!questions.length) {
    return (
      <View style={styles.centered}>
        <Ionicons name="help-circle" size={48} color="#999" />
        <Text style={styles.errorText}>Aucune question disponible</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Summary screen
  if (isFinished) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= 80;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.summaryContent}>
        <View style={styles.summaryCard}>
          <View
            style={[
              styles.summaryBadge,
              { backgroundColor: passed ? '#E8F5E9' : '#FFF3E0' },
            ]}
          >
            <Ionicons
              name={passed ? 'checkmark-circle' : 'trending-up'}
              size={48}
              color={passed ? '#2E7D32' : '#E65100'}
            />
          </View>

          <Text style={styles.summaryTitle}>
            {passed ? 'Excellent !' : 'Bon effort !'}
          </Text>

          <Text style={styles.summaryScore}>
            {correctCount}/{questions.length}
          </Text>
          <Text style={styles.summaryLabel}>bonnes r{'\u00e9'}ponses</Text>
          <Text style={styles.summaryPercent}>{percentage}%</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setCurrentIndex(0);
              setSelectedChoice(null);
              setShowFeedback(false);
              setIsCorrect(false);
              setCorrectCount(0);
              setIsFinished(false);
              onRefetch();
            }}
          >
            <Text style={styles.primaryButtonText}>Nouvelle session</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const choices = getChoices(currentQuestion);
  const questionText = getQuestionText(currentQuestion);
  const explanation = getExplanation(currentQuestion);
  const langLabel =
    LANGUAGES.find((l) => l.code === currentLang)?.nativeName || 'Fran\u00e7ais';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.questionContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.progress}>
          {currentIndex + 1} / {questions.length}
        </Text>
        <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
          <Ionicons name="language" size={18} color="#002395" />
          <Text style={styles.langButtonText}>{langLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            },
          ]}
        />
      </View>

      {/* Question */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{questionText}</Text>
      </View>

      {/* Choices */}
      <View style={styles.choices}>
        {choices.map((choice) => {
          const isSelected = selectedChoice === choice.id;
          const isCorrectChoice = choice.id === currentQuestion.correctChoice;

          let choiceStyle = styles.choiceDefault;
          let textStyle = styles.choiceTextDefault;

          if (showFeedback) {
            if (isCorrectChoice) {
              choiceStyle = styles.choiceCorrect;
              textStyle = styles.choiceTextWhite;
            } else if (isSelected && !isCorrectChoice) {
              choiceStyle = styles.choiceWrong;
              textStyle = styles.choiceTextWhite;
            }
          } else if (isSelected) {
            choiceStyle = styles.choiceSelected;
            textStyle = styles.choiceTextWhite;
          }

          return (
            <TouchableOpacity
              key={choice.id}
              style={[styles.choiceButton, choiceStyle]}
              onPress={() => handleAnswer(choice.id)}
              disabled={showFeedback || isSubmitting}
            >
              <View
                style={[
                  styles.choiceIdBadge,
                  showFeedback && isCorrectChoice && styles.choiceIdCorrect,
                  showFeedback && isSelected && !isCorrectChoice && styles.choiceIdWrong,
                  !showFeedback && isSelected && styles.choiceIdSelected,
                ]}
              >
                <Text
                  style={[
                    styles.choiceId,
                    (isSelected || (showFeedback && isCorrectChoice)) &&
                      styles.choiceIdTextWhite,
                  ]}
                >
                  {choice.id.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.choiceText, textStyle]}>{choice.text}</Text>
              {showFeedback && isCorrectChoice && (
                <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
              )}
              {showFeedback && isSelected && !isCorrectChoice && (
                <Ionicons name="close-circle" size={22} color="#FFFFFF" />
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
            isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
          ]}
        >
          <Text style={styles.feedbackTitle}>
            {isCorrect ? 'Bonne r\u00e9ponse !' : 'Mauvaise r\u00e9ponse'}
          </Text>
          {explanation && (
            <Text style={styles.feedbackExplanation}>{explanation}</Text>
          )}
        </View>
      )}

      {/* Next button */}
      {showFeedback && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex >= questions.length - 1 ? 'Voir le r\u00e9sum\u00e9' : 'Suivant'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {isSubmitting && (
        <ActivityIndicator
          size="small"
          color="#002395"
          style={{ marginTop: 16 }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  questionContent: {
    padding: 20,
    paddingBottom: 40,
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
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  langButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#002395',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#002395',
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    minHeight: 100,
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
    marginBottom: 20,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
  },
  choiceDefault: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EEE',
  },
  choiceSelected: {
    backgroundColor: '#002395',
    borderColor: '#002395',
  },
  choiceCorrect: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  choiceWrong: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
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
  choiceIdCorrect: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  choiceIdWrong: {
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
  },
  choiceTextDefault: {
    color: '#333',
  },
  choiceTextWhite: {
    color: '#FFFFFF',
  },
  feedbackCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  feedbackCorrect: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  feedbackWrong: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  feedbackExplanation: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#002395',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  summaryContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#002395',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  summaryPercent: {
    fontSize: 20,
    fontWeight: '600',
    color: '#002395',
    marginTop: 8,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#002395',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});
