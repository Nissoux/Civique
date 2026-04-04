import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { forgotPassword, verifyResetCode, resetPassword } from '../../services/auth';

type Step = 1 | 2 | 3;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // State machine
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 - Email
  const [email, setEmail] = useState('');

  // Step 2 - Code
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeRefs = useRef<(TextInput | null)[]>([]);
  const [resetToken, setResetToken] = useState('');

  // Step 3 - New password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const trimmedEmail = email.trim().toLowerCase();
  const codeString = code.join('');

  // ── Step 1: Send code ────────────────────────
  const handleSendCode = async () => {
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError('Veuillez saisir un email valide.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await forgotPassword(trimmedEmail);
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify code ──────────────────────
  const handleVerifyCode = async () => {
    if (codeString.length !== 6) {
      setError('Veuillez saisir le code complet.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await verifyResetCode(trimmedEmail, codeString);
      setResetToken(result.resetToken);
      setStep(3);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset password ───────────────────
  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(trimmedEmail, resetToken, newPassword);
      router.replace('/(auth)/login');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  // ── Code input handler ───────────────────────
  const handleCodeChange = (text: string, index: number) => {
    // Handle paste of full code
    if (text.length > 1) {
      const digits = text.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((d, i) => {
        if (index + i < 6) newCode[index + i] = d;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      codeRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = text.replace(/\D/g, '');
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError('');

    if (digit && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      codeRefs.current[index - 1]?.focus();
    }
  };

  // ── Step titles ──────────────────────────────
  const stepTitle = {
    1: 'Mot de passe oublié',
    2: 'Vérification',
    3: 'Nouveau mot de passe',
  }[step];

  const stepSubtitle = {
    1: 'Entrez votre adresse email pour recevoir un code de vérification.',
    2: `Un code à 6 chiffres a été envoyé à ${trimmedEmail}`,
    3: 'Choisissez un nouveau mot de passe pour votre compte.',
  }[step];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: c.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + 16 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (step === 1) {
              router.back();
            } else {
              setError('');
              setStep((step - 1) as Step);
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={c.textPrimary} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: c.primaryLight }]}>
            <Ionicons
              name={step === 3 ? 'lock-closed' : step === 2 ? 'mail-open' : 'key'}
              size={32}
              color={c.primary}
            />
          </View>
          <Text style={[styles.title, { color: c.textPrimary }]}>{stepTitle}</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>{stepSubtitle}</Text>
        </View>

        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.stepDot,
                {
                  backgroundColor: s <= step ? c.primary : c.progressBg,
                  width: s === step ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Error */}
        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: c.errorBg }]}>
            <Ionicons name="warning" size={16} color={c.error} />
            <Text style={[styles.errorText, { color: c.error }]}>{error}</Text>
          </View>
        ) : null}

        {/* Step 1: Email */}
        {step === 1 && (
          <View>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: c.inputBg, borderColor: c.border, color: c.textPrimary },
              ]}
              placeholder="Email"
              placeholderTextColor={c.textTertiary}
              value={email}
              onChangeText={(t) => {
                setError('');
                setEmail(t);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoFocus
              editable={!loading}
            />
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: c.primary, opacity: loading ? 0.7 : 1 },
              ]}
              onPress={handleSendCode}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Envoyer le code</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Code */}
        {step === 2 && (
          <View>
            <View style={styles.codeContainer}>
              {code.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(ref) => {
                    codeRefs.current[i] = ref;
                  }}
                  style={[
                    styles.codeInput,
                    {
                      backgroundColor: c.inputBg,
                      borderColor: digit ? c.primary : c.border,
                      color: c.textPrimary,
                    },
                  ]}
                  value={digit}
                  onChangeText={(t) => handleCodeChange(t, i)}
                  onKeyPress={({ nativeEvent }) => handleCodeKeyPress(nativeEvent.key, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  autoFocus={i === 0}
                  editable={!loading}
                  selectTextOnFocus
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: c.primary, opacity: loading ? 0.7 : 1 },
              ]}
              onPress={handleVerifyCode}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Vérifier</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendLink}
              onPress={() => {
                setCode(['', '', '', '', '', '']);
                setError('');
                handleSendCode();
              }}
              disabled={loading}
            >
              <Text style={[styles.resendText, { color: c.primary }]}>
                Renvoyer le code
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: New password */}
        {step === 3 && (
          <View>
            <View
              style={[
                styles.passwordContainer,
                { backgroundColor: c.inputBg, borderColor: c.border },
              ]}
            >
              <TextInput
                style={[styles.passwordInput, { color: c.textPrimary }]}
                placeholder="Nouveau mot de passe"
                placeholderTextColor={c.textTertiary}
                value={newPassword}
                onChangeText={(t) => {
                  setError('');
                  setNewPassword(t);
                }}
                secureTextEntry={!showPassword}
                autoFocus
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color={c.textTertiary}
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.input,
                { backgroundColor: c.inputBg, borderColor: c.border, color: c.textPrimary },
              ]}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={c.textTertiary}
              value={confirmPassword}
              onChangeText={(t) => {
                setError('');
                setConfirmPassword(t);
              }}
              secureTextEntry={!showPassword}
              editable={!loading}
            />

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: c.primary, opacity: loading ? 0.7 : 1 },
              ]}
              onPress={handleResetPassword}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Réinitialiser</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xxl,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  stepDot: {
    height: 8,
    borderRadius: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.sm,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: fontSize.md,
    marginBottom: spacing.lg,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  passwordInput: {
    flex: 1,
    padding: spacing.lg,
    fontSize: fontSize.md,
  },
  eyeButton: {
    padding: spacing.lg,
  },
  button: {
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: borderRadius.md,
    textAlign: 'center',
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
  },
  resendLink: {
    alignSelf: 'center',
    marginTop: spacing.xl,
    padding: spacing.sm,
  },
  resendText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
