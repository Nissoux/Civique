import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ExamResultsScreen() {
  const router = useRouter();

  // These values will come from the API / state management
  const score = 0;
  const totalQuestions = 20;
  const passed = score >= 15;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={[styles.resultBadge, passed ? styles.passedBadge : styles.failedBadge]}>
          <Text style={styles.resultEmoji}>{passed ? '\u2705' : '\u274C'}</Text>
        </View>

        <Text style={styles.resultTitle}>
          {passed ? 'F\u00e9licitations !' : 'Continuez vos efforts'}
        </Text>

        <Text style={styles.resultSubtitle}>
          {passed
            ? 'Vous avez r\u00e9ussi l\'examen blanc'
            : 'Vous n\'avez pas atteint le seuil de r\u00e9ussite'}
        </Text>

        <View style={styles.scoreSection}>
          <Text style={styles.scoreValue}>
            {score}/{totalQuestions}
          </Text>
          <Text style={styles.scoreLabel}>bonnes r\u00e9ponses</Text>
          <Text style={styles.scorePercent}>
            {Math.round((score / totalQuestions) * 100)}%
          </Text>
        </View>

        <View style={styles.thresholdInfo}>
          <Text style={styles.thresholdText}>Seuil de r\u00e9ussite : 75% (15/20)</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.primaryButtonText}>Retour \u00e0 l'accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace('/exam')}
        >
          <Text style={styles.secondaryButtonText}>Recommencer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    padding: 20,
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
  resultEmoji: {
    fontSize: 40,
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
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  thresholdText: {
    fontSize: 13,
    color: '#666',
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
