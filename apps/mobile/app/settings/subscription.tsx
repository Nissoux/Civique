import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import api from '../../services/api';
import * as Linking from 'expo-linking';

type Plan = 'weekly' | 'monthly' | 'semiannual';

const PLANS: { id: Plan; label: string; price: string; detail: string; badge?: string }[] = [
  { id: 'weekly', label: 'Hebdomadaire', price: '2,99 €', detail: 'par semaine' },
  { id: 'monthly', label: 'Mensuel', price: '7,99 €', detail: 'par mois', badge: 'Populaire' },
  { id: 'semiannual', label: '6 mois', price: '29,99 €', detail: 'pour 6 mois', badge: 'Meilleure offre' },
];

const FEATURES = [
  'Questions d\'entraînement illimitées',
  'Examens blancs illimités',
  'Toutes les fiches de révision',
  'Toutes les séries par thème',
  'Statistiques détaillées',
  '6 langues de traduction',
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { isPremium } = useSubscriptionStore();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('semiannual');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { fetchSubscription } = useSubscriptionStore();

  // Refresh premium status when app comes back from Stripe browser
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        fetchSubscription();
      }
    });
    return () => sub.remove();
  }, [fetchSubscription]);

  const handleRedeemCode = async () => {
    if (!promoCode.trim()) return;
    setIsRedeeming(true);
    try {
      const { data } = await api.post('/payments/redeem-code', { code: promoCode.trim() });
      Alert.alert('Succès !', data.data.message);
      fetchSubscription();
      router.back();
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Code invalide';
      Alert.alert('Erreur', msg);
    } finally {
      setIsRedeeming(false);
    }
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const { data } = await api.post('/payments/create-checkout', { plan: selectedPlan });
      const checkoutUrl = data.data.checkoutUrl;
      if (checkoutUrl) {
        await Linking.openURL(checkoutUrl);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erreur lors de la création du paiement';
      Alert.alert('Erreur', msg);
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: c.background, paddingTop: insets.top }]}>
        <View style={[styles.premiumCard, { backgroundColor: c.card }]}>
          <Ionicons name="shield-checkmark" size={48} color={c.accent} />
          <Text style={[styles.premiumTitle, { color: c.textPrimary }]}>Vous êtes Premium !</Text>
          <Text style={[styles.premiumDesc, { color: c.textSecondary }]}>
            Accès illimité à tout le contenu de Civique.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: c.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + 20 }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={c.textPrimary} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: c.textPrimary }]}>
        Donnez-vous toutes les chances de réussir
      </Text>

      {/* Features */}
      <View style={styles.features}>
        {FEATURES.map((feature, i) => (
          <View key={i} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={c.success} />
            <Text style={[styles.featureText, { color: c.textPrimary }]}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Plans */}
      <View style={styles.plans}>
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                { backgroundColor: c.card, borderColor: c.border },
                isSelected && { borderColor: c.primary, borderWidth: 2 },
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <View style={styles.planLeft}>
                <View style={[styles.planRadio, { borderColor: isSelected ? c.primary : c.textTertiary }]}>
                  {isSelected && <View style={[styles.planRadioInner, { backgroundColor: c.primary }]} />}
                </View>
                <View>
                  <Text style={[styles.planLabel, { color: c.textPrimary }]}>{plan.label}</Text>
                  {plan.badge && (
                    <View style={[styles.planBadge, { backgroundColor: plan.id === 'semiannual' ? c.accentBg : c.primaryLight }]}>
                      <Text style={[styles.planBadgeText, { color: plan.id === 'semiannual' ? c.accent : c.primary }]}>
                        {plan.badge}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.planRight}>
                <Text style={[styles.planPrice, { color: c.textPrimary }]}>{plan.price}</Text>
                <Text style={[styles.planDetail, { color: c.textTertiary }]}>{plan.detail}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.ctaButton, { backgroundColor: c.primary }, isPurchasing && { opacity: 0.6 }]}
        onPress={handlePurchase}
        disabled={isPurchasing}
      >
        {isPurchasing ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.ctaText}>Accéder à la version complète</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={() => router.back()}>
        <Text style={[styles.skipText, { color: c.textTertiary }]}>Continuer gratuitement</Text>
      </TouchableOpacity>

      {/* Promo Code */}
      <View style={[styles.promoSection, { borderTopColor: c.border }]}>
        <Text style={[styles.promoTitle, { color: c.textSecondary }]}>Vous avez un code ?</Text>
        <View style={styles.promoRow}>
          <TextInput
            style={[styles.promoInput, { backgroundColor: c.inputBg, borderColor: c.border, color: c.textPrimary }]}
            placeholder="Entrez votre code"
            placeholderTextColor={c.textTertiary}
            value={promoCode}
            onChangeText={setPromoCode}
            autoCapitalize="characters"
            editable={!isRedeeming}
          />
          <TouchableOpacity
            style={[styles.promoButton, { backgroundColor: c.success }, (!promoCode.trim() || isRedeeming) && { opacity: 0.5 }]}
            onPress={handleRedeemCode}
            disabled={!promoCode.trim() || isRedeeming}
          >
            {isRedeeming ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.promoButtonText}>Activer</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.legal, { color: c.textTertiary }]}>
        L'abonnement se renouvelle automatiquement. Vous pouvez annuler à tout moment.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: spacing.lg },
  closeButton: { padding: spacing.sm },
  title: { fontSize: fontSize.xxl, fontWeight: 'bold', textAlign: 'center', marginBottom: spacing.xxl, lineHeight: 32 },
  features: { marginBottom: spacing.xxxl },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  featureText: { fontSize: fontSize.md, flex: 1 },
  plans: { gap: spacing.md, marginBottom: spacing.xxl },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  planRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  planRadioInner: { width: 12, height: 12, borderRadius: 6 },
  planLabel: { fontSize: fontSize.lg, fontWeight: '600' },
  planBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  planBadgeText: { fontSize: 11, fontWeight: '600' },
  planRight: { alignItems: 'flex-end' },
  planPrice: { fontSize: fontSize.lg, fontWeight: 'bold' },
  planDetail: { fontSize: fontSize.xs, marginTop: 2 },
  ctaButton: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  ctaText: { color: '#FFFFFF', fontSize: fontSize.lg, fontWeight: '600' },
  skipButton: { alignItems: 'center', padding: spacing.md, marginBottom: spacing.xl },
  skipText: { fontSize: fontSize.md },
  legal: { fontSize: fontSize.xs, textAlign: 'center', lineHeight: 16 },
  premiumCard: {
    margin: spacing.xxl,
    padding: spacing.xxxl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: 100,
  },
  premiumTitle: { fontSize: fontSize.xxl, fontWeight: 'bold' },
  premiumDesc: { fontSize: fontSize.md, textAlign: 'center' },
  promoSection: { borderTopWidth: 1, paddingTop: spacing.xl, marginBottom: spacing.xl },
  promoTitle: { fontSize: fontSize.md, fontWeight: '600', marginBottom: spacing.md },
  promoRow: { flexDirection: 'row', gap: spacing.sm },
  promoInput: { flex: 1, borderWidth: 1, borderRadius: borderRadius.md, padding: spacing.md, fontSize: fontSize.md, letterSpacing: 2, fontWeight: '600' },
  promoButton: { borderRadius: borderRadius.md, paddingHorizontal: spacing.xl, justifyContent: 'center', alignItems: 'center', minWidth: 80 },
  promoButtonText: { color: '#FFFFFF', fontSize: fontSize.md, fontWeight: '600' },
  backButton: { borderRadius: borderRadius.lg, padding: spacing.lg, paddingHorizontal: spacing.xxxl, marginTop: spacing.md },
  backButtonText: { color: '#FFFFFF', fontSize: fontSize.md, fontWeight: '600' },
});
