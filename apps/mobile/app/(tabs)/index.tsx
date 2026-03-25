import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { THEMES } from '@civique/shared';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Bonjour !</Text>
      <Text style={styles.subtitle}>Pr\u00eat pour r\u00e9viser aujourd'hui ?</Text>

      <TouchableOpacity
        style={styles.examCard}
        onPress={() => router.push('/exam')}
      >
        <Text style={styles.examCardTitle}>Examen blanc</Text>
        <Text style={styles.examCardDesc}>20 questions - 45 minutes</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Th\u00e8mes</Text>
      {THEMES.map((theme) => (
        <TouchableOpacity
          key={theme.id}
          style={[styles.themeCard, { borderLeftColor: theme.color }]}
          onPress={() => router.push(`/train?themeId=${theme.id}`)}
        >
          <Text style={styles.themeName}>{theme.nameFr}</Text>
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002395',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  examCard: {
    backgroundColor: '#002395',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  examCardTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  examCardDesc: {
    color: '#FFFFFFCC',
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  themeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
