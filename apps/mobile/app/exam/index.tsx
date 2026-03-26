import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as examsService from '../../services/exams';
import { useExamStore } from '../../stores/examStore';

export default function ExamStartScreen() {
  const router = useRouter();
  const { setSession, reset } = useExamStore();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startExam = async () => {
    setError(null);
    setIsStarting(true);
    reset();

    try {
      const { session } = await examsService.startExam();
      setSession(session);
      router.push(`/exam/session?sessionId=${session.id}`);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Impossible de d\u00e9marrer l\u2019examen. Veuillez r\u00e9essayer.';

      // Check for free user limit
      if (err.response?.status === 403 || err.response?.status === 429) {
        setError(
          'Vous avez atteint la limite d\u2019examens gratuits. Passez \u00e0 Premium pour des examens illimit\u00e9s.',
        );
      } else {
        setError(message);
      }
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons
          name="school"
          size={48}
          color="#002395"
          style={{ marginBottom: 12 }}
        />
        <Text style={styles.title}>Examen blanc</Text>
        <Text style={styles.description}>
          Simulez les conditions r{'\u00e9'}elles de l'examen de citoyennet
          {'\u00e9'} fran{'\u00e7'}aise.
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>40</Text>
            <Text style={styles.infoLabel}>Questions</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>45</Text>
            <Text style={styles.infoLabel}>Minutes</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>80%</Text>
            <Text style={styles.infoLabel}>Pour r{'\u00e9'}ussir</Text>
          </View>
        </View>

        <View style={styles.passInfo}>
          <Ionicons name="information-circle" size={18} color="#666" />
          <Text style={styles.passInfoText}>
            Seuil de r{'\u00e9'}ussite : 32/40 bonnes r{'\u00e9'}ponses
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.startButton, isStarting && styles.startButtonDisabled]}
          onPress={startExam}
          disabled={isStarting}
        >
          {isStarting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.startButtonText}>Commencer l'examen</Text>
          )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002395',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002395',
  },
  infoLabel: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  passInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    width: '100%',
  },
  passInfoText: {
    fontSize: 13,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#002395',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    width: '100%',
    height: 58,
    justifyContent: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#99A8CC',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
