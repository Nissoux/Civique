import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';

export default function FichesScreen() {
  const router = useRouter();
  const { currentLang: language } = useLanguageStore();
  const { isPremium } = useSubscriptionStore();
  const c = useColors();
  const insets = useSafeAreaInsets();
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.background }}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: 20, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: c.textPrimary, marginBottom: 4 }}>Fiches de révision</Text>
      <Text style={{ fontSize: 14, color: c.textSecondary, marginBottom: 24 }}>Apprenez les essentiels par thème</Text>

      {THEMES.map((theme) => {
        const fiches = fichesByTheme[theme.id] || [];
        return (
          <View key={theme.id} style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.color }} />
              <Text style={{ fontSize: 16, fontWeight: '600', color: c.textPrimary, flex: 1 }}>{theme.nameFr}</Text>
              <Text style={{ fontSize: 13, color: c.textTertiary }}>{fiches.length} fiches</Text>
            </View>

            {fiches.length === 0 ? (
              <Text style={{ fontSize: 13, color: c.textTertiary, fontStyle: 'italic', paddingLeft: 18 }}>Aucune fiche disponible</Text>
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
                    style={{
                      backgroundColor: c.card,
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
                    }}
                    onPress={() => router.push(`/fiches/${fiche.id}`)}
                  >
                    <View style={{ width: 5, alignSelf: 'stretch', backgroundColor: theme.color }} />
                    <View style={{ flex: 1, padding: 14 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: c.textPrimary, flex: 1 }} numberOfLines={1}>
                          {ficheTitle}
                        </Text>
                        {fiche.isPremium && (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: c.accent,
                              borderRadius: 8,
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                              gap: 3,
                            }}
                          >
                            <Ionicons name="star" size={10} color={c.textPrimary} />
                            <Text style={{ fontSize: 10, fontWeight: '700', color: c.textPrimary }}>Premium</Text>
                          </View>
                        )}
                      </View>
                      <Text style={{ fontSize: 13, color: c.textSecondary, lineHeight: 18 }} numberOfLines={2}>
                        {preview}
                      </Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      <Ionicons name="chevron-forward" size={18} color={c.textTertiary} />
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
