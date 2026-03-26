import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { THEMES, type Fiche, type Language } from '@civique/shared';
import { getFiche } from '../../services/fiches';
import { useLanguageStore } from '../../stores/languageStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import LanguagePicker from '../../components/LanguagePicker';
import { Badge } from '../../components/ui';

export default function FicheDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { currentLang: storeLang } = useLanguageStore();
  const { isPremium } = useSubscriptionStore();

  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>(storeLang);

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
    loadFiche(currentLang);
  }, [currentLang, loadFiche]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <LanguagePicker
          onLanguageChange={(lang) => setCurrentLang(lang)}
        />
      ),
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#002395" />
      </View>
    );
  }

  if (!fiche) {
    return (
      <View style={styles.center}>
        <Ionicons name="document-text-outline" size={48} color="#CCC" />
        <Text style={styles.errorText}>Fiche introuvable</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const theme = THEMES.find((t) => t.id === fiche.themeId);
  const title = fiche.translatedTitle || fiche.titleFr;
  const content = fiche.translatedContent || fiche.contentFr;
  const isLocked = fiche.isPremium && !isPremium;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Theme header accent */}
      {theme && (
        <LinearGradient
          colors={[theme.color + '20', theme.color + '05']}
          style={styles.themeAccent}
        >
          <View style={styles.themeBadge}>
            <View style={[styles.themeDot, { backgroundColor: theme.color }]} />
            <Text style={[styles.themeText, { color: theme.color }]}>{theme.nameFr}</Text>
          </View>
        </LinearGradient>
      )}

      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.badgeRow}>
          {fiche.isPremium && (
            <Badge text="Premium" variant="premium" icon="star" size="medium" />
          )}
          {currentLang !== 'fr' && (
            <Badge text={currentLang.toUpperCase()} variant="info" icon="language" size="medium" />
          )}
        </View>
      </View>

      {isLocked ? (
        <View style={styles.lockedContainer}>
          {/* Blurred preview */}
          <View style={styles.blurredPreview}>
            {content.split('\n\n').slice(0, 3).map((p, idx) => (
              <View key={idx} style={styles.blurredLine}>
                <View style={[styles.blurBlock, { width: `${70 + Math.random() * 30}%` }]} />
              </View>
            ))}
            <View style={styles.blurredLine}>
              <View style={[styles.blurBlock, { width: '85%' }]} />
            </View>
            <View style={styles.blurredLine}>
              <View style={[styles.blurBlock, { width: '60%' }]} />
            </View>
          </View>

          {/* Premium overlay card */}
          <View style={styles.premiumOverlay}>
            <LinearGradient
              colors={['#FFD700', '#FFC107']}
              style={styles.lockIconCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="lock-closed" size={28} color="#333" />
            </LinearGradient>
            <Text style={styles.lockedTitle}>Contenu Premium</Text>
            <Text style={styles.lockedDesc}>
              Cette fiche est r{'\u00e9'}serv{'\u00e9'}e aux membres Premium.{'\n'}
              Passez {'\u00e0'} Premium pour acc{'\u00e9'}der {'\u00e0'} tout le contenu.
            </Text>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => router.push('/settings/subscription')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFD700', '#FFB300']}
                style={styles.upgradeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="star" size={18} color="#333" />
                <Text style={styles.upgradeButtonText}>Passer {'\u00e0'} Premium</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.contentCard}>
          {renderMarkdown(content)}
        </View>
      )}
    </ScrollView>
  );
}

function renderMarkdown(content: string) {
  const blocks = content.split('\n\n');
  const elements: React.ReactNode[] = [];

  blocks.forEach((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('### ')) {
      elements.push(
        <Text key={idx} style={mdStyles.heading3}>
          {trimmed.replace(/^### /, '')}
        </Text>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <Text key={idx} style={mdStyles.heading2}>
          {trimmed.replace(/^## /, '')}
        </Text>
      );
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <Text key={idx} style={mdStyles.heading1}>
          {trimmed.replace(/^# /, '')}
        </Text>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').filter(l => l.trim());
      items.forEach((item, i) => {
        const text = item.replace(/^[-*]\s+/, '');
        elements.push(
          <View key={`${idx}-${i}`} style={mdStyles.bulletRow}>
            <View style={mdStyles.bulletDot} />
            <Text style={mdStyles.bulletText}>{renderInlineFormatting(text)}</Text>
          </View>
        );
      });
    } else if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').filter(l => l.trim());
      items.forEach((item, i) => {
        const match = item.match(/^(\d+)\.\s+(.*)/);
        if (match) {
          elements.push(
            <View key={`${idx}-${i}`} style={mdStyles.numberedRow}>
              <View style={mdStyles.numberCircle}>
                <Text style={mdStyles.numberText}>{match[1]}</Text>
              </View>
              <Text style={mdStyles.numberedText}>{renderInlineFormatting(match[2])}</Text>
            </View>
          );
        }
      });
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <View key={idx} style={mdStyles.blockquote}>
          <Text style={mdStyles.blockquoteText}>
            {trimmed.replace(/^> ?/gm, '')}
          </Text>
        </View>
      );
    } else {
      elements.push(
        <Text key={idx} style={mdStyles.paragraph}>
          {renderInlineFormatting(trimmed)}
        </Text>
      );
    }
  });

  return elements;
}

function renderInlineFormatting(text: string): string {
  // Strip markdown bold/italic markers for display
  return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
}

const mdStyles = StyleSheet.create({
  heading1: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#002395',
    marginBottom: 12,
    marginTop: 8,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    marginTop: 12,
  },
  heading3: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginTop: 10,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#444',
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    paddingLeft: 4,
    alignItems: 'flex-start',
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#002395',
    marginTop: 9,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#444',
    flex: 1,
  },
  numberedRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  numberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF1FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#002395',
  },
  numberedText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#444',
    flex: 1,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: '#002395',
    paddingLeft: 14,
    paddingVertical: 8,
    backgroundColor: '#F8F9FF',
    borderRadius: 6,
    marginBottom: 12,
  },
  blockquoteText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
    fontStyle: 'italic',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  backButton: {
    backgroundColor: '#EEF1FB',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 8,
  },
  backButtonText: {
    color: '#002395',
    fontWeight: '600',
  },
  themeAccent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  themeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
  },
  themeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  themeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lockedContainer: {
    marginHorizontal: 16,
  },
  blurredPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    opacity: 0.4,
  },
  blurredLine: {
    marginBottom: 10,
  },
  blurBlock: {
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  premiumOverlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginHorizontal: 16,
  },
  lockIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  lockedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  lockedDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  upgradeButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    gap: 8,
  },
  upgradeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '700',
  },
});
