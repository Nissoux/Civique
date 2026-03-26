import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LANGUAGES, type Language } from '@civique/shared';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import api from '../../services/api';
import { Card, Badge, Button } from '../../components/ui';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { currentLang, setLanguage } = useLanguageStore();
  const { isPremium, premiumExpires, fetchSubscription } = useSubscriptionStore();
  const [notifications, setNotifications] = useState(true);
  const [showLanguages, setShowLanguages] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const displayName = user?.displayName || 'Utilisateur';
  const email = user?.email || 'utilisateur@example.com';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLanguageChange = async (code: Language) => {
    await setLanguage(code);
    try {
      await api.patch('/auth/me', { preferredLang: code });
    } catch {
      // silent
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'D\u00e9connexion',
      '\u00cates-vous s\u00fbr de vouloir vous d\u00e9connecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se d\u00e9connecter',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const expiryDate = premiumExpires
    ? new Date(premiumExpires).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile header */}
      <LinearGradient
        colors={['#002395', '#1a3fad']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </LinearGradient>
          {isPremium && (
            <View style={styles.premiumStar}>
              <Ionicons name="star" size={14} color="#333" />
            </View>
          )}
        </View>
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.email}>{email}</Text>
        {isPremium && (
          <Badge text="Premium" variant="premium" icon="star" size="medium" style={{ marginTop: 8 }} />
        )}
      </LinearGradient>

      {/* Subscription card */}
      <View style={styles.subscriptionSection}>
        {isPremium ? (
          <Card style={styles.premiumCard}>
            <LinearGradient
              colors={['#FFF8E1', '#FFFFFF']}
              style={styles.premiumInner}
            >
              <View style={styles.premiumRow}>
                <View style={styles.premiumStarCircle}>
                  <Ionicons name="star" size={22} color="#FFD700" />
                </View>
                <View style={styles.premiumInfo}>
                  <Text style={styles.premiumTitle}>Premium actif</Text>
                  <Text style={styles.premiumDesc}>
                    Acc{'\u00e8'}s complet {'\u00e0'} tout le contenu
                  </Text>
                  {expiryDate && (
                    <Text style={styles.expiryText}>Expire le {expiryDate}</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.manageButton}
                onPress={() => router.push('/settings/subscription')}
              >
                <Text style={styles.manageButtonText}>
                  G{'\u00e9'}rer l'abonnement
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#002395" />
              </TouchableOpacity>
            </LinearGradient>
          </Card>
        ) : (
          <Card
            style={styles.freeCard}
            onPress={() => router.push('/settings/subscription')}
          >
            <View style={styles.freeRow}>
              <View style={styles.freeInfo}>
                <Text style={styles.freeTitle}>Compte gratuit</Text>
                <Text style={styles.freeDesc}>
                  Passez {'\u00e0'} Premium pour d{'\u00e9'}bloquer tout
                </Text>
              </View>
              <LinearGradient
                colors={['#FFD700', '#FFB300']}
                style={styles.upgradeButtonSmall}
              >
                <Ionicons name="star" size={14} color="#333" />
                <Text style={styles.upgradeButtonSmallText}>Premium</Text>
              </LinearGradient>
            </View>
          </Card>
        )}
      </View>

      {/* Social navigation */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Social</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/social/leaderboard')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#FFF8E1' }]}>
            <Ionicons name="trophy" size={20} color="#FFD700" />
          </View>
          <Text style={styles.menuText}>Classement</Text>
          <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/social/friends')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#EEF1FB' }]}>
            <Ionicons name="people" size={20} color="#002395" />
          </View>
          <Text style={styles.menuText}>Amis</Text>
          <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemLast]}
          onPress={() => router.push('/social/challenges')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="flash" size={20} color="#ED2939" />
          </View>
          <Text style={styles.menuText}>D{'\u00e9'}fis</Text>
          <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
      </Card>

      {/* Language preference */}
      <Card style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.sectionHeaderRow}
          onPress={() => setShowLanguages(!showLanguages)}
        >
          <Text style={styles.sectionTitle}>Langue pr{'\u00e9'}f{'\u00e9'}r{'\u00e9'}e</Text>
          <Ionicons
            name={showLanguages ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
        {!showLanguages ? (
          <TouchableOpacity
            style={styles.currentLangRow}
            onPress={() => setShowLanguages(true)}
          >
            <Text style={styles.currentLangName}>
              {LANGUAGES.find((l) => l.code === currentLang)?.nativeName || 'Fran\u00e7ais'}
            </Text>
            <Badge
              text={currentLang.toUpperCase()}
              variant="info"
            />
          </TouchableOpacity>
        ) : (
          LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langOption, isSelected && styles.langOptionSelected]}
                onPress={() => {
                  handleLanguageChange(lang.code);
                  setShowLanguages(false);
                }}
              >
                <View style={styles.langLeft}>
                  <Text
                    style={[styles.langName, isSelected && styles.langNameSelected]}
                  >
                    {lang.nativeName}
                  </Text>
                  {lang.rtl && <Badge text="RTL" variant="premium" />}
                </View>
                <View style={styles.langRight}>
                  <Text style={styles.langCode}>{lang.name}</Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color="#002395" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </Card>

      {/* App settings */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>R{'\u00e9'}glages</Text>
        <View style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#EEF1FB' }]}>
            <Ionicons name="language" size={20} color="#002395" />
          </View>
          <Text style={styles.menuText}>Langue de l'interface</Text>
          <Text style={styles.menuValue}>
            {LANGUAGES.find((l) => l.code === currentLang)?.nativeName}
          </Text>
        </View>
        <View style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="notifications" size={20} color="#2ECC71" />
          </View>
          <Text style={styles.menuText}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#DDD', true: '#002395' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
          <View style={[styles.menuIcon, { backgroundColor: '#F0F0F0' }]}>
            <Ionicons name="information-circle" size={20} color="#666" />
          </View>
          <Text style={styles.menuText}>{'\u00c0'} propos</Text>
          <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
      </Card>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ED2939" />
        <Text style={styles.logoutText}>Se d{'\u00e9'}connecter</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Civique v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingBottom: 40,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 28,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  premiumStar: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#002395',
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  subscriptionSection: {
    marginHorizontal: 16,
    marginTop: -12,
    marginBottom: 12,
  },
  premiumCard: {
    padding: 0,
    overflow: 'hidden',
  },
  premiumInner: {
    padding: 20,
  },
  premiumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  premiumStarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  premiumDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  expiryText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF1FB',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  manageButtonText: {
    color: '#002395',
    fontSize: 15,
    fontWeight: '600',
  },
  freeCard: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
  },
  freeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  freeInfo: {
    flex: 1,
  },
  freeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  freeDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  upgradeButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  upgradeButtonSmallText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  menuValue: {
    fontSize: 14,
    color: '#999',
  },
  currentLangRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  currentLangName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: '#F8F8F8',
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
  langRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langCode: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFEBEE',
    gap: 8,
  },
  logoutText: {
    color: '#ED2939',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#CCC',
    marginTop: 8,
    marginBottom: 16,
  },
});
