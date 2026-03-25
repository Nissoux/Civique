import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { THEMES } from '@civique/shared';
import { useAuthStore } from '../../stores/authStore';
import { getStatsOverview } from '../../services/stats';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: getStatsOverview,
    staleTime: 60 * 1000,
  });

  const displayName = user?.displayName || 'Citoyen';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Bonjour, {displayName} !</Text>
      <Text style={styles.subtitle}>
        Pr{'\u00ea'}t pour r{'\u00e9'}viser aujourd'hui ?
      </Text>

      {/* Quick Stats */}
      {stats && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalPracticed || 0}</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {stats.overallAccuracy ? `${Math.round(stats.overallAccuracy)}%` : '0%'}
            </Text>
            <Text style={styles.statLabel}>Pr{'\u00e9'}cision</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>S{'\u00e9'}rie</Text>
          </View>
        </View>
      )}

      {/* Exam Card */}
      <TouchableOpacity
        style={styles.examCard}
        onPress={() => router.push('/exam')}
      >
        <View style={styles.examCardHeader}>
          <Ionicons name="school" size={28} color="#FFFFFF" />
          <Text style={styles.examCardTitle}>Examen blanc</Text>
        </View>
        <Text style={styles.examCardDesc}>
          40 questions - 45 minutes - 80% pour r{'\u00e9'}ussir
        </Text>
      </TouchableOpacity>

      {/* Continue Training */}
      {stats?.lastPracticeAt && (
        <TouchableOpacity
          style={styles.continueCard}
          onPress={() => router.push('/train/random')}
        >
          <Ionicons name="play-circle" size={24} color="#002395" />
          <View style={styles.continueContent}>
            <Text style={styles.continueTitle}>
              Continuer l'entra{'\u00ee'}nement
            </Text>
            <Text style={styles.continueSubtitle}>
              10 questions al{'\u00e9'}atoires
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      )}

      {/* Themes */}
      <Text style={styles.sectionTitle}>Th{'\u00e8'}mes</Text>
      {THEMES.map((theme) => (
        <TouchableOpacity
          key={theme.id}
          style={[styles.themeCard, { borderLeftColor: theme.color }]}
          onPress={() => router.push(`/train/${theme.id}`)}
        >
          <Text style={styles.themeName}>{theme.nameFr}</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
      ))}
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
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002395',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#002395',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  examCard: {
    backgroundColor: '#002395',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  examCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  examCardTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  examCardDesc: {
    color: '#FFFFFFCC',
    fontSize: 14,
    marginTop: 4,
  },
  continueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  continueContent: {
    flex: 1,
    marginLeft: 14,
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  continueSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  themeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
