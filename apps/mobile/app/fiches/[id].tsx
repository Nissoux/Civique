import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LANGUAGES, THEMES, type Fiche, type Language } from '@civique/shared';
import { getFiche } from '../../services/fiches';
import { useLanguageStore } from '../../stores/languageStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';

function renderMarkdownText(text: string, baseStyle: object, rtlStyle: object) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text style={[baseStyle, rtlStyle]}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <Text key={i} style={{ fontWeight: 'bold' }}>{part.slice(2, -2)}</Text>;
        }
        return part;
      })}
    </Text>
  );
}

export default function FicheDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentLang: storeLang } = useLanguageStore();
  const { isPremium } = useSubscriptionStore();
  const c = useColors();
  const insets = useSafeAreaInsets();

  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [loading, setLoading] = useState(true);

  const loadFiche = useCallback(async (lang: Language) => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getFiche(Number(id), lang);
      setFiche(data);
    } catch {
      // handle error silently
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadFiche(storeLang);
  }, [storeLang, loadFiche]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  if (!fiche) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <Text style={[styles.errorText, { color: c.textTertiary }]}>Fiche introuvable</Text>
      </View>
    );
  }

  const theme = THEMES.find((t) => t.id === fiche.themeId);
  const titleFr = fiche.titleFr;
  const contentFr = fiche.contentFr;
  const currentLang = storeLang;
  const showTranslation = currentLang !== 'fr' && fiche.translatedContent;
  const translatedTitle = showTranslation ? fiche.translatedTitle : null;
  const translatedContent = showTranslation ? fiche.translatedContent : null;
  const isLocked = fiche.isPremium && !isPremium;
  const isRtl = LANGUAGES.find((l) => l.code === currentLang)?.rtl ?? false;
  const rtlTextStyle = isRtl ? { writingDirection: 'rtl' as const, textAlign: 'right' as const } : {};

  return (
    <ScrollView style={[styles.container, { backgroundColor: c.background }]} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + 16 }]}>
      {theme && (
        <View style={[styles.themeBadge, { backgroundColor: theme.color + '20' }]}>
          <View style={[styles.themeDot, { backgroundColor: theme.color }]} />
          <Text style={[styles.themeText, { color: theme.color }]}>{theme.nameFr}</Text>
        </View>
      )}

      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: c.textPrimary }]}>{titleFr}</Text>
        {translatedTitle && (
          <Text style={[styles.translatedTitle, { color: c.textSecondary }, rtlTextStyle]}>{translatedTitle}</Text>
        )}
        {fiche.isPremium && (
          <View style={[styles.premiumBadge, { backgroundColor: c.accent }]}>
            <Ionicons name="star" size={12} color={c.textPrimary} />
            <Text style={[styles.premiumBadgeText, { color: c.textPrimary }]}>Premium</Text>
          </View>
        )}
      </View>

      {isLocked ? (
        <View style={styles.lockedOverlay}>
          <View style={[styles.lockedCard, { backgroundColor: c.card }]}>
            <Ionicons name="lock-closed" size={48} color={c.primary} />
            <Text style={[styles.lockedTitle, { color: c.textPrimary }]}>Contenu Premium</Text>
            <Text style={[styles.lockedDesc, { color: c.textSecondary }]}>
              Cette fiche est réservée aux membres Premium.
              Passez à Premium pour accéder à tout le contenu.
            </Text>
            <TouchableOpacity style={[styles.upgradeButton, { backgroundColor: c.accent }]} onPress={() => router.push('/settings/subscription')}>
              <Text style={[styles.upgradeButtonText, { color: c.textPrimary }]}>Passer à Premium</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
        <View style={[styles.contentCard, { backgroundColor: c.card }]}>
          {contentFr.split('\n\n').map((paragraph, idx) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            // Treat lines starting with # as headings
            if (trimmed.startsWith('# ')) {
              return (
                <Text key={idx} style={[styles.heading1, { color: c.primary }, rtlTextStyle]}>
                  {trimmed.replace(/^# /, '')}
                </Text>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <Text key={idx} style={[styles.heading2, { color: c.textPrimary }, rtlTextStyle]}>
                  {trimmed.replace(/^## /, '')}
                </Text>
              );
            }
            // Treat lines starting with - as bullet points
            if (trimmed.startsWith('- ')) {
              return (
                <View key={idx} style={[styles.bulletRow, isRtl && { flexDirection: 'row-reverse' }]}>
                  <Text style={[styles.bullet, { color: c.primary }]}>{'\u2022'}</Text>
                  {renderMarkdownText(trimmed.replace(/^- /, ''), { ...styles.paragraph, color: c.textSecondary }, rtlTextStyle)}
                </View>
              );
            }
            return (
              <View key={idx}>
                {renderMarkdownText(trimmed, { ...styles.paragraph, color: c.textSecondary }, rtlTextStyle)}
              </View>
            );
          })}
        </View>

        {/* Translated content below French */}
        {translatedContent && (
          <View style={[styles.translatedCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.translatedLabel, { color: c.textTertiary }, rtlTextStyle]}>
              {LANGUAGES.find((l) => l.code === currentLang)?.nativeName}
            </Text>
            {translatedContent.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith('# ')) {
                return (
                  <Text key={idx} style={[styles.heading2, { color: c.textSecondary }, rtlTextStyle]}>
                    {trimmed.replace(/^# /, '')}
                  </Text>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <Text key={idx} style={[styles.heading2, { color: c.textTertiary, fontSize: 15 }, rtlTextStyle]}>
                    {trimmed.replace(/^## /, '')}
                  </Text>
                );
              }
              if (trimmed.startsWith('- ')) {
                return (
                  <View key={idx} style={[styles.bulletRow, isRtl && { flexDirection: 'row-reverse' }]}>
                    <Text style={[styles.bullet, { color: c.textTertiary }]}>{'\u2022'}</Text>
                    {renderMarkdownText(trimmed.replace(/^- /, ''), { ...styles.paragraph, color: c.textSecondary }, rtlTextStyle)}
                  </View>
                );
              }
              return (
                <View key={idx}>
                  {renderMarkdownText(trimmed, { ...styles.paragraph, color: c.textSecondary }, rtlTextStyle)}
                </View>
              );
            })}
          </View>
        )}
        </>
      )}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: fontSize.lg,
  },
  themeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: spacing.md,
    gap: 6,
  },
  themeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  themeText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  titleRow: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  translatedTitle: {
    fontSize: fontSize.lg,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  translatedCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginTop: spacing.lg,
    borderWidth: 1,
  },
  translatedLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  premiumBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  contentCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  heading1: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  heading2: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: spacing.sm,
  },
  paragraph: {
    fontSize: fontSize.md,
    lineHeight: 24,
    marginBottom: spacing.md,
    flex: 1,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  bullet: {
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  lockedOverlay: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  lockedCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xxxl,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  lockedDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  upgradeButton: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: 14,
  },
  upgradeButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
});
