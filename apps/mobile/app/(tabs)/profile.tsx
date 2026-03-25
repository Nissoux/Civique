import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LANGUAGES, type Language } from '@civique/shared';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import api from '../../services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { currentLang, setLanguage } = useLanguageStore();
  const { isPremium, fetchSubscription } = useSubscriptionStore();

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const displayName = user?.displayName || 'Utilisateur';
  const email = user?.email || 'utilisateur@example.com';
  const initial = displayName[0]?.toUpperCase() || 'U';

  const handleLanguageChange = async (code: Language) => {
    await setLanguage(code);
    try {
      await api.patch('/auth/me', { preferredLang: code });
    } catch {
      // silent
    }
  };

  const handleLogout = () => {
    Alert.alert('D\u00e9connexion', '\u00cates-vous s\u00fbr de vouloir vous d\u00e9connecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se d\u00e9connecter',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Social navigation cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Social</Text>
        <View style={styles.navGrid}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => router.push('/social/leaderboard')}
          >
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.navCardText}>Classement</Text>
            <Ionicons name="chevron-forward" size={16} color="#CCC" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => router.push('/social/friends')}
          >
            <Ionicons name="people" size={24} color="#002395" />
            <Text style={styles.navCardText}>Amis</Text>
            <Ionicons name="chevron-forward" size={16} color="#CCC" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => router.push('/social/challenges')}
          >
            <Ionicons name="flash" size={24} color="#ED2939" />
            <Text style={styles.navCardText}>D{'\u00e9'}fis</Text>
            <Ionicons name="chevron-forward" size={16} color="#CCC" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Language selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Langue pr{'\u00e9'}f{'\u00e9'}r{'\u00e9'}e</Text>
        {LANGUAGES.map((lang) => {
          const isSelected = lang.code === currentLang;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langOption, isSelected && styles.langOptionSelected]}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <View style={styles.langLeft}>
                <Text style={[styles.langName, isSelected && styles.langNameSelected]}>
                  {lang.nativeName}
                </Text>
                {lang.rtl && (
                  <View style={styles.rtlBadge}>
                    <Text style={styles.rtlText}>RTL</Text>
                  </View>
                )}
              </View>
              <View style={styles.langRight}>
                <Text style={styles.langCode}>{lang.name}</Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color="#002395" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Subscription */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abonnement</Text>
        <View style={styles.premiumCard}>
          {isPremium ? (
            <>
              <View style={styles.premiumActiveRow}>
                <Ionicons name="star" size={22} color="#FFD700" />
                <Text style={styles.premiumTitle}>Premium actif</Text>
              </View>
              <Text style={styles.premiumDesc}>
                Vous avez acc{'\u00e8'}s {'\u00e0'} tout le contenu
              </Text>
              <TouchableOpacity
                style={styles.manageButton}
                onPress={() => router.push('/settings/subscription')}
              >
                <Text style={styles.manageButtonText}>G{'\u00e9'}rer l'abonnement</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.premiumTitle}>Gratuit</Text>
              <Text style={styles.premiumDesc}>
                Passez {'\u00e0'} Premium pour acc{'\u00e9'}der {'\u00e0'} tout le contenu
              </Text>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => router.push('/settings/subscription')}
              >
                <Text style={styles.upgradeButtonText}>Passer {'\u00e0'} Premium</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ED2939" />
        <Text style={styles.logoutText}>Se d{'\u00e9'}connecter</Text>
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
  navGrid: {
    gap: 8,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  navCardText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  langOptionSelected: {
    borderColor: '#002395',
    backgroundColor: '#F8F9FF',
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langName: {
    fontSize: 16,
    color: '#333',
  },
  langNameSelected: {
    fontWeight: '600',
    color: '#002395',
  },
  rtlBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rtlText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
  },
  langRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  premiumActiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
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
  manageButton: {
    backgroundColor: '#EEF1FB',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  manageButtonText: {
    color: '#002395',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
    gap: 8,
  },
  logoutText: {
    color: '#ED2939',
    fontSize: 16,
    fontWeight: '500',
  },
});
