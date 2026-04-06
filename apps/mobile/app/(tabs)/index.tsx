import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { THEMES } from '@civique/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated as RNAnimated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';
import { useExamTypeStore, getExamType } from '../../stores/examTypeStore';
import { useProgressionStore, computeLevelsForTheme } from '../../stores/progressionStore';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { getStatsOverview } from '../../services/stats';
import { getQuestions } from '../../services/questions';
import { AnimatedCard, AnimatedCounter, AnimatedPressable, CMotif } from '../../components/ui';
import { MotiView } from '../../components/ui/MotiView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUBBLE_SIZE = 64;
const PATH_OFFSET = 40;

// ── Theme Emojis (unique, not generic Ionicons) ──
const THEME_EMOJIS: Record<number, string> = {
  1: '🇫🇷', // Principes et valeurs de la République
  2: '🏛️', // Système institutionnel et politique
  3: '⚖️', // Droits et devoirs
  4: '📜', // Histoire, géographie et culture
  5: '🤝', // Vivre dans la société française
};

// ── Crown display ──
function CrownDisplay({ crowns, size = 14 }: { crowns: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <Ionicons
          key={i}
          name={i <= crowns ? 'star' : 'star-outline'}
          size={size}
          color={i <= crowns ? '#FFD700' : 'rgba(255,255,255,0.3)'}
        />
      ))}
    </View>
  );
}

// ── Level Bubble ──
function LevelBubble({
  levelNum,
  crowns,
  isLocked,
  isCurrent,
  themeColor,
  onPress,
  offsetX,
}: {
  levelNum: number;
  crowns: number;
  isLocked: boolean;
  isCurrent: boolean;
  themeColor: string;
  onPress: () => void;
  offsetX: number;
}) {
  const c = useColors();

  const bgColor = isLocked
    ? c.progressBg
    : crowns >= 1
      ? themeColor
      : c.surface;

  const borderColor = isCurrent
    ? themeColor
    : isLocked
      ? 'transparent'
      : crowns >= 1
        ? themeColor
        : c.border;

  return (
    <View style={[styles.bubbleContainer, { marginLeft: offsetX }]}>
      <AnimatedPressable
        onPress={onPress}
        disabled={isLocked}
        scaleDown={0.92}
      >
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: bgColor,
              borderColor,
              borderWidth: isCurrent ? 3 : 1.5,
              opacity: isLocked ? 0.4 : 1,
            },
            isCurrent && styles.bubbleCurrent,
          ]}
        >
          {isLocked ? (
            <Ionicons name="lock-closed" size={22} color={c.textTertiary} />
          ) : (
            <Text
              style={[
                styles.bubbleText,
                { color: crowns >= 1 ? '#FFFFFF' : c.textPrimary },
              ]}
            >
              {levelNum}
            </Text>
          )}
        </View>
      </AnimatedPressable>
      {!isLocked && crowns > 0 && (
        <View style={styles.bubbleCrowns}>
          <CrownDisplay crowns={crowns} size={12} />
        </View>
      )}
      {isCurrent && (
        <MotiView
          from={{ opacity: 0, translateY: -5 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 200 }}
        >
          <View style={[styles.currentBadge, { backgroundColor: themeColor }]}>
            <Text style={styles.currentBadgeText}>EN COURS</Text>
          </View>
        </MotiView>
      )}
    </View>
  );
}

