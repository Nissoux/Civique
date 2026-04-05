import { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEMES } from '@civique/shared';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useLanguageStore } from '../../stores/languageStore';
import { GLOSSARY, type GlossaryTerm } from '../../data/glossaire';
import { LANGUAGES, type Language } from '@civique/shared';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const THEME_SHORT_NAMES: Record<number, string> = {
  1: 'Principes',
  2: 'Institutions',
  3: 'Droits',
  4: 'Histoire',
  5: 'Société',
};

export default function GlossaireScreen() {
  const router = useRouter();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { currentLang, setLanguage } = useLanguageStore();

  const cycleLang = async () => {
    const codes = LANGUAGES.map((l) => l.code);
    const idx = codes.indexOf(currentLang);
    const next = codes[(idx + 1) % codes.length];
    await setLanguage(next as Language);
  };

  const langLabel = currentLang === 'fr' ? 'FR'
    : `FR + ${LANGUAGES.find((l) => l.code === currentLang)?.nativeName || ''}`;

  const [search, setSearch] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getTranslatedTerm = useCallback(
    (term: GlossaryTerm): string => {
      if (currentLang === 'fr') return term.term;
      const t = term.translations[currentLang as keyof typeof term.translations];
      return t?.term || term.term;
    },
    [currentLang],
  );

  const getTranslatedDefinition = useCallback(
    (term: GlossaryTerm): string => {
      if (currentLang === 'fr') return term.definition;
      const t = term.translations[currentLang as keyof typeof term.translations];
      return t?.definition || term.definition;
    },
    [currentLang],
  );

  const filteredTerms = useMemo(() => {
    let terms = [...GLOSSARY];

    if (selectedTheme !== null) {
      terms = terms.filter((t) => t.themeId === selectedTheme);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      terms = terms.filter((t) => {
        const frMatch = t.term.toLowerCase().includes(q);
        const translatedMatch = getTranslatedTerm(t).toLowerCase().includes(q);
        return frMatch || translatedMatch;
      });
    }

    terms.sort((a, b) => a.term.localeCompare(b.term, 'fr'));
    return terms;
  }, [search, selectedTheme, getTranslatedTerm]);

  const handleExpand = useCallback((id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const getThemeColor = useCallback((themeId: number): string => {
    return THEMES.find((t) => t.id === themeId)?.color || '#999';
  }, []);

  const s = styles(c);

  const renderItem = useCallback(
    ({ item }: { item: GlossaryTerm }) => {
      const isExpanded = expandedId === item.id;
      const themeColor = getThemeColor(item.themeId);
      const showTranslation = currentLang !== 'fr';

      return (
        <TouchableOpacity
          style={[s.termCard, isExpanded && s.termCardExpanded]}
          activeOpacity={0.7}
          onPress={() => handleExpand(item.id)}
        >
          <View style={s.termHeader}>
            <View style={[s.themeDot, { backgroundColor: themeColor }]} />
            <View style={s.termContent}>
              <Text style={s.termText}>{item.term}</Text>
              <Text style={s.definitionText} numberOfLines={isExpanded ? undefined : 2}>
                {item.definition}
              </Text>
            </View>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={c.textTertiary}
            />
          </View>

          {isExpanded && showTranslation && getTranslatedTerm(item) !== item.term && (
            <View style={[s.translationBlock, { borderLeftColor: themeColor }]}>
              <Text style={s.translationTerm}>{getTranslatedTerm(item)}</Text>
              <Text style={s.translationDefinition}>
                {getTranslatedDefinition(item)}
              </Text>
            </View>
          )}

          {isExpanded && (
            <View style={s.themeBadgeRow}>
              <View style={[s.themeBadge, { backgroundColor: themeColor + '18' }]}>
                <Text style={[s.themeBadgeText, { color: themeColor }]}>
                  {THEME_SHORT_NAMES[item.themeId]}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [expandedId, currentLang, c, s, getTranslatedTerm, getTranslatedDefinition, getThemeColor, handleExpand],
  );

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      {/* ── Header ────────────────────────── */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Glossaire</Text>
          <Text style={{ fontSize: fontSize.sm, color: c.textSecondary }}>{filteredTerms.length} termes</Text>
        </View>
        <TouchableOpacity
          onPress={cycleLang}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: c.primaryLight,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.round,
          }}
        >
          <Ionicons name="language" size={16} color={c.primary} />
          <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: c.primary }}>{langLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ────────────────────── */}
      <View style={s.searchContainer}>
        <Ionicons name="search" size={18} color={c.textTertiary} style={s.searchIcon} />
        <TextInput
          style={s.searchInput}
          placeholder="Rechercher un terme..."
          placeholderTextColor={c.textTertiary}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={s.clearButton}>
            <Ionicons name="close-circle" size={18} color={c.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Theme Filter Pills ────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.pillsContainer}
        style={{ minHeight: 44, maxHeight: 44, flexGrow: 0, flexShrink: 0 }}
      >
        <TouchableOpacity
          style={[s.pill, { backgroundColor: selectedTheme === null ? c.primary : c.surface, borderColor: selectedTheme === null ? c.primary : c.border }]}
          activeOpacity={0.7}
          onPress={() => setSelectedTheme(null)}
        >
          <Text style={[s.pillText, { color: selectedTheme === null ? '#FFFFFF' : c.textSecondary }]}>Tout</Text>
        </TouchableOpacity>
        {THEMES.map((theme) => {
          const isActive = selectedTheme === theme.id;
          return (
            <TouchableOpacity
              key={theme.id}
              style={[
                s.pill,
                {
                  backgroundColor: isActive ? theme.color : c.surface,
                  borderColor: isActive ? theme.color : c.border,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => setSelectedTheme(isActive ? null : theme.id)}
            >
              <Text style={[s.pillText, { color: isActive ? '#FFFFFF' : c.textSecondary }]}>
                {THEME_SHORT_NAMES[theme.id]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Spacer ─────────────────── */}
      <View style={{ height: spacing.md }}>
      </View>

      {/* ── Terms List ────────────────────── */}
      <FlatList
        data={filteredTerms}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Ionicons name="book-outline" size={48} color={c.textTertiary} />
            <Text style={s.emptyText}>Aucun terme trouv{'\u00e9'}</Text>
            <Text style={s.emptySubtext}>Essayez un autre mot-cl{'\u00e9'}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = (c: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },

    // ── Header ───────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: fontSize.xl,
      fontWeight: '700',
      color: c.textPrimary,
      letterSpacing: -0.3,
    },

    // ── Search ───────────────────────────
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: borderRadius.md,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: c.border,
      height: 46,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.md,
      color: c.textPrimary,
      paddingVertical: 0,
    },
    clearButton: {
      padding: spacing.xs,
    },

    // ── Pills ────────────────────────────
    pillsContainer: {
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      alignItems: 'center',
    },
    pill: {
      paddingHorizontal: spacing.lg,
      paddingVertical: 8,
      borderRadius: borderRadius.round,
      borderWidth: 1,
      height: 36,
      justifyContent: 'center',
    },
    pillText: {
      fontSize: fontSize.sm,
      fontWeight: '600',
    },

    // ── Results ──────────────────────────
    resultsRow: {
      paddingHorizontal: spacing.xl,
      marginBottom: spacing.sm,
    },
    resultsText: {
      fontSize: fontSize.xs,
      color: c.textTertiary,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // ── List ─────────────────────────────
    listContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxxl + 40,
    },

    // ── Term Card ────────────────────────
    termCard: {
      backgroundColor: c.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginBottom: spacing.sm + 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    termCardExpanded: {
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    termHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    themeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginTop: 7,
      marginRight: spacing.md,
    },
    termContent: {
      flex: 1,
      marginRight: spacing.sm,
    },
    termText: {
      fontSize: fontSize.md,
      fontWeight: '700',
      color: c.textPrimary,
      marginBottom: 4,
    },
    definitionText: {
      fontSize: fontSize.sm,
      color: c.textSecondary,
      lineHeight: 19,
    },

    // ── Translation Block ────────────────
    translationBlock: {
      marginTop: spacing.md,
      paddingTop: spacing.md,
      paddingLeft: spacing.lg,
      borderLeftWidth: 3,
      marginLeft: spacing.xl,
    },
    translationLabel: {
      fontSize: fontSize.xs,
      fontWeight: '600',
      color: c.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.xs,
    },
    translationTerm: {
      fontSize: fontSize.md,
      fontWeight: '700',
      color: c.textPrimary,
      marginBottom: 4,
    },
    translationDefinition: {
      fontSize: fontSize.sm,
      color: c.textSecondary,
      lineHeight: 19,
    },

    // ── Theme Badge ──────────────────────
    themeBadgeRow: {
      flexDirection: 'row',
      marginTop: spacing.md,
      marginLeft: spacing.xl,
    },
    themeBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.round,
    },
    themeBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: '600',
    },

    // ── Empty ────────────────────────────
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
      gap: spacing.sm,
    },
    emptyText: {
      fontSize: fontSize.lg,
      fontWeight: '600',
      color: c.textPrimary,
      marginTop: spacing.md,
    },
    emptySubtext: {
      fontSize: fontSize.sm,
      color: c.textTertiary,
    },
  });
