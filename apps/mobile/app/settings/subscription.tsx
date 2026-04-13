import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PurchasesPackage } from 'react-native-purchases';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { LEGAL_SUBSCRIPTION_TEXT } from '../../constants/subscription-strings';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { AnimatedPressable } from '../../components/ui';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  checkPremiumStatus,
} from '../../services/revenuecat';
import api from '../../services/api';

const FEATURES = [
  "Questions d'entraînement illimitées",
  'Examens blancs illimités',
  'Toutes les fiches de révision',
  'Flashcards et mises en situation',
  'Statistiques détaillées',
  'Support multilingue complet',
];

export default function SubscriptionScreen() {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isPremium, fetchSubscription } = useSubscriptionStore();

  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    setLoading(true);
    try {
      const offering = await getOfferings();
      if (offering) {
        const sortedPkgs = offering.availablePackages.sort((a, b) => {
          const order: Record<string, number> = { $rc_weekly: 0, $rc_monthly: 1, $rc_six_month: 2 };
          const aOrder = order[a.identifier] ?? 99;
          const bOrder = order[b.identifier] ?? 99;
          return aOrder - bOrder;
        });
        setPackages(sortedPkgs);
        // Select best value by default
        setSelectedPkg(sortedPkgs[sortedPkgs.length - 1] || null);
      }
    } catch (err) {
      console.error('Failed to load offerings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPkg || purchasing) return;
    setPurchasing(true);
    try {
      const result = await purchasePackage(selectedPkg);
      if (result.success && result.isPremium) {
        await fetchSubscription();
        Alert.alert('Bienvenue dans Civique Pro !', 'Vous avez maintenant accès à tout le contenu.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (err: any) {
      Alert.alert('Erreur', "L'achat n'a pas pu être effectué. Veuillez réessayer.");
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const result = await restorePurchases();
      if (result.isPremium) {
        await fetchSubscription();
        Alert.alert('Achats restaurés', 'Votre abonnement Premium a été restauré.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Aucun achat trouvé', "Aucun abonnement actif n'a été trouvé pour ce compte.");
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de restaurer les achats.');
    } finally {
      setRestoring(false);
    }
  };

  const handleRedeemPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    try {
      await api.post('/payments/redeem-code', { code: promoCode.trim() });
      await fetchSubscription();
      Alert.alert('Code activé !', 'Votre accès Premium a été activé.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.error || 'Code invalide.');
    } finally {
      setPromoLoading(false);
    }
  };

  const getPackageLabel = (identifier: string): string => {
    const labels: Record<string, string> = {
      $rc_weekly: 'Hebdomadaire',
      $rc_monthly: 'Mensuel',
      $rc_six_month: '6 mois',
    };
    return labels[identifier] || identifier;
  };

  const getPackageBadge = (identifier: string): string | null => {
    if (identifier === '$rc_monthly') return 'Populaire';
    if (identifier === '$rc_six_month') return 'Meilleure offre';
    return null;
  };

  if (isPremium) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl }]}>
        <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={c.textPrimary} />
        </AnimatedPressable>

        <View style={styles.premiumActive}>
          <Ionicons name="star" size={48} color={c.accent} />
          <Text style={[styles.premiumTitle, { color: c.textPrimary }]}>Civique Pro actif</Text>
          <Text style={[styles.premiumSubtitle, { color: c.textSecondary }]}>
            Vous avez accès à tout le contenu
          </Text>
        </View>

        <AnimatedPressable onPress={handleRestore} disabled={restoring}>
          <Text style={[styles.restoreText, { color: c.primary }]}>
            {restoring ? 'Restauration...' : 'Restaurer les achats'}
          </Text>
        </AnimatedPressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + 40 }]}>
      <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={c.textPrimary} />
      </AnimatedPressable>

      {/* Header */}
      <LinearGradient colors={c.gradientPrimary} style={styles.header}>
        <Ionicons name="star" size={40} color="#FFD700" />
        <Text style={styles.headerTitle}>Civique Pro</Text>
        <Text style={styles.headerSubtitle}>Débloquez tout le contenu</Text>
      </LinearGradient>

      {/* Features */}
      <View style={[styles.featuresCard, { backgroundColor: c.surface }]}>
        {FEATURES.map((feature, i) => (
          <View key={i} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={c.success} />
            <Text style={[styles.featureText, { color: c.textPrimary }]}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Packages */}
      {loading ? (
        <ActivityIndicator size="large" color={c.primary} style={{ marginVertical: spacing.xxl }} />
      ) : packages.length === 0 ? (
        <Text style={[styles.noPackages, { color: c.textTertiary }]}>
          Les offres sont en cours de chargement. Veuillez réessayer dans quelques instants.
        </Text>
      ) : (
        <View style={styles.packagesContainer}>
          {packages.map((pkg) => {
            const isSelected = selectedPkg?.identifier === pkg.identifier;
            const badge = getPackageBadge(pkg.identifier);
            return (
              <AnimatedPressable
                key={pkg.identifier}
                onPress={() => setSelectedPkg(pkg)}
                scaleDown={0.97}
              >
                <View style={[
                  styles.packageCard,
                  { backgroundColor: c.surface, borderColor: isSelected ? c.primary : c.border },
                  isSelected && { borderWidth: 2 },
                ]}>
                  {badge && (
                    <View style={[styles.badge, { backgroundColor: c.primary }]}>
                      <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                  )}
                  <Text style={[styles.packageLabel, { color: c.textPrimary }]}>
                    {getPackageLabel(pkg.identifier)}
                  </Text>
                  <Text style={[styles.packagePrice, { color: c.primary }]}>
                    {pkg.product.priceString}
                  </Text>
                  <Text style={[styles.packageDetail, { color: c.textTertiary }]}>
                    {pkg.product.description || ''}
                  </Text>
                </View>
              </AnimatedPressable>
            );
          })}
        </View>
      )}

      {/* Purchase button */}
      {packages.length > 0 && (
        <AnimatedPressable onPress={handlePurchase} disabled={!selectedPkg || purchasing} scaleDown={0.97}>
          <LinearGradient
            colors={c.gradientPrimary}
            style={[styles.purchaseButton, (!selectedPkg || purchasing) && { opacity: 0.5 }]}
          >
            {purchasing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.purchaseText}>S'abonner</Text>
            )}
          </LinearGradient>
        </AnimatedPressable>
      )}

      {/* Promo code — Android uniquement (Apple interdit les codes promo bypassant l'IAP) */}
      {Platform.OS !== 'ios' && (
        <View style={[styles.promoSection, { borderColor: c.border }]}>
          <Text style={[styles.promoLabel, { color: c.textSecondary }]}>Code promo</Text>
          <View style={styles.promoRow}>
            <View style={[styles.promoInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
              <Ionicons name="gift-outline" size={18} color={c.textTertiary} />
              <Text style={{ flex: 1 }}>
                {/* Using a simple touchable to enter promo code */}
              </Text>
            </View>
          </View>
          <AnimatedPressable
            onPress={() => {
              Alert.prompt(
                'Code promo',
                'Entrez votre code promotionnel',
                [
                  { text: 'Annuler', style: 'cancel' },
                  {
                    text: 'Activer',
                    onPress: (code) => {
                      if (code) {
                        setPromoCode(code);
                        api.post('/payments/redeem-code', { code: code.trim().toUpperCase() })
                          .then(() => {
                            fetchSubscription();
                            Alert.alert('Code activé !', 'Votre accès Premium a été activé.', [
                              { text: 'OK', onPress: () => router.back() },
                            ]);
                          })
                          .catch((err: any) => {
                            Alert.alert('Erreur', err.response?.data?.error || 'Code invalide.');
                          });
                      }
                    },
                  },
                ],
                'plain-text',
              );
            }}
          >
            <Text style={[styles.promoButton, { color: c.primary }]}>Entrer un code promo</Text>
          </AnimatedPressable>
        </View>
      )}

      {/* Restore */}
      <AnimatedPressable onPress={handleRestore} disabled={restoring}>
        <Text style={[styles.restoreText, { color: c.primary }]}>
          {restoring ? 'Restauration...' : 'Restaurer les achats'}
        </Text>
      </AnimatedPressable>

      {/* Legal — loaded from platform-specific file so the iOS binary
          contains no "Google Play" string (Apple guideline 2.3.10) */}
      <Text style={[styles.legalText, { color: c.textTertiary }]}>
        {LEGAL_SUBSCRIPTION_TEXT}
      </Text>

      {/* Privacy Policy + Terms of Use links — required by Apple 3.1.2(c) */}
      <View style={styles.legalLinks}>
        <AnimatedPressable onPress={() => Linking.openURL('https://api.integrafle.fr/privacy')}>
          <Text style={[styles.legalLink, { color: c.primary }]}>Politique de confidentialité</Text>
        </AnimatedPressable>
        <Text style={[styles.legalSeparator, { color: c.textTertiary }]}>•</Text>
        <AnimatedPressable onPress={() => Linking.openURL('https://api.integrafle.fr/terms')}>
          <Text style={[styles.legalLink, { color: c.primary }]}>Conditions d'utilisation</Text>
        </AnimatedPressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
  },
  header: {
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: spacing.md,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
  featuresCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureText: {
    fontSize: fontSize.md,
    flex: 1,
  },
  packagesContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  packageCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomLeftRadius: borderRadius.sm,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  packageLabel: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  packagePrice: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  packageDetail: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  noPackages: {
    textAlign: 'center',
    fontSize: fontSize.md,
    marginVertical: spacing.xxl,
    lineHeight: 22,
  },
  purchaseButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  purchaseText: {
    color: '#FFFFFF',
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  promoSection: {
    borderTopWidth: 1,
    paddingTop: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  promoLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  promoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
    marginBottom: spacing.md,
  },
  promoInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  promoButton: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  premiumActive: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  premiumTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
  },
  premiumSubtitle: {
    fontSize: fontSize.md,
  },
  restoreText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  legalText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  legalLink: {
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 12,
  },
});
