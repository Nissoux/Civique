import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { AnimatedPressable } from '../../components/ui';
import { MotiView } from '../../components/ui/MotiView';
import api from '../../services/api';

export default function VerifyEmailScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/verify-email', { code: code.trim() });
      setVerified(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Code invalide.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-verification');
      Alert.alert('Code envoyé', 'Un nouveau code a été envoyé à votre adresse e-mail.');
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.error || 'Impossible de renvoyer le code.');
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <LinearGradient colors={c.gradientHero} style={{ flex: 1 }}>
        <View style={[styles.container, { paddingTop: insets.top + 60 }]}>
          <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <Ionicons name="checkmark-circle" size={80} color="#4ADE80" style={styles.icon} />
            <Text style={styles.title}>E-mail vérifié !</Text>
            <Text style={styles.subtitle}>Votre compte est activé. Bienvenue sur Civique.</Text>
            <AnimatedPressable onPress={() => router.replace('/(tabs)')} scaleDown={0.97}>
              <LinearGradient colors={['#FFFFFF', '#E8E8F0']} style={styles.button}>
                <Text style={styles.buttonText}>Commencer</Text>
              </LinearGradient>
            </AnimatedPressable>
          </MotiView>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={c.gradientHero} style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top + 60 }]}>
        <MotiView from={{ opacity: 0, translateY: 15 }} animate={{ opacity: 1, translateY: 0 }}>
          <Ionicons name="mail-open-outline" size={56} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.title}>Vérifiez votre e-mail</Text>
          <Text style={styles.subtitle}>
            Un code à 6 chiffres a été envoyé à votre adresse e-mail. Entrez-le ci-dessous pour activer votre compte.
          </Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TextInput
            style={styles.codeInput}
            placeholder="000000"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={code}
            onChangeText={(text) => {
              setError(null);
              setCode(text.replace(/[^0-9]/g, '').substring(0, 6));
            }}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
          />

          <AnimatedPressable
            onPress={handleVerify}
            disabled={code.length !== 6 || loading}
            scaleDown={0.97}
          >
            <LinearGradient
              colors={['#FFFFFF', '#E8E8F0']}
              style={[styles.button, (code.length !== 6 || loading) && { opacity: 0.5 }]}
            >
              {loading ? (
                <ActivityIndicator color="#002395" />
              ) : (
                <Text style={styles.buttonText}>Vérifier</Text>
              )}
            </LinearGradient>
          </AnimatedPressable>

          <AnimatedPressable onPress={handleResend} disabled={resending} haptic={false}>
            <Text style={styles.resendText}>
              {resending ? 'Envoi en cours...' : 'Renvoyer le code'}
            </Text>
          </AnimatedPressable>
        </MotiView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
  },
  icon: { alignSelf: 'center', marginBottom: spacing.xl },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  errorBox: {
    backgroundColor: 'rgba(239,83,80,0.15)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(239,83,80,0.3)',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: { color: '#F87171', fontSize: fontSize.sm, textAlign: 'center' },
  codeInput: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 12,
    marginBottom: spacing.xl,
  },
  button: {
    borderRadius: borderRadius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#002395',
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  resendText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
