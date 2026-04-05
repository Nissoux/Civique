import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, spacing, fontSize, borderRadius } from '../constants/theme';

interface QuotaPaywallProps {
  type: 'daily' | 'weekly';
  used: number;
  limit: number;
  resetsAt?: string;
}

export default function QuotaPaywall({ type, used, limit, resetsAt }: QuotaPaywallProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const resetDate = resetsAt ? new Date(resetsAt) : null;
  const resetLabel = resetDate
    ? resetDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

  return (
    <View style={[styles.container, { backgroundColor: c.background, paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
      <View style={[styles.card, { backgroundColor: c.card }]}>
        <View style={[styles.iconCircle, { backgroundColor: c.accentBg }]}>
          <Ionicons name="lock-closed" size={32} color={c.accent} />
        </View>

        <Text style={[styles.title, { color: c.textPrimary }]}>
          {type === 'daily' ? 'Limite quotidienne atteinte' : 'Limite hebdomadaire atteinte'}
        </Text>

        <Text style={[styles.desc, { color: c.textSecondary }]}>
          {type === 'daily'
            ? `Vous avez utilisé vos ${limit} questions gratuites aujourd'hui.`
            : `Vous avez utilisé votre examen blanc gratuit cette semaine.`
          }
        </Text>

        {resetLabel && (
          <View style={[styles.resetRow, { backgroundColor: c.surfaceElevated }]}>
            <Ionicons name="time-outline" size={16} color={c.textTertiary} />
            <Text style={[styles.resetText, { color: c.textSecondary }]}>
              Prochaine réinitialisation : {resetLabel}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.premiumButton, { backgroundColor: c.primary }]}
          onPress={() => router.push('/settings/subscription')}
        >
          <Ionicons name="star" size={18} color="#FFFFFF" />
          <Text style={styles.premiumButtonText}>Voir les offres Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={[styles.backText, { color: c.textTertiary }]}>Revenir plus tard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.xxl },
  card: { borderRadius: borderRadius.xl, padding: spacing.xxxl, alignItems: 'center' },
  iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  title: { fontSize: fontSize.xl, fontWeight: 'bold', textAlign: 'center', marginBottom: spacing.md },
  desc: { fontSize: fontSize.md, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  resetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
    width: '100%',
    justifyContent: 'center',
  },
  resetText: { fontSize: fontSize.sm },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    height: 56,
    width: '100%',
    marginBottom: spacing.md,
  },
  premiumButtonText: { color: '#FFFFFF', fontSize: fontSize.md, fontWeight: '600' },
  backButton: { padding: spacing.md },
  backText: { fontSize: fontSize.md },
});
