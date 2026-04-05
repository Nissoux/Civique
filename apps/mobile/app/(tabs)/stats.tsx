import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getStatsOverview,
  getStatsByTheme,
  getWeakAreas,
  getStatsHistory,
  type StatsOverview,
  type ThemeStat,
  type WeakArea,
  type HistoryEntry,
} from '../../services/stats';

type Period = 'week' | 'month' | 'all';
const PERIOD_LABELS: Record<Period, string> = {
  week: 'Semaine',
  month: 'Mois',
  all: 'Tout',
};

export default function StatsScreen() {
  const [overview, setOverview] = useState<StatsOverview | null>(null);
  const [themeStats, setThemeStats] = useState<ThemeStat[]>([]);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [period, setPeriod] = useState<Period>('week');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ov, themes, weak] = await Promise.all([
        getStatsOverview(),
        getStatsByTheme(),
        getWeakAreas(),
      ]);
      setOverview(ov);
      setThemeStats(themes);
      setWeakAreas(weak);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const h = await getStatsHistory(period);
      setHistory(h);
    } catch {
      // silent
    }
  }, [period]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#002395" />
      </View>
    );
  }

  const passRate = overview
    ? overview.examsTaken > 0
      ? Math.round((overview.examsPassed / overview.examsTaken) * 100)
      : 0
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Statistiques</Text>
      <Text style={styles.subtitle}>Suivez votre progression</Text>

      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{overview?.examsTaken ?? 0}</Text>
          <Text style={styles.statLabel}>Examens</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{passRate}%</Text>
          <Text style={styles.statLabel}>Réussite</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{overview?.totalPracticed ?? 0}</Text>
          <Text style={styles.statLabel}>Questions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{overview?.overallAccuracy ?? 0}%</Text>
          <Text style={styles.statLabel}>Précision</Text>
        </View>
      </View>

      {overview && overview.currentStreak > 0 && (
        <View style={styles.streakCard}>
          <Ionicons name="flame" size={24} color="#ED2939" />
          <Text style={styles.streakText}>
            {overview.currentStreak} jour{overview.currentStreak > 1 ? 's' : ''} de suite !
          </Text>
        </View>
      )}

      {/* Theme progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progression par thème</Text>
        {themeStats.length === 0 ? (
          <Text style={styles.emptyText}>
            Commencez à vous entraîner pour voir vos statistiques
          </Text>
        ) : (
          themeStats.map((ts) => (
            <View key={ts.themeId} style={styles.themeRow}>
              <Text style={styles.themeLabel} numberOfLines={1}>
                {ts.themeName}
              </Text>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min(ts.accuracy, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.themePercent}>{Math.round(ts.accuracy)}%</Text>
            </View>
          ))
        )}
      </View>

      {/* Weak areas */}
      {weakAreas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points faibles</Text>
          <Text style={styles.sectionSubtitle}>Thèmes à améliorer</Text>
          {weakAreas.map((wa) => (
            <View key={wa.themeId} style={styles.weakRow}>
              <Ionicons name="alert-circle" size={18} color="#ED2939" />
              <Text style={styles.weakName} numberOfLines={1}>{wa.themeName}</Text>
              <Text style={styles.weakPercent}>{Math.round(wa.accuracy)}%</Text>
            </View>
          ))}
        </View>
      )}

      {/* History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historique</Text>
        <View style={styles.periodToggle}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodButton, p === period && styles.periodButtonActive]}
              onPress={() => setPeriod(p)}
            >
              <Text
                style={[styles.periodText, p === period && styles.periodTextActive]}
              >
                {PERIOD_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {history.length === 0 ? (
          <Text style={styles.emptyText}>Aucune activité pour cette période</Text>
        ) : (
          history.map((entry, idx) => {
            const dayAccuracy =
              entry.totalAnswered > 0
                ? Math.round((entry.correctAnswers / entry.totalAnswered) * 100)
                : 0;
            return (
              <View key={idx} style={styles.historyRow}>
                <Text style={styles.historyDate}>
                  {new Date(entry.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </Text>
                <Text style={styles.historyQuestions}>
                  {entry.totalAnswered} question{entry.totalAnswered > 1 ? 's' : ''}
                </Text>
                <Text style={styles.historyAccuracy}>{dayAccuracy}%</Text>
              </View>
            );
          })
        )}
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
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#002395',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ED2939',
  },
  section: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  themeLabel: {
    fontSize: 13,
    color: '#555',
    width: 100,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#ECECEC',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#002395',
    borderRadius: 4,
  },
  themePercent: {
    fontSize: 13,
    fontWeight: '600',
    color: '#002395',
    width: 40,
    textAlign: 'right',
  },
  weakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  weakName: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  weakPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ED2939',
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 3,
    marginTop: 8,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#002395',
  },
  periodText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  periodTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  historyDate: {
    fontSize: 13,
    color: '#999',
    width: 60,
  },
  historyQuestions: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  historyAccuracy: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002395',
  },
});
