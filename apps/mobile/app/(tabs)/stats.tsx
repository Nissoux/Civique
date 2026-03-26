import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { THEMES } from '@civique/shared';
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
import { ProgressRing, Card } from '../../components/ui';

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
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!refreshing) setLoading(true);
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
      setRefreshing(false);
    }
  }, [refreshing]);

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
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
    loadHistory();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#002395" />
      </View>
    );
  }

  const accuracy = overview?.overallAccuracy ?? 0;
  const passRate = overview
    ? overview.examsTaken > 0
      ? Math.round((overview.examsPassed / overview.examsTaken) * 100)
      : 0
    : 0;

  // Find max questions in history for chart scaling
  const maxHistoryQuestions = Math.max(
    ...history.map((h) => h.totalAnswered),
    1
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#002395" />
      }
    >
      {/* Header with accuracy ring */}
      <LinearGradient
        colors={['#002395', '#1a3fad']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>Statistiques</Text>
        <Text style={styles.subtitle}>Suivez votre progression</Text>

        <View style={styles.ringSection}>
          <ProgressRing
            progress={accuracy}
            size={160}
            strokeWidth={14}
            color="#FFFFFF"
            bgColor="rgba(255,255,255,0.2)"
            label="Pr\u00e9cision"
            sublabel="globale"
          />
        </View>
      </LinearGradient>

      {/* Quick stats row */}
      <View style={styles.statsRow}>
        <View style={styles.quickStat}>
          <View style={[styles.quickStatIcon, { backgroundColor: '#EEF1FB' }]}>
            <Ionicons name="help-circle" size={20} color="#002395" />
          </View>
          <Text style={styles.quickStatValue}>{overview?.totalPracticed ?? 0}</Text>
          <Text style={styles.quickStatLabel}>Questions</Text>
        </View>
        <View style={styles.quickStat}>
          <View style={[styles.quickStatIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="school" size={20} color="#2ECC71" />
          </View>
          <Text style={styles.quickStatValue}>{overview?.examsTaken ?? 0}</Text>
          <Text style={styles.quickStatLabel}>Examens</Text>
        </View>
        <View style={styles.quickStat}>
          <View style={[styles.quickStatIcon, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="checkmark-done" size={20} color="#F57C00" />
          </View>
          <Text style={styles.quickStatValue}>{overview?.examsPassed ?? 0}</Text>
          <Text style={styles.quickStatLabel}>R{'\u00e9'}ussis</Text>
        </View>
        <View style={styles.quickStat}>
          <View style={[styles.quickStatIcon, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="flame" size={20} color="#ED2939" />
          </View>
          <Text style={styles.quickStatValue}>{overview?.currentStreak ?? 0}</Text>
          <Text style={styles.quickStatLabel}>S{'\u00e9'}rie</Text>
        </View>
      </View>

      {/* Streak card */}
      {overview && overview.currentStreak > 0 && (
        <Card style={styles.streakCard}>
          <LinearGradient
            colors={['#FF6B35', '#ED2939']}
            style={styles.streakGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="flame" size={28} color="#FFF" />
            <View style={styles.streakInfo}>
              <Text style={styles.streakValue}>
                {overview.currentStreak} jour{overview.currentStreak > 1 ? 's' : ''} de suite !
              </Text>
              <Text style={styles.streakDesc}>Continuez comme {'\u00e7'}a !</Text>
            </View>
          </LinearGradient>
        </Card>
      )}

      {/* Theme progress bars */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Progression par th{'\u00e8'}me</Text>
        {themeStats.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bar-chart-outline" size={36} color="#CCC" />
            <Text style={styles.emptyText}>
              Commencez {'\u00e0'} vous entra{'\u00ee'}ner pour voir vos statistiques
            </Text>
          </View>
        ) : (
          themeStats.map((ts) => {
            const theme = THEMES.find((t) => t.id === ts.themeId);
            const color = theme?.color || '#002395';
            const pct = Math.round(ts.accuracy);
            return (
              <View key={ts.themeId} style={styles.themeRow}>
                <View style={styles.themeHeader}>
                  <View style={[styles.themeColorDot, { backgroundColor: color }]} />
                  <Text style={styles.themeLabel} numberOfLines={1}>
                    {ts.themeName}
                  </Text>
                  <Text style={[styles.themePercent, { color }]}>{pct}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(pct, 100)}%`,
                        backgroundColor: color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })
        )}
      </Card>

      {/* Weak areas */}
      {weakAreas.length > 0 && (
        <Card style={styles.sectionCard}>
          <View style={styles.weakHeader}>
            <Ionicons name="warning" size={20} color="#ED2939" />
            <Text style={[styles.sectionTitle, { color: '#ED2939', marginBottom: 0 }]}>
              Points faibles
            </Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Th{'\u00e8'}mes avec moins de 60% de pr{'\u00e9'}cision
          </Text>
          {weakAreas.map((wa) => {
            const theme = THEMES.find((t) => t.id === wa.themeId);
            return (
              <View key={wa.themeId} style={styles.weakRow}>
                <View style={styles.weakLeft}>
                  <View
                    style={[
                      styles.weakDot,
                      { backgroundColor: theme?.color || '#ED2939' },
                    ]}
                  />
                  <Text style={styles.weakName} numberOfLines={1}>
                    {wa.themeName}
                  </Text>
                </View>
                <View style={styles.weakScoreBadge}>
                  <Text style={styles.weakPercent}>{Math.round(wa.accuracy)}%</Text>
                </View>
              </View>
            );
          })}
        </Card>
      )}

      {/* Activity chart */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Activit{'\u00e9'}</Text>
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
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={36} color="#CCC" />
            <Text style={styles.emptyText}>
              Aucune activit{'\u00e9'} pour cette p{'\u00e9'}riode
            </Text>
          </View>
        ) : (
          <>
            {/* Bar chart */}
            <View style={styles.chartContainer}>
              {history.slice(-7).map((entry, idx) => {
                const barHeight = (entry.totalAnswered / maxHistoryQuestions) * 120;
                const dayAccuracy =
                  entry.totalAnswered > 0
                    ? Math.round((entry.correctAnswers / entry.totalAnswered) * 100)
                    : 0;
                const barColor = dayAccuracy >= 70 ? '#002395' : dayAccuracy >= 50 ? '#F57C00' : '#ED2939';
                const dayLabel = new Date(entry.date).toLocaleDateString('fr-FR', {
                  weekday: 'short',
                }).slice(0, 3);

                return (
                  <View key={idx} style={styles.chartColumn}>
                    <Text style={styles.chartBarValue}>
                      {entry.totalAnswered > 0 ? entry.totalAnswered : ''}
                    </Text>
                    <View style={styles.chartBarBg}>
                      <View
                        style={[
                          styles.chartBar,
                          {
                            height: Math.max(barHeight, 4),
                            backgroundColor: barColor,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.chartLabel}>{dayLabel}</Text>
                  </View>
                );
              })}
            </View>

            {/* Legend */}
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#002395' }]} />
                <Text style={styles.legendText}>{'\u2265'}70%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F57C00' }]} />
                <Text style={styles.legendText}>50-69%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#ED2939' }]} />
                <Text style={styles.legendText}>&lt;50%</Text>
              </View>
            </View>
          </>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  ringSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginTop: -16,
    marginBottom: 12,
    gap: 8,
  },
  quickStat: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  quickStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  streakCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
  },
  streakGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  streakInfo: {
    flex: 1,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  streakDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
    marginTop: -8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  themeRow: {
    marginBottom: 16,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  themeColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  themeLabel: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  themePercent: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    borderRadius: 5,
  },
  weakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  weakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  weakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  weakDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  weakName: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  weakScoreBadge: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  weakPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ED2939',
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 20,
    marginTop: -8,
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
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
    gap: 8,
    paddingTop: 20,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  chartBarBg: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chartBar: {
    width: '80%',
    borderRadius: 6,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    textTransform: 'capitalize',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#999',
  },
});
