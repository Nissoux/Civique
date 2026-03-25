import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEMES, type Fiche } from '@civique/shared';
import { getFiches } from '../../services/fiches';
import { useLanguageStore } from '../../stores/languageStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';

export default function FichesScreen() {
  const router = useRouter();
  const { currentLang: language } = useLanguageStore();
  const { isPremium } = useSubscriptionStore();
  const [fichesByTheme, setFichesByTheme] = useState<Record<number, Fiche[]>>({});
  const [loading, setLoading] = useState(true);

  const loadFiches = useCallback(async () => {
    setLoading(true);
    try {
      const allFiches = await getFiches(undefined, language);
      const grouped: Record<number, Fiche[]> = {};
      for (const fiche of allFiches) {
        if (!grouped[fiche.themeId]) grouped[fiche.themeId] = [];
        grouped[fiche.themeId].push(fiche);
      }
      setFichesByTheme(grouped);
    } catch {
      // silent error
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    loadFiches();
  }, [loadFiches]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#002395" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Fiches de r{'\u00e9'}vision</Text>
      <Text style={styles.subtitle}>Apprenez les essentiels par th{'\u00e8'}me</Text>

      {THEMES.map((theme) => {
        const fiches = fichesByTheme[theme.id] || [];
        return (
          <View key={theme.id} style={styles.themeSection}>
            <View style={styles.themeHeader}>
              <View style={[styles.themeDot, { backgroundColor: theme.color }]} />
              <Text style={styles.themeName}>{theme.nameFr}</Text>
              <Text style={styles.ficheCount}>{fiches.length} fiches</Text>
            </View>

            {fiches.length === 0 ? (
              <Text style={styles.emptyText}>Aucune fiche disponible</Text>
            ) : (
              fiches.map((fiche) => {
                const ficheTitle = fiche.translatedTitle || fiche.titleFr;
                const preview = (fiche.translatedContent || fiche.contentFr || '')
                  .replace(/^#+\s*/gm, '')
                  .split('\n')
                  .find((line) => line.trim().length > 0) || '';

                return (
                  <TouchableOpacity
                    key={fiche.id}
                    style={styles.card}
                    onPress={() => router.push(`/fiches/${fiche.id}`)}
                  >
                    <View style={[styles.colorBar, { backgroundColor: theme.color }]} />
                    <View style={styles.cardBody}>
                      <View style={styles.cardTitleRow}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {ficheTitle}
                        </Text>
                        {fiche.isPremium && (
                          <View style={styles.premiumBadge}>
                            <Ionicons name="star" size={10} color="#333" />
                            <Text style={styles.premiumText}>Premium</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.cardPreview} numberOfLines={2}>
                        {preview}
                      </Text>
                    </View>
                    <View style={styles.cardArrow}>
                      <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        );
      })}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  themeSection: {
    marginBottom: 24,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  themeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  ficheCount: {
    fontSize: 13,
    color: '#999',
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    paddingLeft: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  colorBar: {
    width: 5,
    alignSelf: 'stretch',
  },
  cardBody: {
    flex: 1,
    padding: 14,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
  },
  cardPreview: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  cardArrow: {
    paddingRight: 12,
  },
});
