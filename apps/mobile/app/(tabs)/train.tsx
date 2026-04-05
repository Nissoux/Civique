import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { THEMES } from '@civique/shared';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useExamTypeStore } from '../../stores/examTypeStore';

const QUESTIONS_PER_SERIES = 20;

// Number of series per theme — first 2 free, rest premium
const SERIES_PER_THEME: Record<number, number> = {
  1: 5,
  2: 5,
  3: 4,
  4: 5,
  5: 4,
};

const FREE_SERIES_COUNT = 2;

interface SeriesInfo {
  themeId: number;
  seriesNumber: number;
  isPremium: boolean;
  progress: number;
  total: number;
}

function buildSeries(themeId: number): SeriesInfo[] {
  const count = SERIES_PER_THEME[themeId] ?? 3;
  return Array.from({ length: count }, (_, i) => ({
    themeId,
    seriesNumber: i + 1,
    isPremium: i + 1 > FREE_SERIES_COUNT,
    progress: 0,
    total: QUESTIONS_PER_SERIES,
  }));
}

function SeriesCard({
  series,
  themeColor,
  colors,
  onPress,
}: {
  series: SeriesInfo;
  themeColor: string;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  const progressPercent = series.total > 0 ? series.progress / series.total : 0;

  return (
    <TouchableOpacity
      style={[
        styles.seriesCard,
        {
          backgroundColor: colors.card,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Top colored area */}
      <View style={[styles.seriesTopArea, { backgroundColor: themeColor + '18' }]}>
        <Text style={[styles.seriesNumberText, { color: themeColor }]}>
          {String(series.seriesNumber).padStart(2, '0')}
        </Text>
        {/* Premium badge */}
        {series.isPremium && (
          <View style={[styles.premiumBadge, { backgroundColor: colors.premiumBg }]}>
            <Text style={styles.crownIcon}>{'\u{1F451}'}</Text>
            <Text style={[styles.premiumLabel, { color: colors.premiumText }]}>
              PRO
            </Text>
          </View>
        )}
      </View>

      {/* Bottom info area */}
      <View style={styles.seriesBottomArea}>
        <Text style={[styles.seriesTitle, { color: colors.textPrimary }]}>
          Série n{'\u00b0'}{series.seriesNumber}
        </Text>

        <Text style={[styles.seriesSubtitle, { color: colors.textTertiary }]}>
          {QUESTIONS_PER_SERIES} questions
        </Text>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={[styles.progressBarBg, { backgroundColor: colors.progressBg }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: themeColor,
                  width: `${progressPercent * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {series.progress}/{series.total}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function TrainScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedExamType } = useExamTypeStore();

  const examLabel = selectedExamType
    ? selectedExamType === 'nat'
      ? 'Nationalité'
      : selectedExamType === 'cr'
      ? 'Carte de résident'
      : 'CSP'
    : null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Entraînement
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Progressez série par série
          </Text>
        </View>
        {examLabel && (
          <View style={[styles.examBadge, { backgroundColor: colors.primary }]}>
            <Ionicons name="school-outline" size={13} color="#FFFFFF" />
            <Text style={styles.examBadgeText}>
              {examLabel}
            </Text>
          </View>
        )}
      </View>

      {/* Random training card */}
      <TouchableOpacity
        style={[
          styles.randomCard,
          {
            backgroundColor: colors.primary,
          },
        ]}
        onPress={() => router.push('/train/random')}
        activeOpacity={0.8}
      >
        <View style={styles.randomCardInner}>
          <View style={styles.randomIconCircle}>
            <Ionicons name="shuffle" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.randomTextBlock}>
            <Text style={styles.randomTitle}>Mode aléatoire</Text>
            <Text style={styles.randomSubtitle}>
              10 questions de tous les thèmes
            </Text>
          </View>
          <View style={styles.randomArrow}>
            <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Theme sections */}
      {THEMES.map((theme) => {
        const seriesList = buildSeries(theme.id);

        return (
          <View key={theme.id} style={styles.themeSection}>
            {/* Section header */}
            <View style={[styles.sectionHeader, { backgroundColor: theme.color + '10' }]}>
              <View style={[styles.themeDot, { backgroundColor: theme.color }]} />
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                {theme.nameFr}
              </Text>
              <Text style={[styles.sectionCount, { color: colors.textTertiary }]}>
                {seriesList.length} séries
              </Text>
            </View>

            {/* Horizontal series scroll */}
            <FlatList
              data={seriesList}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${theme.id}-${item.seriesNumber}`}
              contentContainerStyle={styles.seriesListContent}
              renderItem={({ item }) => (
                <SeriesCard
                  series={item}
                  themeColor={theme.color}
                  colors={colors}
                  onPress={() =>
                    router.push(
                      `/train/${theme.id}?series=${item.seriesNumber}` as any
                    )
                  }
                />
              )}
            />
          </View>
        );
      })}

      {/* Bottom spacer for tab bar */}
      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  examBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginTop: 4,
  },
  examBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },

  // Random card
  randomCard: {
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: 36,
    overflow: 'hidden',
    shadowColor: '#002395',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  randomCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: spacing.xl,
  },
  randomIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  randomTextBlock: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  randomTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  randomSubtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 3,
  },
  randomArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Theme sections
  themeSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
  },
  themeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  sectionCount: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },

  // Series list
  seriesListContent: {
    paddingHorizontal: spacing.xl,
    gap: 14,
  },

  // Series card
  seriesCard: {
    width: 170,
    minHeight: 150,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  seriesTopArea: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  seriesNumberText: {
    fontSize: 28,
    fontWeight: '800',
  },
  premiumBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.round,
    gap: 3,
  },
  crownIcon: {
    fontSize: 10,
  },
  premiumLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  seriesBottomArea: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    justifyContent: 'center',
  },
  seriesTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: 3,
  },
  seriesSubtitle: {
    fontSize: fontSize.xs,
    marginBottom: spacing.sm,
  },

  // Progress
  progressSection: {
    marginTop: 'auto',
  },
  progressBarBg: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
