import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from '../../components/ui/MotiView';
import { THEMES } from '@civique/shared';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useExamTypeStore, getExamType } from '../../stores/examTypeStore';
import { useLanguageStore } from '../../stores/languageStore';
import { LANGUAGES, type Language } from '@civique/shared';
import { getRandomQuestions } from '../../services/questions';
import type { Question } from '@civique/shared';
import { AnimatedPressable, AnimatedCard, CMotif } from '../../components/ui';
import FlashcardQuizSession from '../../components/FlashcardQuizSession';

const THEME_EMOJIS: Record<number, string> = {
  1: '🇫🇷',
  2: '🏛️',
  3: '⚖️',
  4: '📜',
  5: '🤝',
};

const SESSION_SIZE = 10;
const KNOWLEDGE_COUNT = 7;
const SITUATIONAL_COUNT = 3;

export default function FlashcardsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { selectedExamType } = useExamTypeStore();
  const { currentLang, setLanguage } = useLanguageStore();

  const [sessionQuestions, setSessionQuestions] = useState<Question[] | null>(null);
  const [sessionThemeId, setSessionThemeId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const examDef = getExamType(selectedExamType);

  const cycleLang = async () => {
    const codes = LANGUAGES.map((l) => l.code);
    const idx = codes.indexOf(currentLang);
    const next = codes[(idx + 1) % codes.length];
    await setLanguage(next as Language);
  };

  const currentLangLabel = currentLang === 'fr' ? 'Français uniquement' :
    LANGUAGES.find((l) => l.code === currentLang)?.nativeName || 'Français';

  // ── Start a mixed session (7 knowledge + 3 situational) ──
  const startMixedSession = useCallback(async (themeId?: number) => {
    setLoading(true);
    try {
      const [knowledgeQs, situationalQs] = await Promise.all([
        getRandomQuestions({
          count: KNOWLEDGE_COUNT,
          themeId,
          examType: selectedExamType || undefined,
          lang: currentLang !== 'fr' ? currentLang as Language : undefined,
        }),
        getRandomQuestions({
          count: SITUATIONAL_COUNT,
          themeId,
          examType: selectedExamType || undefined,
          lang: currentLang !== 'fr' ? currentLang as Language : undefined,
        }),
      ]);

      // Combine and shuffle
      const combined = [...knowledgeQs, ...situationalQs]
        .sort(() => Math.random() - 0.5)
        .slice(0, SESSION_SIZE);

      if (combined.length > 0) {
        setSessionQuestions(combined);
        setSessionThemeId(themeId ?? null);
        setModalVisible(true);
      }
    } catch (err) {
      console.error('Failed to load flashcard questions:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedExamType, currentLang]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSessionQuestions(null);
    setSessionThemeId(null);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Header ─────────────────────── */}
        <LinearGradient
          colors={c.gradientHero}
          style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}
        >
          <CMotif size="xl" color="#FFFFFF" opacity="subtle" rotation={30} style={{ top: 10, right: -25 }} />
          <CMotif size="md" color="#4D7CFF" opacity="subtle" rotation={-60} style={{ bottom: 20, left: -10 }} />

          <MotiView from={{ opacity: 0, translateY: 15 }} animate={{ opacity: 1, translateY: 0 }}>
            <Text style={styles.heroTitle}>Flashcards</Text>
            <Text style={styles.heroSubtitle}>
              Sessions de {SESSION_SIZE} questions{'\n'}
              {KNOWLEDGE_COUNT} connaissances + {SITUATIONAL_COUNT} mises en situation
            </Text>
          </MotiView>

          {/* Exam objective badge */}
          {examDef && (
            <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 150 }}>
              <View style={styles.examBadge}>
                <Text style={styles.examEmoji}>{examDef.emoji}</Text>
                <Text style={styles.examLabel}>{examDef.shortLabel}</Text>
              </View>
            </MotiView>
          )}
        </LinearGradient>

        <View style={styles.body}>
          {/* Language selector */}
          <AnimatedCard delay={100}>
            <AnimatedPressable onPress={cycleLang} haptic={false}>
              <View style={[styles.langSelector, { backgroundColor: c.primaryLight }]}>
                <Ionicons name="language" size={16} color={c.primary} />
                <Text style={[styles.langText, { color: c.primary }]}>
                  {currentLang === 'fr' ? 'FR' : `FR + ${currentLangLabel}`}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={c.primary} />
              </View>
            </AnimatedPressable>
          </AnimatedCard>

          {/* Quick session button */}
          <AnimatedCard delay={200}>
            <AnimatedPressable onPress={() => startMixedSession()} scaleDown={0.97}>
              <LinearGradient
                colors={c.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickButton}
              >
                <View style={styles.quickIconWrap}>
                  <Ionicons name="shuffle" size={24} color="#FFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.quickTitle}>Session rapide</Text>
                  <Text style={styles.quickSubtitle}>
                    {SESSION_SIZE} questions de tous les thèmes
                  </Text>
                </View>
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                )}
              </LinearGradient>
            </AnimatedPressable>
          </AnimatedCard>

          {/* Info card about mise en situation */}
          <AnimatedCard delay={300}>
            <View style={[styles.infoCard, { backgroundColor: c.warningBg, borderColor: c.warning + '30' }]}>
              <Ionicons name="information-circle" size={20} color={c.warning} />
              <Text style={[styles.infoText, { color: c.textPrimary }]}>
                Chaque session inclut des <Text style={{ fontWeight: '700' }}>mises en situation</Text> comme dans le vrai examen (12/40 questions).
              </Text>
            </View>
          </AnimatedCard>

          {/* Theme sections */}
          <AnimatedCard delay={400}>
            <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>Par thème</Text>
          </AnimatedCard>

          {THEMES.map((theme, i) => {
            const emoji = THEME_EMOJIS[theme.id] || '📚';
            return (
              <AnimatedCard key={theme.id} delay={500 + i * 80}>
                <AnimatedPressable onPress={() => startMixedSession(theme.id)} scaleDown={0.98}>
                  <View style={[styles.themeCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                    <View style={[styles.themeIcon, { backgroundColor: theme.color + '15' }]}>
                      <Text style={{ fontSize: 26 }}>{emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.themeName, { color: c.textPrimary }]} numberOfLines={1}>
                        {theme.nameFr}
                      </Text>
                      <Text style={[styles.themeDetail, { color: c.textSecondary }]}>
                        {SESSION_SIZE} questions · Mix connaissances + situations
                      </Text>
                    </View>
                    <View style={[styles.playBadge, { backgroundColor: theme.color + '18' }]}>
                      <Ionicons name="play" size={16} color={theme.color} />
                    </View>
                  </View>
                </AnimatedPressable>
              </AnimatedCard>
            );
          })}
        </View>
      </ScrollView>

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={c.primary} />
          <Text style={[styles.loadingText, { color: c.textPrimary }]}>Chargement des questions...</Text>
        </View>
      )}

      {/* Session modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="fullScreen" statusBarTranslucent>
        <View style={{ flex: 1, backgroundColor: c.background, paddingTop: insets.top }}>
          {/* Close button */}
          <View style={styles.modalHeader}>
            <AnimatedPressable onPress={closeModal} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={c.textPrimary} />
            </AnimatedPressable>
            <Text style={[styles.modalTitle, { color: c.textSecondary }]}>
              {sessionThemeId
                ? THEMES.find(t => t.id === sessionThemeId)?.nameFr
                : 'Session mixte'}
            </Text>
            <View style={{ width: 44 }} />
          </View>

          {sessionQuestions && sessionQuestions.length > 0 ? (
            <FlashcardQuizSession
              questions={sessionQuestions}
              onClose={closeModal}
            />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
              <Ionicons name="albums-outline" size={48} color={c.textTertiary} />
              <Text style={{ fontSize: fontSize.lg, color: c.textSecondary, marginTop: spacing.lg, textAlign: 'center' }}>
                Aucune question disponible
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
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
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
  },
  examBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.round,
  },
  examEmoji: { fontSize: 18 },
  examLabel: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },

  body: { padding: spacing.xl, paddingTop: spacing.xxl },

  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginBottom: spacing.xl,
  },
  langText: { fontSize: fontSize.sm, fontWeight: '600' },

  quickButton: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  quickIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  quickTitle: { fontSize: fontSize.lg, fontWeight: '700', color: '#FFF' },
  quickSubtitle: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  infoText: { fontSize: fontSize.sm, flex: 1, lineHeight: 20 },

  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },

  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  themeIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  themeName: { fontSize: fontSize.md, fontWeight: '600', marginBottom: 2 },
  themeDetail: { fontSize: fontSize.xs },
  playBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  loadingText: { fontSize: fontSize.md, fontWeight: '600' },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  modalTitle: { fontSize: fontSize.md, fontWeight: '600' },
});
