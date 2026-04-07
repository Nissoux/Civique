import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

type Step = 'email' | 'code' | 'done';

export default function ForgotPasswordScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    if (!email.includes('@')) return;
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      setStep('code');
    } catch (err: any) {
      // Always show success to prevent email enumeration
      setStep('code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (code.length < 8 || newPassword.length < 8) return;
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/reset-password', {
        token: code.trim(),
        password: newPassword,
      });
      setStep('done');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={c.gradientHero} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + 16 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </AnimatedPressable>

          {step === 'email' && (
            <MotiView from={{ opacity: 0, translateY: 15 }} animate={{ opacity: 1, translateY: 0 }}>
              <Ionicons name="mail-outline" size={48} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.title}>Mot de passe oublié</Text>
              <Text style={styles.subtitle}>
                Entrez votre adresse e-mail. Nous vous enverrons un code de réinitialisation.
              </Text>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TextInput
                style={styles.input}
                placeholder="Adresse e-mail"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <AnimatedPressable onPress={handleSendCode} disabled={!email.includes('@') || loading} scaleDown={0.97}>
                <LinearGradient colors={['#FFFFFF', '#E8E8F0']} style={[styles.button, (!email.includes('@') || loading) && { opacity: 0.5 }]}>
                  {loading ? (
                    <ActivityIndicator color="#002395" />
                  ) : (
                    <Text style={styles.buttonText}>Envoyer le code</Text>
                  )}
                </LinearGradient>
              </AnimatedPressable>
            </MotiView>
          )}

          {step === 'code' && (
            <MotiView from={{ opacity: 0, translateY: 15 }} animate={{ opacity: 1, translateY: 0 }}>
              <Ionicons name="key-outline" size={48} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.title}>Entrez le code</Text>
              <Text style={styles.subtitle}>
                Un code a été envoyé à {email}. Copiez-le ci-dessous avec votre nouveau mot de passe.
              </Text>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TextInput
                style={styles.input}
                placeholder="Code reçu par e-mail"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={code}
                onChangeText={setCode}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextInput
                style={styles.input}
                placeholder="Nouveau mot de passe (min. 8 caractères)"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />

              <AnimatedPressable
                onPress={handleResetPassword}
                disabled={code.length < 8 || newPassword.length < 8 || loading}
                scaleDown={0.97}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#E8E8F0']}
                  style={[styles.button, (code.length < 8 || newPassword.length < 8 || loading) && { opacity: 0.5 }]}
                >
                  {loading ? (
                    <ActivityIndicator color="#002395" />
                  ) : (
                    <Text style={styles.buttonText}>Réinitialiser</Text>
                  )}
                </LinearGradient>
              </AnimatedPressable>

              <AnimatedPressable onPress={() => setStep('email')} haptic={false}>
                <Text style={styles.linkText}>Renvoyer le code</Text>
              </AnimatedPressable>
            </MotiView>
          )}

          {step === 'done' && (
            <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Ionicons name="checkmark-circle" size={64} color="#4ADE80" style={styles.icon} />
              <Text style={styles.title}>Mot de passe réinitialisé</Text>
              <Text style={styles.subtitle}>
                Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.
              </Text>

              <AnimatedPressable onPress={() => router.replace('/(auth)/login')} scaleDown={0.97}>
                <LinearGradient colors={['#FFFFFF', '#E8E8F0']} style={styles.button}>
                  <Text style={styles.buttonText}>Se connecter</Text>
                </LinearGradient>
              </AnimatedPressable>
            </MotiView>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl },
  backButton: { position: 'absolute', top: 0, left: 0, padding: spacing.sm },
  icon: { alignSelf: 'center', marginBottom: spacing.xl },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 83, 80, 0.15)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.3)',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: { color: '#F87171', fontSize: fontSize.sm, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: '#FFFFFF',
    marginBottom: spacing.lg,
  },
  button: {
    borderRadius: borderRadius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#002395',
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  linkText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
