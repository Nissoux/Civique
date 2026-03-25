import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as examsService from '../../services/exams';
import type { ExamResultsResponse } from '../../services/exams';
import { useExamStore } from '../../stores/examStore';

export default function ExamResultsScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { currentSession, reset } = useExamStore();

  const effectiveSessionId = sessionId || currentSession?.id;

  const [results, setResults] = useState<ExamResultsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadResults() {
      if (!effectiveSessionId) {
        setError('Aucune session trouv\u00e9e');
        setIsLoading(false);
        return;
      }

      try {
        const data = await examsService.getExamResults(effectiveSessionId);
        setResults(data);
      } catch {
        setError('Impossible de charger les r\u00e9sultats');
      } finally {
        setIsLoading(false);
      }
    }
    loadResults();
  }, [effectiveSessionId]);

  const handleGoHome = () => {
    reset();
    router.replace('/(tabs)');
  };

  const handleRetry = () => {
    reset();
    router.replace('/exam');
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#002395" />
        <Text style={styles.loadingText}>Chargement des r{'\u00e9'}sultats...</Text>
      </View>
    );
  }

  if (error || !results) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color="#ED2939" />
        <Text style={styles.errorText}>{error || 'Erreur inconnue'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleGoHome}>
          <Text style={styles.retryButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { session, themeBreakdown, wrongAnswers } = results;
  const score = session.score || 0;
  const total = session.totalQuestions || 40;
  const passed = session.passed ?? score >= 32;
  const percentage = Math.round((score / total) * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Result header */}
      <View style={styles.card}>
        <View
          style={[
            styles.resultBadge,
            passed ? styles.passedBadge : styles.failedBadge,
          ]}
        >
          <Ionicons
            name={passed ? 'checkmark-circle' : 'close-circle'}
            size={48}
            color={passed ? '#2E7D32' : '#C62828'}
          />
        </View>

        <Text style={styles.resultTitle}>
          {passed ? 'F\u00e9licitations !' : 'Continuez vos efforts'}
        </Text>

        <Text style={styles.resultSubtitle}>
          {passed
            ? "Vous avez r\u00e9ussi l'examen blanc"
            : "Vous n'avez pas atteint le seuil de r\u00e9ussite"}
        </Text>

        <View style={styles.scoreSection}>
          <Text style={styles.scoreValue}>
            {score}/{total}
          </Text>
          <Text style={styles.scoreLabel}>bonnes r{'\u00e9'}ponses</Text>
          <Text style={styles.scorePercent}>{percentage}%</Text>
        </View>

        <View style={styles.thresholdInfo}>
          <Ionicons name="information-circle" size={16} color="#666" />
          <Text style={styles.thresholdText}>
            Seuil de r{'\u00e9'}ussite : 80% (32/40)
          </Text>
        </View>
      </View>

      {/* Theme breakdown */}
      {themeBreakdown && themeBreakdown.length > 0 && (
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>R{'\u00e9'}sultats par th{'\u00e8'}me</Text>
          {themeBreakdown.map((theme) => {
            const themePercent =
              theme.total > 0
                ? Math.round((theme.correct / theme.total) * 100)
                : 0;
            const isGood = themePercent >= 80;

            return (
              <View key={theme.themeId} style={styles.themeRow}>
                <View style={styles.themeInfo}>
                  <Text style={styles.themeName} numberOfLines={1}>
                    {theme.themeName}
                  </Text>
                  <Text style={styles.themeScore}>
                    {theme.correct}/{theme.total}
                  </Text>
                </View>
                <View style={styles.themeBarBg}>
                  <View
                    style={[
                      styles.themeBarFill,
                      {
                        width: `${themePercent}%`,
                        backgroundColor: isGood ? '#2E7D32' : '#E65100',
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Wrong answers */}
      {wrongAnswers && wrongAnswers.length > 0 && (
        <View style={styles.wrongSection}>
          <Text style={styles.sectionTitle}>
            R{'\u00e9'}ponses incorrectes ({wrongAnswers.length})
          </Text>
          {wrongAnswers.map((wa, idx) => (
            <View key={idx} style={styles.wrongCard}>
              <Text style={styles.wrongQuestion}>{wa.questionText}</Text>
              <View style={styles.wrongRow}>
                <Ionicons name="close-circle" size={16} color="#C62828" />
                <Text style={styles.wrongAnswer}>
                  Votre r{'\u00e9'}ponse : {wa.selectedChoice.toUpperCase()}
                </Text>
              </View>
              <View style={styles.wrongRow}>
                <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                <Text style={styles.correctAnswer}>
                  Bonne r{'\u00e9'}ponse : {wa.correctChoice.toUpperCase()} -{' '}
                  {wa.correctChoiceText}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
          <Text style={styles.primaryButtonText}>Retour {'\u00e0'} l'accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleRetry}>
          <Text style={styles.secondaryButtonText}>Recommencer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  resultBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  passedBadge: {
    backgroundColor: '#E8F5E9',
  },
  failedBadge: {
    backgroundColor: '#FFEBEE',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#002395',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scorePercent: {
    fontSize: 20,
    fontWeight: '600',
    color: '#002395',
    marginTop: 8,
  },
  thresholdInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    justifyContent: 'center',
  },
  thresholdText: {
    fontSize: 13,
    color: '#666',
  },
  breakdownSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  themeRow: {
    marginBottom: 14,
  },
  themeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  themeName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  themeScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  themeBarBg: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  themeBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  wrongSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  wrongCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#C62828',
  },
  wrongQuestion: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  wrongRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  wrongAnswer: {
    fontSize: 13,
    color: '#C62828',
    flex: 1,
  },
  correctAnswer: {
    fontSize: 13,
    color: '#2E7D32',
    flex: 1,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#002395',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
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
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});
