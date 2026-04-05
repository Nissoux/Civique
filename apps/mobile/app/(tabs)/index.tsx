import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { THEMES } from '@civique/shared';
import { useAuthStore } from '../../stores/authStore';
import { useExamTypeStore, getExamType } from '../../stores/examTypeStore';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { getStatsOverview, getStatsByTheme, type ThemeStat } from '../../services/stats';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Map theme icon strings to Ionicons names
const THEME_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  flag: 'flag',
  landmark: 'business',
  scale: 'scale',
  'book-open': 'book',
  home: 'home',
};

// ── Question of the Day Data ──────────────────────────
const DAILY_QUESTIONS = [
  { q: "Quelle est la devise de la République française ?", a: "Liberté, Égalité, Fraternité." },
  { q: "En quelle année la Déclaration des droits de l'homme et du citoyen a-t-elle été adoptée ?", a: "En 1789." },
  { q: "Quel est l'hymne national français ?", a: "La Marseillaise." },
  { q: "Qui est le président de la République française élu en 2022 ?", a: "Emmanuel Macron." },
  { q: "Combien de régions métropolitaines compte la France ?", a: "13 régions métropolitaines." },
  { q: "Quel est le symbole de la République française ?", a: "Marianne." },
  { q: "Quelle est la durée du mandat présidentiel en France ?", a: "5 ans (quinquennat)." },
  { q: "Quel document garantit les libertés fondamentales en France ?", a: "La Constitution de la Ve République (1958)." },
  { q: "Quel est le drapeau de la France ?", a: "Trois bandes verticales : bleu, blanc, rouge." },
  { q: "Quelle est la capitale de la France ?", a: "Paris." },
  { q: "Qui vote les lois en France ?", a: "Le Parlement (Assemblée nationale et Sénat)." },
  { q: "Quel âge faut-il avoir pour voter en France ?", a: "18 ans." },
  { q: "Qu'est-ce que la laïcité ?", a: "Le principe de séparation des Églises et de l'État." },
  { q: "Quand célèbre-t-on la fête nationale française ?", a: "Le 14 juillet." },
  { q: "Quel est le rôle du maire ?", a: "Il dirige la commune et célèbre les mariages civils." },
  { q: "Combien de départements la France métropolitaine compte-t-elle ?", a: "96 départements." },
  { q: "Qu'est-ce que le suffrage universel ?", a: "Le droit de vote accordé à tous les citoyens majeurs." },
  { q: "Quelle institution juge la constitutionnalité des lois ?", a: "Le Conseil constitutionnel." },
  { q: "Quel traité a fondé l'Union européenne ?", a: "Le traité de Maastricht (1992)." },
  { q: "Combien d'étoiles figurent sur le drapeau européen ?", a: "12 étoiles." },
  { q: "Quelle est la monnaie utilisée en France ?", a: "L'euro (€), depuis 2002." },
  { q: "Qu'est-ce que l'Assemblée nationale ?", a: "La chambre basse du Parlement, composée de députés élus au suffrage universel direct." },
  { q: "Quelle est la plus haute juridiction de l'ordre judiciaire ?", a: "La Cour de cassation." },
  { q: "Quel est l'animal symbolique de la France ?", a: "Le coq gaulois." },
  { q: "Qu'est-ce que la Sécurité sociale ?", a: "Un système de protection sociale couvrant maladie, retraite, famille et accidents du travail." },
  { q: "Quelle est la langue officielle de la France ?", a: "Le français." },
  { q: "Qui nomme le Premier ministre ?", a: "Le président de la République." },
  { q: "Qu'est-ce que le Sénat ?", a: "La chambre haute du Parlement, dont les membres sont élus au suffrage universel indirect." },
  { q: "En quelle année les femmes ont-elles obtenu le droit de vote en France ?", a: "En 1944." },
  { q: "Qu'est-ce que la carte nationale d'identité ?", a: "Un document officiel prouvant l'identité et la nationalité française." },
];

