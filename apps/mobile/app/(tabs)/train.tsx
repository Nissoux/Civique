import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { THEMES } from '@civique/shared';
import { Ionicons } from '@expo/vector-icons';

export default function TrainScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Entra{'\u00ee'}nement</Text>
      <Text style={styles.subtitle}>Choisissez un th{'\u00e8'}me pour commencer</Text>

      {/* Random option */}
      <TouchableOpacity
        style={styles.randomCard}
        onPress={() => router.push('/train/random')}
      >
        <View style={styles.randomIcon}>
          <Ionicons name="shuffle" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.randomTitle}>Al{'\u00e9'}atoire</Text>
          <Text style={styles.cardSubtitle}>
            10 questions de tous les th{'\u00e8'}mes
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#002395" />
      </TouchableOpacity>

      {/* Theme cards */}
      {THEMES.map((theme) => (
        <TouchableOpacity
          key={theme.id}
          style={[styles.card, { backgroundColor: theme.color + '15' }]}
          onPress={() => router.push(`/train/${theme.id}`)}
        >
          <View style={[styles.iconBadge, { backgroundColor: theme.color }]}>
            <Text style={styles.iconText}>
              {theme.icon.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{theme.nameFr}</Text>
            <Text style={styles.cardSubtitle}>
              Commencer l'entra{'\u00ee'}nement
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      ))}
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
    borderRadius: 12,
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
