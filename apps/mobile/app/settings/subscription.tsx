import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { createCheckout } from '../../services/payments';
import { Card, Button } from '../../components/ui';

type Plan = 'monthly' | 'yearly';

const FEATURES = [
  { name: 'Questions gratuites', free: true, premium: true, icon: 'help-circle' as const },
  { name: 'Examens blancs illimit\u00e9s', free: false, premium: true, icon: 'school' as const },
  { name: 'Fiches de r\u00e9vision compl\u00e8tes', free: false, premium: true, icon: 'document-text' as const },
  { name: 'Statistiques d\u00e9taill\u00e9es', free: false, premium: true, icon: 'stats-chart' as const },
  { name: 'Traductions (6 langues)', free: false, premium: true, icon: 'language' as const },
  { name: 'D\u00e9fis entre amis', free: true, premium: true, icon: 'flash' as const },
  { name: 'Sans publicit\u00e9', free: false, premium: true, icon: 'eye-off' as const },
];

export default function SubscriptionScreen() {
  const { isPremium, premiumExpires, isLoading, fetchSubscription } =
    useSubscriptionStore();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('yearly');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleSubscribe = async () => {
    setPurchasing(true);
    try {
      if (Platform.OS === 'web') {
        const { url } = await createCheckout(selectedPlan);
        await Linking.openURL(url);
      } else {
        // Placeholder for RevenueCat integration on native
        console.log(`[Civique] Mock purchase: ${selectedPlan} plan`);
        const { url } = await createCheckout(selectedPlan);
        await Linking.openURL(url);
      }
    } catch {
      console.log('[Civique] Purchase flow error (mock)');
    } finally {
      setPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#002395" />
      </View>
    );
  }

  if (isPremium) {
    const expiryDate = premiumExpires
      ? new Date(premiumExpires).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={['#FFD700', '#FFC107']}
          style={styles.premiumHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.premiumStarCircle}>
            <Ionicons name="star" size={36} color="#FFD700" />
          </View>
          <Text style={styles.premiumHeaderTitle}>Merci d'{'\u00ea'}tre Premium !</Text>
          <Text style={styles.premiumHeaderDesc}>
            Vous avez acc{'\u00e8'}s {'\u00e0'} tout le contenu de Civique
          </Text>
        </LinearGradient>

        <Card style={styles.premiumInfoCard}>
          {expiryDate && (
            <View style={styles.premiumInfoRow}>
              <View style={styles.premiumInfoIcon}>
                <Ionicons name="calendar" size={20} color="#002395" />
              </View>
              <View style={styles.premiumInfoContent}>
                <Text style={styles.premiumInfoLabel}>Date d'expiration</Text>
                <Text style={styles.premiumInfoValue}>{expiryDate}</Text>
              </View>
            </View>
          )}
          <View style={styles.premiumInfoRow}>
            <View style={styles.premiumInfoIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
            </View>
            <View style={styles.premiumInfoContent}>
              <Text style={styles.premiumInfoLabel}>Statut</Text>
              <Text style={[styles.premiumInfoValue, { color: '#2ECC71' }]}>Actif</Text>
            </View>
          </View>
        </Card>

        {/* Features you have */}
        <Card style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Vos avantages Premium</Text>
          {FEATURES.filter(f => f.premium).map((f, idx) => (
            <View key={idx} style={styles.featureCheckRow}>
              <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
              <Text style={styles.featureCheckText}>{f.name}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <LinearGradient
        colors={['#002395', '#1a3fad']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <LinearGradient
          colors={['#FFD700', '#FFC107']}
          style={styles.headerStarCircle}
        >
          <Ionicons name="star" size={32} color="#333" />
        </LinearGradient>
        <Text style={styles.headerTitle}>Passer {'\u00e0'} Premium</Text>
        <Text style={styles.headerDesc}>
          D{'\u00e9'}bloquez tout le contenu et pr{'\u00e9'}parez votre examen sereinement
        </Text>
      </LinearGradient>

      {/* Feature comparison */}
      <Card style={styles.comparisonCard}>
        <View style={styles.comparisonHeader}>
          <Text style={styles.compHeaderFeature}>Fonctionnalit{'\u00e9'}</Text>
          <Text style={styles.compHeaderFree}>Gratuit</Text>
          <Text style={styles.compHeaderPremium}>Premium</Text>
        </View>
        {FEATURES.map((f, idx) => (
          <View
            key={idx}
            style={[styles.featureRow, idx % 2 === 0 && styles.featureRowAlt]}
          >
            <View style={styles.featureNameRow}>
              <Ionicons name={f.icon} size={16} color="#666" />
              <Text style={styles.featureName}>{f.name}</Text>
            </View>
            <View style={styles.checkCell}>
              {f.free ? (
                <Ionicons name="checkmark-circle" size={22} color="#2ECC71" />
              ) : (
                <Ionicons name="close-circle" size={22} color="#DDD" />
              )}
            </View>
            <View style={styles.checkCell}>
              <Ionicons name="checkmark-circle" size={22} color="#2ECC71" />
            </View>
          </View>
        ))}
      </Card>

      {/* Pricing options */}
      <Text style={styles.pricingSectionTitle}>Choisissez votre formule</Text>
      <View style={styles.pricingSection}>
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}
          onPress={() => setSelectedPlan('yearly')}
          activeOpacity={0.7}
        >
          <View style={styles.bestValueBadge}>
            <Ionicons name="ribbon" size={12} color="#333" />
            <Text style={styles.bestValueText}>Meilleure offre</Text>
          </View>
          <Text style={styles.planPrice}>29,99{'\u20ac'}</Text>
          <Text style={styles.planPeriod}>par an</Text>
          <View style={styles.savingBadge}>
            <Text style={styles.savingText}>2,50{'\u20ac'}/mois</Text>
          </View>
          <Text style={styles.savingPercent}>{'\u00c9'}conomisez 50%</Text>
          {selectedPlan === 'yearly' && (
            <View style={styles.selectedCheck}>
              <Ionicons name="checkmark-circle" size={26} color="#002395" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
          onPress={() => setSelectedPlan('monthly')}
          activeOpacity={0.7}
        >
          <Text style={[styles.planPrice, { marginTop: 20 }]}>4,99{'\u20ac'}</Text>
          <Text style={styles.planPeriod}>par mois</Text>
          <Text style={styles.planFlexible}>Sans engagement</Text>
          {selectedPlan === 'monthly' && (
            <View style={styles.selectedCheck}>
              <Ionicons name="checkmark-circle" size={26} color="#002395" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Subscribe button */}
      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={handleSubscribe}
        disabled={purchasing}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FFD700', '#FFB300']}
          style={styles.subscribeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {purchasing ? (
            <ActivityIndicator size="small" color="#333" />
          ) : (
            <>
              <Ionicons name="star" size={20} color="#333" />
              <Text style={styles.subscribeButtonText}>
                S'abonner - {selectedPlan === 'yearly' ? '29,99\u20ac/an' : '4,99\u20ac/mois'}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Terms */}
      <Text style={styles.terms}>
        En vous abonnant, vous acceptez nos conditions g{'\u00e9'}n{'\u00e9'}rales d'utilisation.
        L'abonnement se renouvelle automatiquement sauf annulation pr{'\u00e9'}alable.
      </Text>

      {Platform.OS !== 'web' && (
        <Text style={styles.disclaimer}>
          Int{'\u00e9'}gration RevenueCat {'\u00e0'} venir pour les achats in-app natifs.
        </Text>
      )}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  // Header
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerStarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerDesc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  // Comparison
  comparisonCard: {
    marginHorizontal: 16,
    marginTop: -16,
    padding: 0,
    overflow: 'hidden',
    marginBottom: 24,
  },
  comparisonHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  compHeaderFeature: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  compHeaderFree: {
    width: 65,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  compHeaderPremium: {
    width: 65,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#FFB300',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  featureRowAlt: {
    backgroundColor: '#FAFAFA',
  },
  featureNameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureName: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  checkCell: {
    width: 65,
    alignItems: 'center',
  },
  // Pricing
  pricingSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  pricingSection: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ECECEC',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  planCardSelected: {
    borderColor: '#002395',
    backgroundColor: '#F8F9FF',
    shadowColor: '#002395',
    shadowOpacity: 0.1,
  },
  bestValueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    position: 'absolute',
    top: -12,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bestValueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#002395',
    marginTop: 8,
  },
  planPeriod: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  savingBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 8,
  },
  savingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2ECC71',
  },
  savingPercent: {
    fontSize: 12,
    color: '#2ECC71',
    fontWeight: '600',
    marginTop: 4,
  },
  planFlexible: {
    fontSize: 13,
    color: '#999',
    marginTop: 10,
  },
  selectedCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  // Subscribe button
  subscribeButton: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  subscribeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 8,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  terms: {
    fontSize: 11,
    color: '#BBB',
    textAlign: 'center',
    marginHorizontal: 24,
    lineHeight: 16,
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 12,
    color: '#BBB',
    textAlign: 'center',
    marginTop: 12,
  },
  // Premium active state
  premiumHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  premiumStarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  premiumHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  premiumHeaderDesc: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginTop: 6,
  },
  premiumInfoCard: {
    marginHorizontal: 16,
    marginTop: -16,
    marginBottom: 16,
    padding: 20,
  },
  premiumInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
  },
  premiumInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF1FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumInfoContent: {
    flex: 1,
  },
  premiumInfoLabel: {
    fontSize: 13,
    color: '#999',
  },
  premiumInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  featuresCard: {
    marginHorizontal: 16,
    padding: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  featureCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  featureCheckText: {
    fontSize: 15,
    color: '#555',
  },
});