export default function TrainingScreen() {
  const router = useRouter();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { selectedExamType } = useExamTypeStore();
  const { xp, streak, loadProgress, getLevelProgress, isLevelUnlocked, loaded } = useProgressionStore();

  const [questionCounts, setQuestionCounts] = useState<Record<number, number>>({});
  const [expandedTheme, setExpandedTheme] = useState<number | null>(null);

  const examDef = getExamType(selectedExamType);
  const displayName = user?.displayName || 'Citoyen';

  const { data: stats } = useQuery({
    queryKey: ['stats', 'overview', selectedExamType],
    queryFn: () => getStatsOverview(selectedExamType || undefined),
    staleTime: 30 * 1000,
  });

  // Load progression and question counts
  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    // Fetch question count per theme
    async function fetchCounts() {
      const counts: Record<number, number> = {};
      for (const theme of THEMES) {
        try {
          const result = await getQuestions({
            themeId: theme.id,
            examType: selectedExamType || undefined,
            limit: 1,
          });
          counts[theme.id] = result.total;
        } catch {
          counts[theme.id] = 0;
        }
      }
      setQuestionCounts(counts);
    }
    fetchCounts();
  }, [selectedExamType]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero Header ────────────────────────── */}
      <LinearGradient
        colors={c.gradientHero}
        style={[styles.hero, { paddingTop: insets.top + 16 }]}
      >
        <CMotif size="xl" color="#FFFFFF" opacity="subtle" rotation={-30} style={{ top: 20, right: -20 }} />
        <CMotif size="md" color="#4D7CFF" opacity="subtle" rotation={120} style={{ top: 50, left: '35%' }} />

        <View style={styles.heroInner}>
          <View style={styles.headerLeft}>
            <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}>
              <Text style={styles.greeting}>Bonjour, {displayName}</Text>
            </MotiView>
            {examDef && (
              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 100 }}>
                <AnimatedPressable onPress={() => router.push('/(tabs)/choose-exam')} haptic={false}>
                  <View style={styles.examBadge}>
                    <Text style={styles.examEmoji}>{examDef.emoji}</Text>
                    <Text style={styles.examLabel}>{examDef.shortLabel}</Text>
                    <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.6)" />
                  </View>
                </AnimatedPressable>
              </MotiView>
            )}
          </View>
          <AnimatedPressable onPress={() => router.push('/profile')} scaleDown={0.9}>
            <View style={styles.avatarButton}>
              <Ionicons name="person" size={20} color={c.primary} />
            </View>
          </AnimatedPressable>
        </View>

        {/* XP & Streak row */}
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 150 }}>
          <View style={styles.xpRow}>
            <View style={styles.xpItem}>
              <Ionicons name="flash" size={16} color="#FFD700" />
              <AnimatedCounter value={xp} style={styles.xpValue} />
              <Text style={styles.xpLabel}>XP</Text>
            </View>
            <View style={styles.xpDivider} />
            <View style={styles.xpItem}>
              <Ionicons name="flame" size={16} color="#FF6B35" />
              <Text style={styles.xpValue}>{streak}</Text>
              <Text style={styles.xpLabel}>jour{streak !== 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.xpDivider} />
            <View style={styles.xpItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.xpValue}>{stats?.overallAccuracy ? `${Math.round(stats.overallAccuracy)}%` : '0%'}</Text>
              <Text style={styles.xpLabel}>précision</Text>
            </View>
          </View>
        </MotiView>
      </LinearGradient>

      {/* ── Quick Actions ──────────────────────── */}
      <View style={styles.quickActions}>
        <AnimatedCard delay={200} style={{ flex: 1 }}>
          <AnimatedPressable onPress={() => router.push('/train/random')}>
            <View style={[styles.quickCard, { backgroundColor: c.surface }]}>
              <View style={[styles.quickIcon, { backgroundColor: c.secondary + '18' }]}>
                <Ionicons name="shuffle" size={20} color={c.secondary} />
              </View>
              <Text style={[styles.quickTitle, { color: c.textPrimary }]}>Rapide</Text>
              <Text style={[styles.quickSub, { color: c.textTertiary }]}>10 questions</Text>
            </View>
          </AnimatedPressable>
        </AnimatedCard>
        <AnimatedCard delay={300} style={{ flex: 1 }}>
          <AnimatedPressable onPress={() => router.push('/exam')}>
            <View style={[styles.quickCard, { backgroundColor: c.surface }]}>
              <View style={[styles.quickIcon, { backgroundColor: c.primary + '18' }]}>
                <Ionicons name="document-text" size={20} color={c.primary} />
              </View>
              <Text style={[styles.quickTitle, { color: c.textPrimary }]}>Examen</Text>
              <Text style={[styles.quickSub, { color: c.textTertiary }]}>40 questions</Text>
            </View>
          </AnimatedPressable>
        </AnimatedCard>
      </View>

      {/* ── Learning Path ──────────────────────── */}
      <AnimatedCard delay={400}>
        <View style={styles.pathHeader}>
          <Text style={[styles.pathTitle, { color: c.textPrimary }]}>Parcours d'apprentissage</Text>
          <Text style={[styles.pathSubtitle, { color: c.textTertiary }]}>
            Complétez les niveaux pour gagner des couronnes
          </Text>
        </View>
      </AnimatedCard>

      {THEMES.map((theme, themeIdx) => {
        const emoji = THEME_EMOJIS[theme.id] || '📚';
        const totalQ = questionCounts[theme.id] || 0;
        const totalLevels = computeLevelsForTheme(totalQ);

        // Find current level (first with < 1 crown)
        let currentLevel = 1;
        for (let i = 1; i <= totalLevels; i++) {
          const lp = getLevelProgress(theme.id, i);
          if (lp.crowns < 1) {
            currentLevel = i;
            break;
          }
          if (i === totalLevels) currentLevel = totalLevels;
        }

        // Count crowns for this theme
        let themeCrowns = 0;
        for (let i = 1; i <= totalLevels; i++) {
          themeCrowns += getLevelProgress(theme.id, i).crowns;
        }

        const isExpanded = expandedTheme === theme.id;

        return (
          <AnimatedCard key={theme.id} delay={500 + themeIdx * 100}>
            <View style={styles.themeSection}>
              {/* Theme header — tappable to expand/collapse */}
              <AnimatedPressable
                onPress={() => setExpandedTheme(isExpanded ? null : theme.id)}
                scaleDown={0.98}
              >
                <View style={[styles.themeCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                  <View style={[styles.themeIconBadge, { backgroundColor: theme.color + '15' }]}>
                    <Text style={styles.themeEmoji}>{emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.themeName, { color: c.textPrimary }]}>{theme.nameFr}</Text>
                    <View style={styles.themeMetaRow}>
                      <CrownDisplay crowns={Math.min(3, Math.floor(themeCrowns / Math.max(1, totalLevels)))} size={11} />
                      <Text style={[styles.themeMeta, { color: c.textTertiary }]}>
                        {themeCrowns}/{totalLevels * 3} · {totalLevels} niveaux
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={c.textTertiary}
                  />
                </View>
              </AnimatedPressable>

              {/* Level bubbles path — only when expanded */}
              {isExpanded && <View style={styles.pathContainer}>
                {Array.from({ length: Math.min(totalLevels, 20) }, (_, i) => i + 1).map((levelNum) => {
                  const lp = getLevelProgress(theme.id, levelNum);
                  const unlocked = isLevelUnlocked(theme.id, levelNum, totalLevels);
                  const isCurrent = unlocked && levelNum === currentLevel;

                  // Zigzag offset
                  const zigzag = (levelNum % 4 === 1) ? -PATH_OFFSET
                    : (levelNum % 4 === 2) ? 0
                    : (levelNum % 4 === 3) ? PATH_OFFSET
                    : 0;

                  return (
                    <LevelBubble
                      key={levelNum}
                      levelNum={levelNum}
                      crowns={lp.crowns}
                      isLocked={!unlocked}
                      isCurrent={isCurrent}
                      themeColor={theme.color}
                      offsetX={zigzag}
                      onPress={() => {
                        router.push(`/train/${theme.id}?series=${levelNum}`);
                      }}
                    />
                  );
                })}
              </View>}
            </View>
          </AnimatedCard>
        );
      })}

      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ── Hero ──
  hero: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  headerLeft: { flex: 1 },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  examBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.round,
  },
  examEmoji: { fontSize: 16 },
  examLabel: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── XP Row ──
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  xpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  xpLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  xpDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  // ── Quick Actions ──
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  quickCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickTitle: { fontSize: 14, fontWeight: '700' },
  quickSub: { fontSize: 11, marginTop: 2 },

  // ── Path ──
  pathHeader: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  pathTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  pathSubtitle: { fontSize: 13, marginTop: 2 },

  // ── Theme Section ──
  themeSection: {
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  themeIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeEmoji: {
    fontSize: 26,
  },
  themeName: { fontSize: 17, fontWeight: '700' },
  themeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  themeMeta: { fontSize: 11 },

  // ── Level Bubbles ──
  pathContainer: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  bubbleContainer: {
    alignItems: 'center',
    gap: 4,
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleCurrent: {
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  bubbleText: {
    fontSize: 22,
    fontWeight: '800',
  },
  bubbleCrowns: {
    marginTop: 2,
  },
  currentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 2,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
