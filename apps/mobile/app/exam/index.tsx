import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as examsService from '../../services/exams';
import type { ExamSession } from '@civique/shared';
import { useExamStore } from '../../stores/examStore';
import { useExamTypeStore, EXAM_TYPES } from '../../stores/examTypeStore';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ExamStartScreen() {
  const router = useRouter();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { setSession, reset } = useExamStore();
  const { selectedExamType } = useExamTypeStore();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ExamSession[]>([]);
  const [activeExam, setActiveExam] = useState<ExamSession | null>(null);

  useFocusEffect(
    useCallback(() => {
      examsService.getExamHistory(20).then((res) => {
        const all = res.data || [];
        setHistory(all.filter((s: any) => s.finishedAt));
        const active = all.find((s: any) => !s.finishedAt);
        setActiveExam(active || null);
      }).catch(() => {});
    }, [])
  );

  const examLabel = EXAM_TYPES.find((e) => e.code === selectedExamType)?.label || 'Examen civique';

  const startExam = async () => {
    // If there's an active exam, resume it instead
    if (activeExam) {
      setSession(activeExam);
      router.push(`/exam/session?sessionId=${activeExam.id}`);
      return;
    }

    setError(null);
    setIsStarting(true);
    reset();

    try {
      const { session } = await examsService.startExam(selectedExamType || undefined);
      setSession(session);
      router.push(`/exam/session?sessionId=${session.id}`);
    } catch (err: unknown) {
      const axiosErr = err as any;
      if (axiosErr?.response?.status === 409) {
        // Server says exam in progress — refresh to find it
        try {
          const res = await examsService.getExamHistory(20);
          const active = (res.data || []).find((s: any) => !s.finishedAt);
          if (active) {
            setActiveExam(active);
          }
        } catch {}
      } else if (axiosErr?.response?.status === 403 || axiosErr?.response?.status === 429) {
        setError('Limite atteinte. Passez à Premium pour des examens illimités.');
      } else {
        setError(axiosErr?.response?.data?.error || 'Impossible de démarrer l\'examen.');
      }
    } finally {
      setIsStarting(false);
    }
  };

  const abandonExam = async () => {
    if (!activeExam) return;
    try {
      await examsService.finishExam(activeExam.id);
      setActiveExam(null);
      const res = await examsService.getExamHistory(20);
      setHistory((res.data || []).filter((s: any) => s.finishedAt));
    } catch {}
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Gradient-style Header Area */}
      <View style={[styles.headerArea, { backgroundColor: c.primaryLight, paddingTop: insets.top + 16 }]}>
        <View style={[styles.headerAccent, { backgroundColor: c.primary }]} />
        <View style={styles.headerContent}>
          <View style={[styles.headerIconCircle, { backgroundColor: c.primary }]}>
            <Ionicons name="document-text" size={22} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: c.textPrimary }]}>Examen blanc — {examLabel}</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>
            Entraînez-vous dans les conditions réelles de l'examen civique
            avec des questions de connaissance et de mises en situation
          </Text>
        </View>
      </View>

      {/* Exam Card */}
      <View style={[styles.examCard, { backgroundColor: c.card, borderColor: c.border }]}>
        <View style={styles.examCardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.examCardTitle, { color: c.textPrimary }]}>
              Examen blanc officiel
            </Text>
            <Text style={[styles.examCardDesc, { color: c.textSecondary }]}>
              {examLabel} - Différentes questions par session
            </Text>
          </View>
          <View style={[styles.premiumBadge, { backgroundColor: c.accentBg }]}>
            <Ionicons name="shield-checkmark" size={20} color={c.accent} />
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statItem, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.statValue, { color: c.textPrimary }]}>40</Text>
            <Text style={[styles.statLabel, { color: c.textTertiary }]}>Questions</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.statValue, { color: c.textPrimary }]}>45 min</Text>
            <Text style={[styles.statLabel, { color: c.textTertiary }]}>Durée</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.statValue, { color: c.textPrimary }]}>80%</Text>
            <Text style={[styles.statLabel, { color: c.textTertiary }]}>Requis</Text>
          </View>
        </View>

        {/* Info */}
        <View style={[styles.infoBar, { backgroundColor: c.primaryLight }]}>
          <Ionicons name="information-circle" size={18} color={c.primary} />
          <Text style={[styles.infoText, { color: c.primary }]}>
            Êtes-vous prêt(e) ? Seuil de réussite : 32/40
          </Text>
        </View>

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: c.errorBg }]}>
            <Ionicons name="warning" size={16} color={c.error} />
            <Text style={[styles.errorText, { color: c.error }]}>{error}</Text>
          </View>
        )}

        {activeExam ? (
          <>
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: c.success }]}
              onPress={startExam}
            >
              <Ionicons name="play-circle" size={22} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Reprendre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.abandonButton, { borderColor: c.error }]}
              onPress={abandonExam}
            >
              <Text style={[styles.abandonButtonText, { color: c.error }]}>Abandonner l'examen</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: c.primary }, isStarting && { opacity: 0.6 }]}
            onPress={startExam}
            disabled={isStarting}
          >
            {isStarting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="play-circle" size={22} color="#FFFFFF" />
                <Text style={styles.startButtonText}>Commencer</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Exam History */}
      {history.length > 0 ? (
        <View style={styles.historySection}>
          <Text style={[styles.historyTitle, { color: c.textPrimary }]}>
            Historique des examens
          </Text>
          {history.map((exam) => {
            const score = exam.score || 0;
            const total = exam.totalQuestions || 40;
            const pct = Math.round((score / total) * 100);
            const passed = exam.passed ?? pct >= 80;
            const date = new Date(exam.finishedAt!);
            const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

            return (
              <TouchableOpacity
                key={exam.id}
                style={[
                  styles.historyItem,
                  {
                    backgroundColor: c.card,
                    borderLeftColor: passed ? c.success : c.error,
                  },
                ]}
                onPress={() => router.push(`/exam/results?sessionId=${exam.id}`)}
                activeOpacity={0.7}
              >
                <View style={[styles.historyBadge, { backgroundColor: passed ? c.successBg : c.errorBg }]}>
                  <Ionicons
                    name={passed ? 'checkmark-circle' : 'close-circle'}
                    size={26}
                    color={passed ? c.success : c.error}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historyScore, { color: c.textPrimary }]}>
                    {score}/{total}
                  </Text>
                  <Text style={[styles.historyPct, { color: c.textSecondary }]}>
                    {pct}% correct
                  </Text>
                  <Text style={[styles.historyDate, { color: c.textTertiary }]}>
                    {dateStr}
                  </Text>
                </View>
                <View style={styles.historyRight}>
                  <Text
                    style={[
                      styles.historyPassed,
                      {
                        color: passed ? c.success : c.error,
                        backgroundColor: passed ? c.successBg : c.errorBg,
                      },
                    ]}
                  >
                    {passed ? 'Réussi' : 'Échoué'}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={c.textTertiary} style={{ marginTop: 8 }} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={[styles.historyEmpty, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.historyEmptyIcon, { backgroundColor: c.primaryLight }]}>
            <Ionicons name="time-outline" size={24} color={c.textTertiary} />
          </View>
          <Text style={[styles.historyText, { color: c.textSecondary }]}>
            Vos résultats d'examens apparaîtront ici
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },

  /* ── Header area ──────────────────────────────────── */
  headerArea: {
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 28,
    overflow: 'hidden',
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSize.md,
    lineHeight: 22,
    opacity: 0.85,
  },

  /* ── Exam card ────────────────────────────────────── */
  examCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    marginHorizontal: spacing.xl,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  examCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  examCardTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    marginBottom: 4,
  },
  examCardDesc: {
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  premiumBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── Stats row ────────────────────────────────────── */
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 10,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },

  /* ── Info bar ─────────────────────────────────────── */
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    padding: 14,
    marginBottom: 20,
  },
  infoText: {
    fontSize: fontSize.sm,
    flex: 1,
    fontWeight: '500',
  },

  /* ── Error ────────────────────────────────────────── */
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.sm,
    flex: 1,
  },

  /* ── Start button ─────────────────────────────────── */
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 16,
    height: 60,
    shadowColor: '#002395',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* ── History section ──────────────────────────────── */
  historySection: {
    marginTop: 2,
    paddingHorizontal: spacing.xl,
  },
  abandonButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
  },
  abandonButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  activeExamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  activeExamTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  activeExamDesc: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  activeExamButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  historyBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyScore: {
    fontSize: 20,
    fontWeight: '800',
  },
  historyPct: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  historyDate: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyPassed: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },

  /* ── Empty state ──────────────────────────────────── */
  historyEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginHorizontal: spacing.xl,
    marginTop: 2,
  },
  historyEmptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyText: {
    fontSize: fontSize.md,
    flex: 1,
  },
});
