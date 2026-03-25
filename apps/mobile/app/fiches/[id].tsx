import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEMES, type Fiche, type Language } from '@civique/shared';
import { getFiche } from '../../services/fiches';
import { useLanguageStore } from '../../stores/languageStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import LanguagePicker from '../../components/LanguagePicker';

export default function FicheDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
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
        <Text style={styles.errorText}>Fiche introuvable</Text>
      </View>
    );
  }

  const theme = THEMES.find((t) => t.id === fiche.themeId);
  const title = fiche.translatedTitle || fiche.titleFr;
  const content = fiche.translatedContent || fiche.contentFr;
  const isLocked = fiche.isPremium && !isPremium;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {theme && (
        <View style={[styles.themeBadge, { backgroundColor: theme.color + '20' }]}>
          <View style={[styles.themeDot, { backgroundColor: theme.color }]} />
          <Text style={[styles.themeText, { color: theme.color }]}>{theme.nameFr}</Text>
        </View>
      )}

      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {fiche.isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={12} color="#333" />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        )}
      </View>

      {isLocked ? (
        <View style={styles.lockedOverlay}>
          <View style={styles.lockedCard}>
            <Ionicons name="lock-closed" size={48} color="#002395" />
            <Text style={styles.lockedTitle}>Contenu Premium</Text>
            <Text style={styles.lockedDesc}>
              Cette fiche est r{'\u00e9'}serv{'\u00e9'}e aux membres Premium.
              Passez {'\u00e0'} Premium pour acc{'\u00e9'}der {'\u00e0'} tout le contenu.
            </Text>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Passer {'\u00e0'} Premium</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.contentCard}>
          {content.split('\n\n').map((paragraph, idx) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            // Treat lines starting with # as headings
            if (trimmed.startsWith('# ')) {
              return (
                <Text key={idx} style={styles.heading1}>
                  {trimmed.replace(/^# /, '')}
                </Text>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <Text key={idx} style={styles.heading2}>
                  {trimmed.replace(/^## /, '')}
                </Text>
              );
            }
            // Treat lines starting with - as bullet points
            if (trimmed.startsWith('- ')) {
              return (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bullet}>{'\u2022'}</Text>
                  <Text style={styles.paragraph}>{trimmed.replace(/^- /, '')}</Text>
                </View>
              );
            }
            return (
              <Text key={idx} style={styles.paragraph}>
                {trimmed}
              </Text>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  themeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    gap: 6,
  },
  themeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  themeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  heading1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002395',
    marginBottom: 12,
    marginTop: 8,
  },
  heading2: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#444',
    marginBottom: 12,
    flex: 1,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 24,
    color: '#002395',
  },
  lockedOverlay: {
    alignItems: 'center',
    paddingTop: 20,
  },
  lockedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
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
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  upgradeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
