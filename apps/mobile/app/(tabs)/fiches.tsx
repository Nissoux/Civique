import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { THEMES } from '@civique/shared';

export default function FichesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Fiches de r\u00e9vision</Text>
      <Text style={styles.subtitle}>Apprenez les essentiels par th\u00e8me</Text>

      {THEMES.map((theme) => (
        <TouchableOpacity key={theme.id} style={styles.card}>
          <View style={[styles.colorBar, { backgroundColor: theme.color }]} />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{theme.nameFr}</Text>
            <Text style={styles.cardCount}>Fiches disponibles</Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  colorBar: {
    width: 6,
  },
  cardBody: {
    flex: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardCount: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
});
