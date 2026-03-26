import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { THEMES, type Fiche } from '@civique/shared';
import { getFiches } from '../../services/fiches';
import { useLanguageStore } from '../../stores/languageStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import LanguagePicker from '../../components/LanguagePicker';
import { Badge } from '../../components/ui';

interface Section {
  themeId: number;
  title: string;
  color: string;
  icon: string;
  data: Fiche[];
}

export default function FichesScreen() {
  const router = useRouter();
  const { currentLang: language } = useLanguageStore();
  const { isPremium } = useSubscriptionStore();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFiches = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const allFiches = await getFiches(undefined, language);
      const grouped: Record<number, Fiche[]> = {};
      for (const fiche of allFiches) {
        if (!grouped[fiche.themeId]) grouped[fiche.themeId] = [];
        grouped[fiche.themeId].push(fiche);
      }
      const sectionData: Section[] = THEMES.map((theme) => ({
        themeId: theme.id,
        title: theme.nameFr,
        color: theme.color,
        icon: theme.icon,
        data: grouped[theme.id] || [],
      }));
      setSections(sectionData);
    } catch {
      // silent error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [language]);

  useEffect(() => {
    loadFiches();
  }, [loadFiches]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadFiches(true);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#002395" />
      </View>
    );
  }

  const totalFiches = sections.reduce((sum, s) => sum + s.data.length, 0);

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View style={styles.header}>
            <LinearGradient
              colors={['#002395', '#1a3fad']}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerTop}>
                <View style={styles.headerTitleArea}>
                  <Text style={styles.title}>Fiches de r{'\u00e9'}vision</Text>
                  <Text style={styles.subtitle}>
                    {totalFiches} fiche{totalFiches > 1 ? 's' : ''} disponible{totalFiches > 1 ? 's' : ''}
                  </Text>
                </View>
                <LanguagePicker />
              </View>
              <View style={styles.headerStats}>
                <View style={styles.headerStatItem}>
                  <Text style={styles.headerStatValue}>{THEMES.length}</Text>
                  <Text style={styles.headerStatLabel}>Th{'\u00e8'}mes</Text>
                </View>
                <View style={styles.headerStatDivider} />
                <View style={styles.headerStatItem}>
                  <Text style={styles.headerStatValue}>{totalFiches}</Text>
                  <Text style={styles.headerStatLabel}>Fiches</Text>
                </View>
                <View style={styles.headerStatDivider} />
                <View style={styles.headerStatItem}>
                  <Text style={styles.headerStatValue}>
                    {sections.reduce((s, sec) => s + sec.data.filter(f => f.isPremium).length, 0)}
                  </Text>
                  <Text style={styles.headerStatLabel}>Premium</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: section.color + '15' }]}>
              <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
            </View>
            <View style={styles.sectionTitleArea}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionCount}>
                {section.data.length} fiche{section.data.length > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        )}
        renderItem={({ item: fiche, section }) => {
          const ficheTitle = fiche.translatedTitle || fiche.titleFr;
          const preview = (fiche.translatedContent || fiche.contentFr || '')
            .replace(/^#+\s*/gm, '')
            .split('\n')
            .find((line) => line.trim().length > 0) || '';
          const isLocked = fiche.isPremium && !isPremium;

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/fiches/${fiche.id}`)}
              activeOpacity={0.7}
            >
              <View style={[styles.colorBar, { backgroundColor: section.color }]} />
              <View style={styles.cardBody}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {ficheTitle}
                  </Text>
                  {fiche.isPremium && (
                    <Badge text="Premium" variant="premium" icon="star" />
                  )}
                </View>
                <Text style={styles.cardPreview} numberOfLines={2}>
                  {preview}
                </Text>
              </View>
              <View style={styles.cardArrow}>
                {isLocked ? (
                  <Ionicons name="lock-closed" size={16} color="#FFD700" />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color="#CCC" />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        renderSectionFooter={({ section }) =>
          section.data.length === 0 ? (
            <View style={styles.emptySection}>
              <Ionicons name="document-text-outline" size={24} color="#CCC" />
              <Text style={styles.emptyText}>Aucune fiche disponible</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#CCC" />
            <Text style={styles.emptyTitle}>Aucune fiche disponible</Text>
            <Text style={styles.emptySubtext}>
              Les fiches de r{'\u00e9'}vision seront bient{'\u00f4'}t disponibles
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    marginBottom: 8,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitleArea: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  headerStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  headerStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  headerStatValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  headerStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 12,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sectionTitleArea: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  sectionCount: {
    fontSize: 13,
    color: '#999',
    marginTop: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 8,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
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
  cardPreview: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  cardArrow: {
    paddingRight: 14,
  },
  emptySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    marginHorizontal: 20,
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 4,
  },
});
