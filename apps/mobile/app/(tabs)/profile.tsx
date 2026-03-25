import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LANGUAGES } from '@civique/shared';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>U</Text>
        </View>
        <Text style={styles.displayName}>Utilisateur</Text>
        <Text style={styles.email}>utilisateur@example.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Langue pr\u00e9f\u00e9r\u00e9e</Text>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity key={lang.code} style={styles.langOption}>
            <Text style={styles.langName}>{lang.nativeName}</Text>
            <Text style={styles.langCode}>{lang.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abonnement</Text>
        <View style={styles.premiumCard}>
          <Text style={styles.premiumTitle}>Gratuit</Text>
          <Text style={styles.premiumDesc}>
            Passez \u00e0 Premium pour acc\u00e9der \u00e0 tout le contenu
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Passer \u00e0 Premium</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Se d\u00e9connecter</Text>
      </TouchableOpacity>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#002395',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  displayName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  langName: {
    fontSize: 16,
    color: '#333',
  },
  langCode: {
    fontSize: 14,
    color: '#999',
  },
  premiumCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  premiumDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  logoutText: {
    color: '#ED2939',
    fontSize: 16,
    fontWeight: '500',
  },
});
