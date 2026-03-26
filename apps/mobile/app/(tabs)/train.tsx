import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { THEMES } from '@civique/shared';
import { Ionicons } from '@expo/vector-icons';
import { getStatsByTheme } from '../../services/stats';

const THEME_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  flag: 'flag',
  landmark: 'business',
  scale: 'scale',
  'book-open': 'book',
  home: 'home',
};

export default function TrainScreen() {
  const router = useRouter();

  const { data: themeStats } = useQuery({
    queryKey: ['stats', 'by-theme'],
    queryFn: getStatsByTheme,
    staleTime: 60 * 1000,
  });

  const getThemeProgress = (themeId: number) => {
    const stat = themeStats?.find((s) => s.themeId === themeId);
    return stat ? Math.round(stat.accuracy) : 0;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Entra{'\u00ee'}nement</Text>
      <Text style={styles.subtitle}>Choisissez un th{'\u00e8'}me pour commencer</Text>

      {/* Random option */}
      <TouchableOpacity
        style={styles.randomCard}
        onPress={() => router.push('/train/random')}
        activeOpacity={0.7}
      >
        <View style={styles.randomIcon}>
          <Ionicons name="shuffle" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.randomTitle}>Questions al{'\u00e9'}atoires</Text>
          <Text style={styles.cardSubtitle}>
            10 questions de tous les th{'\u00e8'}mes
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#002395" />
      </TouchableOpacity>

      {/* Theme cards */}
      {THEMES.map((theme) => {
        const progress = getThemeProgress(theme.id);

        return (
          <TouchableOpacity
            key={theme.id}
            style={styles.card}
            onPress={() => router.push(`/train/${theme.id}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBadge, { backgroundColor: theme.color + '20' }]}>
              <Ionicons
                name={THEME_ICONS[theme.icon] || 'help-circle'}
                size={24}
                color={theme.color}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{theme.nameFr}</Text>
              {progress > 0 ? (
                <View style={styles.progressRow}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: progress >= 80 ? '#2E7D32' : theme.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{progress}%</Text>
                </View>
              ) : (
                <Text style={styles.cardSubtitle}>
                  Commencer l'entra{'\u00ee'}nement
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
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
    paddingBottom: 32,
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
  randomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#002395',
    borderStyle: 'dashed',
  },
  randomIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#002395',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  randomTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002395',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    minWidth: 32,
    textAlign: 'right',
  },
});
