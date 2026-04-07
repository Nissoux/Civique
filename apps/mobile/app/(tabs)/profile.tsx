import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from '../../components/ui/MotiView';
import { LANGUAGES, type Language } from '@civique/shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { useExamTypeStore, EXAM_TYPES } from '../../stores/examTypeStore';
import { useColors, useThemeStore, spacing, fontSize, borderRadius } from '../../constants/theme';
import type { ThemeMode } from '../../constants/theme';
import { Linking } from 'react-native';
import api from '../../services/api';
import { getStatsOverview } from '../../services/stats';
import { AnimatedPressable, AnimatedCard, CMotif } from '../../components/ui';

const APP_VERSION = '1.0.0';

// ── Menu item component ──────────────────────────────
function MenuItem({
  icon,
  iconColor,
  iconBgColor,
  label,
  value,
  onPress,
  colors,
  isLast,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  colors: ReturnType<typeof useColors>;
  isLast?: boolean;
}) {
  return (
    <AnimatedPressable
      onPress={onPress}
      haptic={true}
      scaleDown={0.99}
      style={[
        styles.menuItem,
        !isLast && { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={[styles.menuIconWrap, { backgroundColor: iconBgColor || colors.surfaceElevated }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.menuTextWrap}>
        <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{label}</Text>
        {value ? (
          <Text style={[styles.menuValue, { color: colors.textTertiary }]} numberOfLines={1}>
            {value}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </AnimatedPressable>
  );
}

// ── Section header ───────────────────────────────────
function SectionHeader({ title, colors }: { title: string; colors: ReturnType<typeof useColors> }) {
  return (
    <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>
      {title.toUpperCase()}
    </Text>
  );
}

// ── Main screen ──────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { currentLang, setLanguage } = useLanguageStore();
  const { isPremium, fetchSubscription } = useSubscriptionStore();
  const { selectedExamType } = useExamTypeStore();
  const { mode: themeMode, setMode: setThemeMode } = useThemeStore();

  const [overallAccuracy, setOverallAccuracy] = useState(0);
  const [totalPracticed, setTotalPracticed] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    fetchSubscription();
    getStatsOverview(selectedExamType || undefined).then((s) => {
      setOverallAccuracy(s.overallAccuracy || 0);
      setTotalPracticed(s.totalPracticed || 0);
      setTotalQuestions((s as any).totalAvailableQuestions || 611);
    }).catch(() => {});
  }, [fetchSubscription, selectedExamType]);

  const progressPercent = totalQuestions > 0
    ? Math.min(100, Math.round((totalPracticed / totalQuestions) * 100))
    : 0;

  const displayName = user?.displayName || 'Utilisateur';
  const email = user?.email || '';
  const initial = displayName[0]?.toUpperCase() || 'U';

  const examDef = EXAM_TYPES.find((e) => e.code === selectedExamType);
  const examLabel = examDef?.label ?? 'Non défini';

  const currentLangDef = LANGUAGES.find((l) => l.code === currentLang);
  const currentLangLabel = currentLangDef?.nativeName ?? 'Français';

  const handleLanguageChange = async (code: Language) => {
    await setLanguage(code);
    try {
      await api.patch('/auth/me', { preferredLang: code });
    } catch {
      // silent
    }
  };

  const showLanguagePicker = () => {
    const options = LANGUAGES.map((l) => l.nativeName);
    options.push('Annuler');

    Alert.alert('Langue de traduction', 'Choisissez votre langue', [
      ...LANGUAGES.map((lang) => ({
        text: `${lang.nativeName} (${lang.name})${lang.code === currentLang ? ' \u2713' : ''}`,
        onPress: () => handleLanguageChange(lang.code),
      })),
      { text: 'Annuler', style: 'cancel' as const },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer mon compte',
      'Cette action est irréversible. Toutes vos données seront supprimées définitivement (progression, examens, abonnement).',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer définitivement',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete('/auth/me');
              await logout();
              router.replace('/(auth)/login');
            } catch {
              Alert.alert('Erreur', 'Impossible de supprimer le compte. Réessayez plus tard.');
            }
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  // ── Render ─────────────────────────────────────────
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Top user section ──────────────────────────── */}
      <AnimatedCard delay={0}>
      <View style={[styles.topSection, { backgroundColor: colors.card }]}>
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
        >
          <LinearGradient
            colors={['#002395', '#ED2939', '#FFD700']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.textInverse }]}>{initial}</Text>
            </View>
          </LinearGradient>
        </MotiView>
        <View style={styles.topTextWrap}>
          <Text style={[styles.displayName, { color: colors.textPrimary }]}>{displayName}</Text>
          {email ? (
            <Text style={[styles.email, { color: colors.textSecondary }]}>{email}</Text>
          ) : null}
        </View>
        <View style={[styles.examTypeBadge, { backgroundColor: colors.primaryLight }]}>
          <View style={[styles.examTypeDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.examTypeText, { color: colors.primary }]} numberOfLines={1}>
            {examLabel}
          </Text>
        </View>
      </View>
      </AnimatedCard>

      {/* ── Progress card ───────────────────────────── */}
      <View
        style={[
          styles.examBadgeCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {/* Progression globale (questions vues / total) */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
              Progression globale
            </Text>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>{progressPercent}%</Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: colors.progressBg }]}>
            <View
              style={[
                styles.progressBarFill,
                { backgroundColor: progressPercent >= 80 ? colors.success : colors.primary, width: `${progressPercent}%` },
              ]}
            />
          </View>
          <Text style={[styles.progressDetail, { color: colors.textTertiary }]}>
            {totalPracticed} / {totalQuestions} questions travaillées
          </Text>
        </View>

        {/* Taux de réussite */}
        <View style={[styles.progressSection, { marginTop: 16 }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
              Taux de réussite
            </Text>
            <Text style={[styles.progressPercent, { color: overallAccuracy >= 80 ? colors.success : colors.warning }]}>{overallAccuracy}%</Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: colors.progressBg }]}>
            <View
              style={[
                styles.progressBarFill,
                { backgroundColor: overallAccuracy >= 80 ? colors.success : colors.warning, width: `${Math.min(100, overallAccuracy)}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* ── Premium upsell card ───────────────────────── */}
      {!isPremium ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/settings/subscription')}
        >
          <LinearGradient
            colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumCard}
          >
            <View style={styles.premiumTopRow}>
              <View style={styles.premiumStarCircle}>
                <Ionicons name="star" size={20} color="#FF8C00" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.premiumTitle}>Passer à Premium</Text>
                <Text style={styles.premiumDesc}>
                  Accédez à toutes les questions, examens blancs et contenus exclusifs.
                </Text>
              </View>
            </View>
            <View style={styles.premiumButton}>
              <Text style={[styles.premiumButtonText, { color: colors.premiumGradientEnd }]}>
                Découvrir l'offre
              </Text>
              <Ionicons name="arrow-forward" size={18} color={colors.premiumGradientEnd} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.premiumActiveCard,
            { backgroundColor: colors.premiumBg, borderColor: colors.accent },
          ]}
        >
          <View style={styles.premiumTopRow}>
            <Ionicons name="star" size={20} color={colors.accent} />
            <Text style={[styles.premiumActiveTitle, { color: colors.premiumText }]}>
              Premium actif
            </Text>
          </View>
          <Text style={[styles.premiumActiveDesc, { color: colors.textSecondary }]}>
            Vous avez accès à tout le contenu
          </Text>
        </View>
      )}

      {/* ── Mon objectif ──────────────────────────────── */}
      <SectionHeader title="Mon objectif" colors={colors} />
      <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
        <MenuItem
          icon="school-outline"
          iconColor="#FFFFFF"
          iconBgColor={colors.primary}
          label="Type d'examen"
          value={examLabel}
          onPress={() => router.push('/(tabs)/choose-exam')}
          colors={colors}
        />
        <MenuItem
          icon="language-outline"
          iconColor="#FFFFFF"
          iconBgColor={colors.primary}
          label="Langue de traduction"
          value={currentLangLabel}
          onPress={showLanguagePicker}
          colors={colors}
          isLast
        />
      </View>

      {/* ── Mon accès ────────────────────────────────── */}
      <SectionHeader title="Mon accès" colors={colors} />
      <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
        <MenuItem
          icon="card-outline"
          iconColor="#FFFFFF"
          iconBgColor={colors.accent}
          label="Abonnement"
          value={isPremium ? 'Premium' : 'Gratuit'}
          onPress={() => router.push('/settings/subscription')}
          colors={colors}
          isLast
        />
      </View>

      {/* ── Compte et préférences ───────────────────── */}
      <SectionHeader title="Compte et préférences" colors={colors} />
      <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
        <MenuItem
          icon="person-outline"
          iconColor="#FFFFFF"
          iconBgColor={colors.primary}
          label="Nom d'affichage"
          value={displayName}
          onPress={() => Alert.alert('Nom', user?.displayName || '')}
          colors={colors}
        />
        <MenuItem
          icon="mail-outline"
          iconColor="#FFFFFF"
          iconBgColor={colors.primary}
          label="Adresse e-mail"
          value={email || 'Non renseigné'}
          onPress={() => Alert.alert('Email', user?.email || '')}
          colors={colors}
        />
        <MenuItem
          icon={themeMode === 'dark' ? 'moon' : 'sunny-outline'}
          iconColor="#FFFFFF"
          iconBgColor={colors.primary}
          label="Modifier le mot de passe"
          onPress={() => {
            Alert.prompt(
              'Modifier le mot de passe',
              'Entrez votre mot de passe actuel',
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Suivant',
                  onPress: (currentPwd) => {
                    Alert.prompt(
                      'Nouveau mot de passe',
                      'Minimum 8 caractères',
                      [
                        { text: 'Annuler', style: 'cancel' },
                        {
                          text: 'Confirmer',
                          onPress: async (newPwd) => {
                            try {
                              await api.post('/auth/change-password', {
                                currentPassword: currentPwd,
                                newPassword: newPwd,
                              });
                              Alert.alert('Succès', 'Votre mot de passe a été modifié.');
                            } catch (err: any) {
                              Alert.alert('Erreur', err.response?.data?.error || 'Impossible de modifier le mot de passe.');
                            }
                          },
                        },
                      ],
                      'secure-text',
                    );
                  },
                },
              ],
              'secure-text',
            );
          }}
          colors={colors}
        />
        <MenuItem
          icon={themeMode === 'dark' ? 'moon' : 'sunny-outline'}
          iconColor="#FFFFFF"
          iconBgColor={colors.primary}
          label="Thème"
          value={themeMode === 'dark' ? 'Sombre' : 'Clair'}
          onPress={() => {
            const newMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
            setThemeMode(newMode);
          }}
          colors={colors}
        />
        <MenuItem
          icon="trash-outline"
          iconColor="#FFFFFF"
          iconBgColor={colors.error}
          label="Supprimer mon compte"
          onPress={handleDeleteAccount}
          colors={colors}
          isLast
        />
      </View>

      {/* ── Aide & support ────────────────────────────── */}
      <SectionHeader title="Aide & support" colors={colors} />
      <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
        <MenuItem
          icon="chatbubble-ellipses-outline"
          iconColor="#FFFFFF"
          iconBgColor={colors.textSecondary}
          label="Nous contacter"
          onPress={() => Linking.openURL('mailto:support@integrafle.fr?subject=Civique%20-%20Support')}
          colors={colors}
        />
        <MenuItem
          icon="document-text-outline"
          iconColor="#FFFFFF"
          iconBgColor={colors.textSecondary}
          label="Conditions d'utilisation"
          onPress={() => Linking.openURL('https://api.integrafle.fr/terms')}
          colors={colors}
        />
        <MenuItem
          icon="shield-checkmark-outline"
          iconColor="#FFFFFF"
          iconBgColor={colors.textSecondary}
          label="Politique de confidentialité"
          onPress={() => Linking.openURL('https://api.integrafle.fr/privacy')}
          colors={colors}
          isLast
        />
      </View>

      {/* ── Social ────────────────────────────────────── */}
      <SectionHeader title="Social" colors={colors} />
      <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
        <MenuItem
          icon="trophy-outline"
          iconColor="#FFFFFF"
          iconBgColor={colors.accent}
          label="Classement"
          onPress={() => router.push('/social/leaderboard')}
          colors={colors}
        />
        <MenuItem
          icon="people-outline"
          iconColor="#FFFFFF"
          iconBgColor={colors.primary}
          label="Amis"
          onPress={() => router.push('/social/friends')}
          colors={colors}
        />
        <MenuItem
          icon="flash-outline"
          iconColor="#FFFFFF"
          iconBgColor={colors.secondary}
          label="Défis"
          onPress={() => router.push('/social/challenges')}
          colors={colors}
          isLast
        />
      </View>

      {/* ── Logout ────────────────────────────────────── */}
      <AnimatedPressable
        onPress={handleLogout}
        scaleDown={0.97}
      >
        <View style={[styles.logoutButton, { backgroundColor: colors.errorBg }]}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Se déconnecter</Text>
        </View>
      </AnimatedPressable>

      {/* ── Version ───────────────────────────────────── */}
      <Text style={[styles.versionText, { color: colors.textTertiary }]}>
        Civique v{APP_VERSION}
      </Text>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl + 40,
  },

  /* ── Top user section ─────────────────────────────── */
  topSection: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: spacing.xl,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
  },
  topTextWrap: {
    alignItems: 'center',
    marginBottom: 14,
  },
  displayName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  email: {
    fontSize: fontSize.sm,
    marginTop: 4,
  },
  examTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  examTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  examTypeText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },

  /* ── Exam badge card ──────────────────────────────── */
  examBadgeCard: {
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: 24,
    borderWidth: 1,
  },
  progressSection: {
    gap: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: fontSize.md,
    fontWeight: '800',
  },
  progressDetail: {
    fontSize: fontSize.xs,
    marginTop: 4,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },

  /* ── Premium upsell ───────────────────────────────── */
  premiumCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  premiumTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 18,
  },
  premiumStarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumDesc: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  premiumButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  premiumButtonText: {
    fontSize: fontSize.md,
    fontWeight: '800',
  },

  /* ── Premium active ───────────────────────────────── */
  premiumActiveCard: {
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: 24,
    borderWidth: 1,
  },
  premiumActiveTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  premiumActiveDesc: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    marginLeft: 28,
  },

  /* ── Section header ───────────────────────────────── */
  sectionHeader: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 14,
    marginLeft: spacing.xs,
  },

  /* ── Menu section card ────────────────────────────── */
  menuSection: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },

  /* ── Menu item ────────────────────────────────────── */
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: spacing.lg,
    gap: 14,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  menuValue: {
    fontSize: fontSize.xs,
    marginTop: 1,
  },

  /* ── Logout ───────────────────────────────────────── */
  logoutButton: {
    flexDirection: 'row',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: 32,
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  /* ── Version ──────────────────────────────────────── */
  versionText: {
    textAlign: 'center',
    fontSize: fontSize.xs,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});
