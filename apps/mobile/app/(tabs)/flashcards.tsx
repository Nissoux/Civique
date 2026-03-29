import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEMES } from '@civique/shared';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FlashcardSession from '../../components/FlashcardSession';
import { useFlashcardStore, type Flashcard } from '../../stores/flashcardStore';
import { useLanguageStore } from '../../stores/languageStore';
import { LANGUAGES, type Language } from '@civique/shared';
import { FLASHCARDS } from '../../data/flashcards';

// ── Placeholder card data per theme (replace with real data source) ──
// In production, load these from an API or local DB.
// For now we define a helper so the UI is fully functional.
// Cast to Flashcard type (data file has same shape)
const ALL_CARDS: Flashcard[] = FLASHCARDS as unknown as Flashcard[];

// Map Lucide-style icon names from THEMES to Ionicons equivalents
const ICON_MAP: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  flag: 'flag',
  landmark: 'business',
  scale: 'scale',
  'book-open': 'book',
  home: 'home',
};

export default function FlashcardsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { progress, loadProgress, markCard, getThemeProgress } = useFlashcardStore();
  const { currentLang, setLanguage } = useLanguageStore();

  const [allCards] = useState<Flashcard[]>(ALL_CARDS);
  const [sessionCards, setSessionCards] = useState<Flashcard[] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const availableLangs = LANGUAGES;

  const cycleLang = async () => {
    const codes = availableLangs.map((l) => l.code);
    const idx = codes.indexOf(currentLang);
    const next = codes[(idx + 1) % codes.length];
    await setLanguage(next as Language);
  };

  const currentLangLabel = currentLang === 'fr' ? 'Français uniquement' :
    LANGUAGES.find((l) => l.code === currentLang)?.nativeName || 'Français';

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // ── Quick review: random 20 cards from all themes ──
  const startQuickReview = useCallback(() => {
    if (allCards.length === 0) return;
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    setSessionCards(shuffled.slice(0, Math.min(20, shuffled.length)));
    setModalVisible(true);
  }, [allCards]);

  // ── Start theme-specific session ──
  const startThemeSession = useCallback(
    (themeId: number) => {
      const themeCards = allCards.filter((card) => card.themeId === themeId);
      if (themeCards.length === 0) return;
      const shuffled = [...themeCards].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
      setModalVisible(true);
    },
    [allCards]
  );

  // ── Handle session completion ──
  const handleComplete = useCallback(
    async (results: { known: number[]; unknown: number[] }) => {
      for (const id of results.known) {
        await markCard(id, 'known');
      }
      for (const id of results.unknown) {
        await markCard(id, 'unknown');
      }
    },
    [markCard]
  );

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSessionCards(null);
  }, []);

  // ── Compute per-theme stats ──
  const themeStats = useMemo(() => {
    return THEMES.map((theme) => {
      const themeCards = allCards.filter((card) => card.themeId === theme.id);
      const knownCount = themeCards.filter((card) => progress[card.id] === 'known').length;
      return {
        theme,
        total: themeCards.length,
        known: knownCount,
        pct: themeCards.length > 0 ? (knownCount / themeCards.length) * 100 : 0,
      };
    });
  }, [allCards, progress]);

  const totalCards = allCards.length;
  const totalKnown = Object.values(progress).filter((s) => s === 'known').length;

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.xxl, paddingTop: insets.top + spacing.xl }}>
        {/* Header */}
        <Text
          style={{
            fontSize: fontSize.title,
            fontWeight: '700',
            color: c.textPrimary,
            marginBottom: spacing.xs,
          }}
        >
          Fiches mémo
        </Text>
        <Text
          style={{
            fontSize: fontSize.md,
            color: c.textSecondary,
            marginBottom: spacing.xxl,
          }}
        >
          Révisez les notions clés avec des cartes interactives
        </Text>

        {/* Language selector */}
        <TouchableOpacity
          onPress={cycleLang}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: spacing.sm,
            backgroundColor: c.primaryLight,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.round,
            marginBottom: spacing.xl,
          }}
        >
          <Ionicons name="language" size={16} color={c.primary} />
          <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: c.primary }}>
            {currentLang === 'fr' ? 'FR' : `FR + ${currentLangLabel}`}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={c.primary} />
        </TouchableOpacity>

        {/* Quick review button */}
        <TouchableOpacity
          style={{
            backgroundColor: c.primary,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.xxl,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={startQuickReview}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.lg,
            }}
          >
            <Ionicons name="shuffle" size={24} color={c.textInverse} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: fontSize.lg, fontWeight: '700', color: c.textInverse }}>
              Révision rapide
            </Text>
            <Text style={{ fontSize: fontSize.sm, color: c.textInverse, opacity: 0.8, marginTop: 2 }}>
              20 cartes aléatoires de tous les thèmes
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color={c.textInverse} />
        </TouchableOpacity>

        {/* Global progress */}
        {totalCards > 0 && (
          <View
            style={{
              backgroundColor: c.card,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              marginBottom: spacing.xxl,
              borderWidth: 1,
              borderColor: c.border,
            }}
          >
            <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: c.textSecondary, marginBottom: spacing.sm }}>
              Progression globale
            </Text>
            <View style={{ height: 6, borderRadius: 3, backgroundColor: c.progressBg, overflow: 'hidden' }}>
              <View
                style={{
                  height: '100%',
                  width: `${totalCards > 0 ? (totalKnown / totalCards) * 100 : 0}%`,
                  backgroundColor: c.success,
                  borderRadius: 3,
                }}
              />
            </View>
            <Text style={{ fontSize: fontSize.xs, color: c.textTertiary, marginTop: spacing.xs }}>
              {totalKnown} maîtrisées / {totalCards}
            </Text>
          </View>
        )}

        {/* Theme packs */}
        <Text
          style={{
            fontSize: fontSize.lg,
            fontWeight: '700',
            color: c.textPrimary,
            marginBottom: spacing.lg,
          }}
        >
          Par thème
        </Text>

        {themeStats.map(({ theme, total, known: knownCount, pct }) => {
          const iconName = ICON_MAP[theme.icon] || 'folder';
          return (
            <TouchableOpacity
              key={theme.id}
              style={{
                backgroundColor: c.card,
                borderRadius: borderRadius.lg,
                padding: spacing.xl,
                marginBottom: spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: c.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
              onPress={() => startThemeSession(theme.id)}
            >
              {/* Theme icon */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: borderRadius.md,
                  backgroundColor: theme.color + '18',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.lg,
                }}
              >
                <Ionicons name={iconName} size={24} color={theme.color} />
              </View>

              {/* Theme info */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: fontSize.md,
                    fontWeight: '600',
                    color: c.textPrimary,
                    marginBottom: 2,
                  }}
                  numberOfLines={1}
                >
                  {theme.nameFr}
                </Text>
                <Text style={{ fontSize: fontSize.sm, color: c.textSecondary, marginBottom: spacing.sm }}>
                  {total} cartes
                </Text>

                {/* Progress bar */}
                <View style={{ height: 4, borderRadius: 2, backgroundColor: c.progressBg, overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: theme.color,
                      borderRadius: 2,
                    }}
                  />
                </View>
                <Text style={{ fontSize: fontSize.xs, color: c.textTertiary, marginTop: 3 }}>
                  {knownCount} maîtrisées / {total}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color={c.textTertiary} style={{ marginLeft: spacing.sm }} />
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Flashcard session modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
          {/* Close button */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: spacing.xxl,
              paddingVertical: spacing.md,
            }}
          >
            <TouchableOpacity onPress={closeModal} style={{ padding: spacing.sm }}>
              <Ionicons name="close" size={28} color={c.textPrimary} />
            </TouchableOpacity>
            <Text style={{ fontSize: fontSize.md, fontWeight: '600', color: c.textSecondary }}>
              Fiches mémo
            </Text>
            <View style={{ width: 44 }} />
          </View>

          {sessionCards && sessionCards.length > 0 ? (
            <FlashcardSession cards={sessionCards} onComplete={handleComplete} />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
              <Ionicons name="albums-outline" size={48} color={c.textTertiary} />
              <Text
                style={{
                  fontSize: fontSize.lg,
                  color: c.textSecondary,
                  marginTop: spacing.lg,
                  textAlign: 'center',
                }}
              >
                Aucune carte disponible pour ce thème
              </Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}
