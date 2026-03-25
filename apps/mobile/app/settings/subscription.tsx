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
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { createCheckout } from '../../services/payments';

type Plan = 'monthly' | 'yearly';

const FEATURES = [
  { name: 'Questions gratuites', free: true, premium: true },
  { name: 'Examens blancs illimit\u00e9s', free: false, premium: true },
  { name: 'Fiches de r\u00e9vision compl\u00e8tes', free: false, premium: true },
  { name: 'Statistiques d\u00e9taill\u00e9es', free: false, premium: true },
  { name: 'Traductions (6 langues)', free: false, premium: true },
  { name: 'D\u00e9fis entre amis', free: true, premium: true },
  { name: 'Sans publicit\u00e9', free: false, premium: true },
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
        const { url } = await createCheckout(selectedPlan);
        // On mobile we would use RevenueCat, but for now open the URL
        await Linking.openURL(url);
      }
    } catch {
      // silent
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
        <View style={styles.premiumActiveCard}>
          <View style={styles.starCircle}>
            <Ionicons name="star" size={32} color="#FFD700" />
          </View>
          <Text style={styles.premiumActiveTitle}>Merci d'{'\u00ea'}tre Premium !</Text>
          <Text style={styles.premiumActiveDesc}>
            Vous avez acc{'\u00e8'}s {'\u00e0'} tout le contenu de Civique.
          </Text>
          {expiryDate && (
            <Text style={styles.expiryText}>
              Votre abonnement expire le {expiryDate}
            </Text>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="star" size={28} color="#FFD700" />
        <Text style={styles.headerTitle}>Passer {'\u00e0'} Premium</Text>
        <Text style={styles.headerDesc}>
          D{'\u00e9'}bloquez tout le contenu et pr{'\u00e9'}parez votre examen sereinement
        </Text>
      </View>

      {/* Comparison table */}
      <View style={styles.comparisonCard}>
        <View style={styles.comparisonHeader}>
          <Text style={styles.featureLabel}> </Text>
          <Text style={styles.planLabel}>Gratuit</Text>
          <Text style={[styles.planLabel, styles.premiumLabel]}>Premium</Text>
        </View>
        {FEATURES.map((f, idx) => (
          <View
            key={idx}
            style={[styles.featureRow, idx % 2 === 0 && styles.featureRowAlt]}
          >
            <Text style={styles.featureName}>{f.name}</Text>
            <View style={styles.checkCell}>
              {f.free ? (
                <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
              ) : (
                <Ionicons name="close-circle" size={20} color="#DDD" />
              )}
            </View>
            <View style={styles.checkCell}>
              <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
            </View>
          </View>
        ))}
      </View>

      {/* Pricing options */}
      <View style={styles.pricingSection}>
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}
          onPress={() => setSelectedPlan('yearly')}
        >
          <View style={styles.bestValueBadge}>
            <Text style={styles.bestValueText}>Meilleure offre</Text>
          </View>
          <Text style={styles.planPrice}>29,99{'\u20ac'}</Text>
          <Text style={styles.planPeriod}>par an</Text>
          <Text style={styles.planSaving}>2,50{'\u20ac'}/mois - {'\u00c9'}conomisez 50%</Text>
          {selectedPlan === 'yearly' && (
            <View style={styles.selectedDot}>
              <Ionicons name="checkmark-circle" size={24} color="#002395" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
          onPress={() => setSelectedPlan('monthly')}
        >
          <Text style={styles.planPrice}>4,99{'\u20ac'}</Text>
          <Text style={styles.planPeriod}>par mois</Text>
          <Text style={styles.planSaving}>Sans engagement</Text>
          {selectedPlan === 'monthly' && (
            <View style={styles.selectedDot}>
              <Ionicons name="checkmark-circle" size={24} color="#002395" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Subscribe button */}
      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={handleSubscribe}
        disabled={purchasing}
      >
        {purchasing ? (
          <ActivityIndicator size="small" color="#333" />
        ) : (
          <Text style={styles.subscribeButtonText}>
            S'abonner - {selectedPlan === 'yearly' ? '29,99\u20ac/an' : '4,99\u20ac/mois'}
          </Text>
        )}
      </TouchableOpacity>

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
    padding: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  headerDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  comparisonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  comparisonHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  featureLabel: {
    flex: 1,
  },
  planLabel: {
    width: 70,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  premiumLabel: {
    color: '#002395',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  featureRowAlt: {
    backgroundColor: '#FAFAFA',
  },
  featureName: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  checkCell: {
    width: 70,
    alignItems: 'center',
  },
  pricingSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ECECEC',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#002395',
    backgroundColor: '#F8F9FF',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  bestValueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002395',
    marginTop: 8,
  },
  planPeriod: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  planSaving: {
    fontSize: 12,
    color: '#2ECC71',
    fontWeight: '600',
    marginTop: 6,
  },
  selectedDot: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  subscribeButton: {
    backgroundColor: '#FFD700',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  disclaimer: {
    fontSize: 12,
    color: '#BBB',
    textAlign: 'center',
    marginTop: 4,
  },
  premiumActiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  starCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  premiumActiveTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  premiumActiveDesc: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  expiryText: {
    fontSize: 13,
    color: '#999',
    marginTop: 16,
  },
});