// ── Skill Level Helper ────────────────────────────────
function getSkillLevel(totalPracticed: number, overallAccuracy: number): { label: string; color: string; icon: React.ComponentProps<typeof Ionicons>['name'] } {
  // Based on number of questions practiced AND accuracy, not just accuracy
  if (totalPracticed < 20) return { label: 'Débutant', color: '#9E9E9E', icon: 'leaf' };
  if (totalPracticed < 80 || overallAccuracy < 40) return { label: 'Apprenti', color: '#42A5F5', icon: 'school' };
  if (totalPracticed < 200 || overallAccuracy < 60) return { label: 'Confirmé', color: '#66BB6A', icon: 'shield-checkmark' };
  if (totalPracticed < 400 || overallAccuracy < 75) return { label: 'Avancé', color: '#AB47BC', icon: 'star' };
  return { label: 'Prêt pour l\'examen', color: '#FFB300', icon: 'trophy' };
}

export default function TrainingScreen() {
  const router = useRouter();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { selectedExamType } = useExamTypeStore();

  const [showDailyAnswer, setShowDailyAnswer] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['stats', 'overview', selectedExamType],
    queryFn: () => getStatsOverview(selectedExamType || undefined),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const { data: themeStats } = useQuery({
    queryKey: ['stats', 'by-theme', selectedExamType],
    queryFn: () => getStatsByTheme(selectedExamType || undefined),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const getThemeStat = (themeId: number): ThemeStat | undefined =>
    themeStats?.find((ts) => ts.themeId === themeId);

  const displayName = user?.displayName || 'Citoyen';
  const examDef = getExamType(selectedExamType);

  // ── Question of the Day ──
  const dailySeed = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const dailyQuestion = DAILY_QUESTIONS[dailySeed % DAILY_QUESTIONS.length];

  // ── Skill Level ──
  const overallAccuracy = stats?.overallAccuracy ?? 0;
  const skillLevel = getSkillLevel(stats?.totalPracticed || 0, overallAccuracy);

  const s = styles(c);

  return (
    <ScrollView
      style={[s.container]}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero Header ──────────────────────────────── */}
      <View style={[s.hero, { paddingTop: insets.top + 20 }]}>
        <View style={s.heroInner}>
          <View style={s.headerLeft}>
            <Text style={s.greeting}>Bonjour, {displayName}</Text>
            <Text style={s.heroSubtitle}>Préparez-vous pour réussir</Text>
            {/* ── Skill Level Badge ── */}
            <View style={[s.skillBadge, { backgroundColor: skillLevel.color + '30' }]}>
              <Ionicons name={skillLevel.icon} size={14} color={skillLevel.color} />
              <Text style={[s.skillBadgeText, { color: skillLevel.color }]}>{skillLevel.label}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={s.avatarButton}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person" size={20} color={c.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Exam Objective Banner (inside hero) ── */}
        {examDef && (
          <TouchableOpacity
            style={[s.objectiveBanner, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)' }]}
            onPress={() => router.push('/(tabs)/choose-exam')}
            activeOpacity={0.7}
          >
            <Text style={s.objectiveEmoji}>{examDef.emoji}</Text>
            <View style={s.objectiveContent}>
              <Text style={[s.objectiveLabel, { color: 'rgba(255,255,255,0.6)' }]}>Mon objectif</Text>
              <Text style={[s.objectiveTitle, { color: '#FFFFFF' }]}>{examDef.shortLabel}</Text>
            </View>
            <View style={[s.objectiveChange, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="swap-horizontal" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Quick Stats ─────────────────────────── */}
      <View style={s.statsRow}>
        <View style={s.statCard}>
          <View style={[s.statIconBg, { backgroundColor: c.primary + '18' }]}>
            <Ionicons name="help-circle" size={22} color={c.primary} />
          </View>
          <Text style={s.statValue}>{stats?.totalPracticed ?? 0}</Text>
          <Text style={s.statLabel}>Questions</Text>
        </View>
        <View style={s.statCard}>
          <View style={[s.statIconBg, { backgroundColor: c.success + '18' }]}>
            <Ionicons name="checkmark-circle" size={22} color={c.success} />
          </View>
          <Text style={s.statValue}>
            {stats?.overallAccuracy ? `${Math.round(stats.overallAccuracy)}%` : '0%'}
          </Text>
          <Text style={s.statLabel}>Précision</Text>
        </View>
        <View style={s.statCard}>
          <View style={[s.statIconBg, { backgroundColor: c.warning + '18' }]}>
            <Ionicons name="flame" size={22} color={c.warning} />
          </View>
          <Text style={s.statValue}>{stats?.currentStreak ?? 0}</Text>
          <Text style={s.statLabel}>Série</Text>
        </View>
      </View>

      {/* ── Question du Jour ─────────────────────── */}
      <View style={s.dailyCard}>
        <View style={s.dailyHeader}>
          <View style={s.dailyLabelRow}>
            <Ionicons name="calendar" size={14} color={c.primary} />
            <Text style={s.dailyLabel}>Question du jour</Text>
          </View>
        </View>
        <Text style={s.dailyQuestion}>{dailyQuestion.q}</Text>
        {showDailyAnswer ? (
          <View style={s.dailyAnswerBox}>
            <Text style={s.dailyAnswer}>{dailyQuestion.a}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={s.dailyButton}
            activeOpacity={0.7}
            onPress={() => setShowDailyAnswer(true)}
          >
            <Ionicons name="eye" size={16} color="#FFF" />
            <Text style={s.dailyButtonText}>Voir la réponse</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Continue Training ───────────────────── */}
      {stats?.lastPracticeAt && (
        <TouchableOpacity
          style={s.continueCard}
          activeOpacity={0.7}
          onPress={() => router.push('/train/random')}
        >
          <View style={s.continueLeft}>
            <View style={s.continueIconWrap}>
              <Ionicons name="play" size={24} color="#FFF" />
            </View>
            <View style={s.continueContent}>
              <Text style={s.continueTitle}>
                Continuer l'entraînement
              </Text>
              <Text style={s.continueSubtitle}>Reprendre o{'\u00f9'} vous en étiez</Text>
            </View>
          </View>
          <View style={s.continueArrowWrap}>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>
      )}

      {/* ── Random Quick Start ──────────────────── */}
      <TouchableOpacity
        style={s.randomCard}
        activeOpacity={0.7}
        onPress={() => router.push('/train/random')}
      >
        <View style={s.randomLeft}>
          <View style={s.randomIconWrap}>
            <Ionicons name="shuffle" size={24} color="#FFF" />
          </View>
          <View>
            <Text style={s.randomTitle}>Entraînement rapide</Text>
            <Text style={s.randomSubtitle}>10 questions aléatoires</Text>
          </View>
        </View>
        <View style={s.randomArrowWrap}>
          <Ionicons name="arrow-forward" size={18} color={c.primary} />
        </View>
      </TouchableOpacity>

      {/* ── Themes Section ──────────────────────── */}
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Thèmes</Text>
        <Text style={s.sectionSubtitle}>{THEMES.length} thèmes disponibles</Text>
      </View>

      {THEMES.map((theme) => {
        const iconName = THEME_ICONS[theme.icon] || 'ellipse';
        const ts = getThemeStat(theme.id);
        const accuracy = ts?.accuracy || 0;
        const answered = ts?.totalAnswered || 0;
        return (
          <View key={theme.id} style={s.themeBlock}>
            <View style={s.themeHeader}>
              <View style={[s.themeIconBadge, { backgroundColor: theme.color + '20' }]}>
                <Ionicons name={iconName} size={20} color={theme.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.themeName} numberOfLines={1}>{theme.nameFr}</Text>
                {answered > 0 && (
                  <View style={s.themeProgress}>
                    <View style={[s.themeProgressBar, { backgroundColor: c.progressBg }]}>
                      <View style={[s.themeProgressFill, { backgroundColor: accuracy >= 80 ? c.success : theme.color, width: `${Math.min(100, accuracy)}%` }]} />
                    </View>
                    <Text style={s.themeProgressText}>{accuracy}%</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Horizontal series scroll */}
            <FlatList
              data={[1, 2, 3, 4, 5]}
              keyExtractor={(item) => `${theme.id}-${item}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.seriesListContent}
              renderItem={({ item: seriesNum }) => {
                // Only count CORRECT answers for progression
                const correctAnswers = ts?.correctAnswers || 0;
                const seriesStart = (seriesNum - 1) * 20;
                const seriesCorrect = Math.max(0, Math.min(20, correctAnswers - seriesStart));
                const seriesProgress = seriesCorrect / 20;
                const isCompleted = seriesCorrect >= 20;
                const isStarted = seriesCorrect > 0;

                return (
                  <TouchableOpacity
                    style={s.seriesCard}
                    activeOpacity={0.7}
                    onPress={() => router.push(`/train/${theme.id}?series=${seriesNum}`)}
                  >
                    {/* Colored top area */}
                    <View style={[s.seriesColorArea, { backgroundColor: theme.color + '18' }]}>
                      <Text style={[s.seriesNumberLarge, { color: theme.color }]}>
                        {seriesNum}
                      </Text>
                      {isCompleted && (
                        <View style={[s.seriesCompleteBadge, { backgroundColor: c.success }]}>
                          <Ionicons name="checkmark" size={12} color="#FFF" />
                        </View>
                      )}
                    </View>
                    {/* Bottom info area */}
                    <View style={s.seriesInfoArea}>
                      <Text style={s.seriesLabel}>Série {seriesNum}</Text>
                      <Text style={s.seriesQuestions}>20 questions</Text>
                      <View style={[s.seriesProgressBar, { backgroundColor: c.progressBg }]}>
                        <View style={[s.seriesProgressFill, {
                          backgroundColor: isCompleted ? c.success : theme.color,
                          width: `${seriesProgress * 100}%`,
                        }]} />
                      </View>
                      <Text style={[s.seriesProgressLabel, { color: isCompleted ? c.success : c.textTertiary }]}>
                        {isCompleted ? '✓ Terminée' : isStarted ? `${seriesCorrect}/20` : 'Commencer'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        );
      })}

      {/* Bottom spacer */}
      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = (c: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      paddingBottom: spacing.xxxl + 20,
    },

    // ── Hero ────────────────────────────
    hero: {
      backgroundColor: c.primary,
      paddingHorizontal: spacing.xl + 4,
      paddingBottom: 28,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      marginBottom: -14,
    },
    heroInner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    headerLeft: {
      flex: 1,
    },
    greeting: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: -0.5,
    },
    heroSubtitle: {
      fontSize: 15,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 4,
    },
    examBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: spacing.xs,
      marginTop: spacing.md,
      backgroundColor: 'rgba(255,255,255,0.15)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.round,
    },
    examBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    avatarButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },

    // ── Skill Level Badge ─────────────────
    skillBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 6,
      marginTop: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.round,
    },
    skillBadgeText: {
      fontSize: 12,
      fontWeight: '700',
    },

    // ── Objective Banner ────────────────
    objectiveBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.xl,
      marginTop: spacing.lg,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
    },
    objectiveEmoji: {
      fontSize: 32,
      marginRight: spacing.md,
    },
    objectiveContent: {
      flex: 1,
    },
    objectiveLabel: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 2,
    },
    objectiveTitle: {
      fontSize: fontSize.lg,
      fontWeight: '700',
    },
    objectiveChange: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Stats ───────────────────────────
    statsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: 28,
      marginBottom: 28,
      paddingHorizontal: spacing.xl,
    },
    statCard: {
      flex: 1,
      backgroundColor: c.surface,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.lg + 4,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    statIconBg: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm + 2,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '800',
      color: c.textPrimary,
      letterSpacing: -0.5,
    },
    statLabel: {
      fontSize: 12,
      color: c.textTertiary,
      marginTop: 3,
      fontWeight: '500',
    },

    // ── Question du Jour ──────────────────
    dailyCard: {
      backgroundColor: c.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      marginHorizontal: spacing.xl,
      marginBottom: spacing.lg,
      borderWidth: 1.5,
      borderColor: c.primary + '25',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    dailyHeader: {
      marginBottom: spacing.md,
    },
    dailyLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    dailyLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: c.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    dailyQuestion: {
      fontSize: 16,
      fontWeight: '600',
      color: c.textPrimary,
      lineHeight: 24,
      marginBottom: spacing.lg,
    },
    dailyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: c.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.md,
      alignSelf: 'flex-start',
    },
    dailyButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    dailyAnswerBox: {
      backgroundColor: c.primary + '10',
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      borderLeftWidth: 3,
      borderLeftColor: c.primary,
    },
    dailyAnswer: {
      fontSize: 15,
      fontWeight: '500',
      color: c.textPrimary,
      lineHeight: 22,
    },

    // ── Continue ────────────────────────
    continueCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.primary,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      marginHorizontal: spacing.xl,
      marginBottom: spacing.lg,
      shadowColor: c.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    continueLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    continueIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    continueContent: {
      flex: 1,
      marginLeft: spacing.lg,
    },
    continueTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    continueSubtitle: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 3,
    },
    continueArrowWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Random ──────────────────────────
    randomCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      marginHorizontal: spacing.xl,
      marginBottom: 32,
      borderWidth: 1.5,
      borderColor: c.primary + '20',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    randomLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
    },
    randomIconWrap: {
      width: 46,
      height: 46,
      borderRadius: borderRadius.md,
      backgroundColor: c.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    randomTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: c.textPrimary,
    },
    randomSubtitle: {
      fontSize: 13,
      color: c.textSecondary,
      marginTop: 3,
    },
    randomArrowWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: c.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Quick Links ──────────────────────
    quickLinksRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: spacing.xl,
      marginBottom: spacing.xxl,
    },
    quickLink: {
      flex: 1,
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
    },
    quickLinkText: {
      fontSize: fontSize.xs,
      fontWeight: '600',
    },

    // ── Section Header ──────────────────
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.xl,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: c.textPrimary,
      letterSpacing: -0.3,
    },
    sectionSubtitle: {
      fontSize: 13,
      color: c.textTertiary,
    },

    // ── Theme Block ─────────────────────
    themeBlock: {
      marginBottom: 32,
    },
    themeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.xl,
    },
    themeIconBadge: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeName: {
      fontSize: 17,
      fontWeight: '600',
      color: c.textPrimary,
    },
    themeProgress: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: 5,
    },
    themeProgressBar: {
      height: 4,
      flex: 1,
      borderRadius: 2,
      overflow: 'hidden',
    },
    themeProgressFill: {
      height: '100%',
      borderRadius: 2,
    },
    themeProgressText: {
      fontSize: 12,
      fontWeight: '600',
      color: c.textTertiary,
      width: 32,
      textAlign: 'right',
    },

    // ── Series Cards ────────────────────
    seriesListContent: {
      gap: spacing.lg,
      paddingHorizontal: spacing.xl,
    },
    seriesCard: {
      width: 164,
      height: 148,
      backgroundColor: c.surface,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    seriesColorArea: {
      height: '40%',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    seriesNumberLarge: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    seriesCompleteBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    seriesInfoArea: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm + 2,
      paddingBottom: spacing.sm,
      justifyContent: 'center',
    },
    seriesLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: c.textPrimary,
      marginBottom: 2,
    },
    seriesQuestions: {
      fontSize: 11,
      color: c.textTertiary,
      marginBottom: spacing.sm,
    },
    seriesCardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    seriesNumber: {
      fontSize: fontSize.md,
      fontWeight: '600',
      color: c.textPrimary,
      marginBottom: spacing.xs,
    },
    seriesProgressBar: {
      height: 4,
      borderRadius: 2,
      overflow: 'hidden',
      marginBottom: 4,
    },
    seriesProgressFill: {
      height: '100%',
      borderRadius: 2,
    },
    seriesProgressLabel: {
      fontSize: 11,
      fontWeight: '600',
    },
  });
