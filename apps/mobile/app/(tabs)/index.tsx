import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { THEMES } from '@civique/shared';
import { useAuthStore } from '../../stores/authStore';
import { getStatsOverview } from '../../services/stats';
import { getExamHistory } from '../../services/exams';
import { Ionicons } from '@expo/vector-icons';

const THEME_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  flag: 'flag',
  landmark: 'business',
  scale: 'scale',
  'book-open': 'book',
  home: 'home',
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: getStatsOverview,
    staleTime: 60 * 1000,
  });

  const { data: examHistory } = useQuery({
    queryKey: ['exams', 'history', 'recent'],
    queryFn: () => getExamHistory(3, 0),
    staleTime: 60 * 1000,
  });

  const displayName = user?.displayName || 'Citoyen';
  const recentExams = examHistory?.data || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Greeting */}
      <Text style={styles.greeting}>Bonjour, {displayName} !</Text>
      <Text style={styles.subtitle}>
        Pr{'\u00ea'}t pour r{'\u00e9'}viser aujourd'hui ?
      </Text>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIconCircle, { backgroundColor: '#EEF1FB' }]}>
            <Ionicons name="help-circle" size={20} color="#002395" />
          </View>
          <Text style={styles.statValue}>{stats?.totalPracticed || 0}</Text>
          <Text style={styles.statLabel}>Questions</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconCircle, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
          </View>
          <Text style={styles.statValue}>
            {stats?.overallAccuracy ? `${Math.round(stats.overallAccuracy)}%` : '0%'}
          </Text>
          <Text style={styles.statLabel}>Pr{'\u00e9'}cision</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconCircle, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="trophy" size={20} color="#E65100" />
          </View>
          <Text style={styles.statValue}>{stats?.examsPassed || 0}</Text>
          <Text style={styles.statLabel}>R{'\u00e9'}ussis</Text>
        </View>
      </View>

      {/* Exam Card */}
      <TouchableOpacity
        style={styles.examCard}
        onPress={() => router.push('/exam')}
        activeOpacity={0.85}
      >
        <View style={styles.examCardHeader}>
          <View style={styles.examIconCircle}>
            <Ionicons name="school" size={26} color="#002395" />
          </View>
          <View style={styles.examCardContent}>
            <Text style={styles.examCardTitle}>Commencer un examen</Text>
            <Text style={styles.examCardDesc}>
              40 questions {'\u00b7'} 45 min {'\u00b7'} 80% pour r{'\u00e9'}ussir
            </Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={28} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* Continue Training */}
      <TouchableOpacity
        style={styles.continueCard}
        onPress={() => router.push('/train/random')}
        activeOpacity={0.7}
      >
        <Ionicons name="play-circle" size={28} color="#002395" />
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

      {/* Themes Grid */}
      <Text style={styles.sectionTitle}>Th{'\u00e8'}mes</Text>
      <View style={styles.themeGrid}>
        {THEMES.map((theme) => (
          <TouchableOpacity
            key={theme.id}
            style={styles.themeCard}
            onPress={() => router.push(`/train/${theme.id}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.themeIconCircle, { backgroundColor: theme.color + '20' }]}>
              <Ionicons
                name={THEME_ICONS[theme.icon] || 'help-circle'}
                size={24}
                color={theme.color}
              />
            </View>
            <Text style={styles.themeName} numberOfLines={2}>
              {theme.nameFr}
            </Text>
            <View style={[styles.themeColorBar, { backgroundColor: theme.color }]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Exam History */}
      {recentExams.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Derniers examens</Text>
          {recentExams.map((exam, idx) => {
            const score = exam.score || 0;
            const total = exam.totalQuestions || 40;
            const passed = exam.passed ?? score >= 32;
            const date = new Date(exam.startedAt);
            const dateStr = date.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
            });

            return (
              <View key={exam.id || idx} style={styles.historyCard}>
                <View
                  style={[
                    styles.historyBadge,
                    { backgroundColor: passed ? '#E8F5E9' : '#FFEBEE' },
                  ]}
                >
                  <Ionicons
                    name={passed ? 'checkmark' : 'close'}
                    size={18}
                    color={passed ? '#2E7D32' : '#C62828'}
                  />
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyTitle}>Examen blanc</Text>
                  <Text style={styles.historyDate}>{dateStr}</Text>
                </View>
                <View style={styles.historyScore}>
                  <Text
                    style={[
                      styles.historyScoreText,
                      { color: passed ? '#2E7D32' : '#C62828' },
                    ]}
                  >
                    {score}/{total}
                  </Text>
                  <Text style={styles.historyPercent}>
                    {Math.round((score / total) * 100)}%
                  </Text>
                </View>
              </View>
            );
          })}
        </>
      )}
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
    paddingBottom: 32,
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
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
    borderRadius: 18,
    padding: 22,
    marginBottom: 14,
    shadowColor: '#002395',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  examCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  examIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  examCardContent: {
    flex: 1,
  },
  examCardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  examCardDesc: {
    color: '#FFFFFFB3',
    fontSize: 13,
    marginTop: 4,
  },
  continueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
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
    marginBottom: 14,
    color: '#333',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  themeCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  themeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  themeName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 18,
  },
  themeColorBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  historyBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  historyDate: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  historyScore: {
    alignItems: 'flex-end',
  },
  historyScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyPercent: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
