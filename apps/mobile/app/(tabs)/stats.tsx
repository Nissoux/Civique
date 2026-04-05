import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from '../../components/ui/MotiView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { AnimatedCard, AnimatedCounter, AnimatedPressable, CMotif, ProgressRing, ShimmerLoader } from '../../components/ui';

type Period = 'week' | 'month' | 'all';
const PERIOD_LABELS: Record<Period, string> = {
  week: 'Semaine',
  month: 'Mois',
  all: 'Tout',
};

export default function StatsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [overview, setOverview] = useState<StatsOverview | null>(null);
  const [themeStats, setThemeStats] = useState<ThemeStat[]>([]);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [period, setPeriod] = useState<Period>('week');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
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

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { loadHistory(); }, [loadHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    await loadHistory();
    setRefreshing(false);
  }, [loadData, loadHistory]);

  const passRate = overview
    ? overview.examsTaken > 0
      ? Math.round((overview.examsPassed / overview.examsTaken) * 100)
      : 0
    : 0;

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: c.background }}>
        <LinearGradient colors={c.gradientHero} style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}>
          <ShimmerLoader width={200} height={28} />
          <ShimmerLoader width={160} height={16} style={{ marginTop: 8 }} />
        </LinearGradient>
        <View style={{ padding: spacing.xl, gap: spacing.lg }}>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <ShimmerLoader width={'100%' as any} height={100} style={{ flex: 1 }} />
            <ShimmerLoader width={'100%' as any} height={100} style={{ flex: 1 }} />
          </View>
          <ShimmerLoader width={'100%' as any} height={60} />
          <ShimmerLoader width={'100%' as any} height={200} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.primary} />
      }
    >
      {/* ── Hero ─────────────────────────── */}
      <LinearGradient
        colors={c.gradientHero}
        style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}
      >
        <CMotif size="xl" color="#FFFFFF" opacity="subtle" rotation={-20} style={{ top: 15, right: -20 }} />
        <CMotif size="md" color="#4D7CFF" opacity="subtle" rotation={70} style={{ bottom: 25, left: -10 }} />

        <MotiView from={{ opacity: 0, translateY: 15 }} animate={{ opacity: 1, translateY: 0 }}>
          <Text style={styles.heroTitle}>Statistiques</Text>
          <Text style={styles.heroSubtitle}>Suivez votre progression</Text>
        </MotiView>
      </LinearGradient>

      <View style={styles.body}>
        {/* ── Main stats ───────────────────── */}
        <View style={styles.statsGrid}>
          {[
            { value: overview?.examsTaken ?? 0, label: 'Examens', icon: 'document-text' as const, color: c.primary },
            { value: passRate, label: 'Réussite', icon: 'trophy' as const, color: c.accent, suffix: '%' },
            { value: overview?.totalPracticed ?? 0, label: 'Questions', icon: 'help-circle' as const, color: c.success },
            { value: overview?.overallAccuracy ?? 0, label: 'Précision', icon: 'analytics' as const, color: c.secondary, suffix: '%' },
          ].map((stat, i) => (
            <AnimatedCard key={stat.label} delay={i * 80 + 100} style={{ flex: 1 }}>
              <View style={[styles.statCard, { backgroundColor: c.surface }]}>
                <View style={[styles.statIconBg, { backgroundColor: stat.color + '18' }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix || ''}
                  style={[styles.statValue, { color: c.textPrimary }]}
                />
                <Text style={[styles.statLabel, { color: c.textTertiary }]}>{stat.label}</Text>
              </View>
            </AnimatedCard>
          ))}
        </View>

        {/* ── Streak ──────────────────────── */}
        {overview && overview.currentStreak > 0 && (
          <AnimatedCard delay={400}>
            <View style={[styles.streakCard, { backgroundColor: c.secondary + '12', borderColor: c.secondary + '25' }]}>
              <Ionicons name="flame" size={24} color={c.secondary} />
              <Text style={[styles.streakText, { color: c.secondary }]}>
                {overview.currentStreak} jour{overview.currentStreak > 1 ? 's' : ''} de suite !
              </Text>
            </View>
          </AnimatedCard>
        )}

        {/* ── Theme progress ──────────────── */}
        <AnimatedCard delay={500}>
          <View style={[styles.section, { backgroundColor: c.surface }]}>
            <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>Progression par thème</Text>
            {themeStats.length === 0 ? (
              <Text style={[styles.emptyText, { color: c.textTertiary }]}>
                Commencez à vous entraîner pour voir vos statistiques
              </Text>
            ) : (
              themeStats.map((ts, i) => (
                <MotiView
                  key={ts.themeId}
                  from={{ opacity: 0, translateX: -10 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: 600 + i * 60 }}
                >
                  <View style={[styles.themeRow, { borderBottomColor: c.divider }]}>
                    <Text style={[styles.themeLabel, { color: c.textSecondary }]} numberOfLines={1}>
                      {ts.themeName}
                    </Text>
                    <View style={[styles.progressBarBg, { backgroundColor: c.progressBg }]}>
                      <MotiView
                        from={{ width: '0%' }}
                        animate={{ width: `${Math.min(ts.accuracy, 100)}%` as any }}
                        transition={{ type: 'timing', duration: 800, delay: 700 + i * 60 }}
                        style={[styles.progressBarFill, { backgroundColor: ts.accuracy >= 80 ? c.success : c.primary }]}
                      />
                    </View>
                    <Text style={[styles.themePercent, { color: c.primary }]}>{Math.round(ts.accuracy)}%</Text>
                  </View>
                </MotiView>
              ))
            )}
          </View>
        </AnimatedCard>

        {/* ── Weak areas ─────────────────── */}
        {weakAreas.length > 0 && (
          <AnimatedCard delay={700}>
            <View style={[styles.section, { backgroundColor: c.surface }]}>
              <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>Points faibles</Text>
              <Text style={[styles.sectionSubtitle, { color: c.textTertiary }]}>Thèmes à améliorer</Text>
              {weakAreas.map((wa) => (
                <View key={wa.themeId} style={[styles.weakRow, { borderBottomColor: c.divider }]}>
                  <Ionicons name="alert-circle" size={18} color={c.error} />
                  <Text style={[styles.weakName, { color: c.textSecondary }]} numberOfLines={1}>{wa.themeName}</Text>
                  <Text style={[styles.weakPercent, { color: c.error }]}>{Math.round(wa.accuracy)}%</Text>
                </View>
              ))}
            </View>
          </AnimatedCard>
        )}

        {/* ── History ────────────────────── */}
        <AnimatedCard delay={800}>
          <View style={[styles.section, { backgroundColor: c.surface }]}>
            <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>Historique</Text>
            <View style={[styles.periodToggle, { backgroundColor: c.progressBg }]}>
              {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
                <AnimatedPressable
                  key={p}
                  onPress={() => setPeriod(p)}
                  haptic={true}
                  style={styles.periodButton}
                >
                  <MotiView
                    from={{ backgroundColor: 'transparent' }}
                    animate={{
                      backgroundColor: p === period ? c.primary : 'transparent',
                    }}
                    transition={{ type: 'timing', duration: 200 }}
                    style={styles.periodButtonInner}
                  >
                    <Text style={[
                      styles.periodText,
                      { color: p === period ? '#FFFFFF' : c.textSecondary },
                      p === period && styles.periodTextActive,
                    ]}>
                      {PERIOD_LABELS[p]}
                    </Text>
                  </MotiView>
                </AnimatedPressable>
              ))}
            </View>

            {history.length === 0 ? (
              <Text style={[styles.emptyText, { color: c.textTertiary }]}>Aucune activité pour cette période</Text>
            ) : (
              history.map((entry, idx) => {
                const dayAccuracy =
                  entry.totalAnswered > 0
                    ? Math.round((entry.correctAnswers / entry.totalAnswered) * 100)
                    : 0;
                return (
                  <View key={idx} style={[styles.historyRow, { borderBottomColor: c.divider }]}>
                    <Text style={[styles.historyDate, { color: c.textTertiary }]}>
                      {new Date(entry.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Text>
                    <Text style={[styles.historyQuestions, { color: c.textSecondary }]}>
                      {entry.totalAnswered} question{entry.totalAnswered > 1 ? 's' : ''}
                    </Text>
                    <Text style={[styles.historyAccuracy, { color: c.primary }]}>{dayAccuracy}%</Text>
                  </View>
                );
              })
            )}
          </View>
        </AnimatedCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.xl + 4,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 4 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  body: { padding: spacing.xl, paddingTop: spacing.xxl },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  statCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minWidth: '45%',
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 12, marginTop: 2, fontWeight: '500' },

  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  streakText: { fontSize: 16, fontWeight: '700' },

  section: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, marginBottom: spacing.md },
  emptyText: { fontSize: 14, textAlign: 'center', paddingVertical: 20 },

  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: 8,
    borderBottomWidth: 1,
  },
  themeLabel: { fontSize: 13, width: 100 },
  progressBarBg: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: 8, borderRadius: 4 },
  themePercent: { fontSize: 13, fontWeight: '600', width: 40, textAlign: 'right' },

  weakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
  },
  weakName: { flex: 1, fontSize: 14 },
  weakPercent: { fontSize: 14, fontWeight: '600' },

  periodToggle: {
    flexDirection: 'row',
    borderRadius: borderRadius.sm,
    padding: 3,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  periodButton: { flex: 1 },
  periodButtonInner: {
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodText: { fontSize: 13, fontWeight: '500' },
  periodTextActive: { fontWeight: '700' },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  historyDate: { fontSize: 13, width: 60 },
  historyQuestions: { flex: 1, fontSize: 14 },
  historyAccuracy: { fontSize: 14, fontWeight: '600' },
});
