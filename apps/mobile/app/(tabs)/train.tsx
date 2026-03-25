import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { THEMES } from '@civique/shared';

export default function TrainScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Entra\u00eenement</Text>
      <Text style={styles.subtitle}>Choisissez un th\u00e8me pour commencer</Text>

      {THEMES.map((theme) => (
        <TouchableOpacity
          key={theme.id}
          style={[styles.card, { backgroundColor: theme.color + '15' }]}
        >
          <View style={[styles.iconBadge, { backgroundColor: theme.color }]}>
            <Text style={styles.iconText}>{theme.icon.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{theme.nameFr}</Text>
            <Text style={styles.cardSubtitle}>Commencer l'entra\u00eenement</Text>
          </View>
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
