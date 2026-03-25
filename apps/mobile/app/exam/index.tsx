import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ExamStartScreen() {
  const router = useRouter();

  const startExam = () => {
    router.push('/exam/session');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Examen blanc</Text>
        <Text style={styles.description}>
          Simulez les conditions r\u00e9elles de l'examen de citoyennet\u00e9 fran\u00e7aise.
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>20</Text>
            <Text style={styles.infoLabel}>Questions</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>45</Text>
            <Text style={styles.infoLabel}>Minutes</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>75%</Text>
            <Text style={styles.infoLabel}>Pour r\u00e9ussir</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startExam}>
          <Text style={styles.startButtonText}>Commencer l'examen</Text>
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
    marginBottom: 32,
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
  startButton: {
    backgroundColor: '#002395',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
