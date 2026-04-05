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
import { Link } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from '../../components/ui/MotiView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { AnimatedPressable, CMotif } from '../../components/ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const { register, isSubmitting, error, clearError } = useAuth();

  const validationErrors: string[] = [];
  if (touched.name && displayName.trim().length > 0 && displayName.trim().length < 2) {
    validationErrors.push('Le nom doit contenir au moins 2 caractères');
  }
  if (touched.email && email.length > 0 && !EMAIL_RE.test(email)) {
    validationErrors.push('Adresse email invalide');
  }
  if (touched.password && password.length > 0 && password.length < 8) {
    validationErrors.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  const isValid =
    displayName.trim().length >= 2 &&
    EMAIL_RE.test(email) &&
    password.length >= 8;

  const handleRegister = async () => {
    setTouched({ name: true, email: true, password: true });
    if (!isValid) return;
    try {
      await register(email.trim().toLowerCase(), password, displayName.trim());
    } catch {
      // error is set in hook
    }
  };

  return (
    <LinearGradient colors={c.gradientHero} style={{ flex: 1 }}>
      <CMotif size="xl" color="#FFFFFF" opacity="subtle" rotation={50} style={{ top: '12%', left: -25 }} />
      <CMotif size="md" color="#4D7CFF" opacity="subtle" rotation={-40} style={{ bottom: '20%', right: -15 }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + 16 }]}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView from={{ opacity: 0, translateY: 15 }} animate={{ opacity: 1, translateY: 0 }}>
          <Text style={[styles.title, { color: '#FFFFFF' }]}>Créer un compte</Text>
          <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.6)' }]}>
            Rejoignez Civique et préparez votre examen
          </Text>
        </MotiView>

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: c.errorBg }]}>
            <Ionicons name="warning" size={16} color={c.error} />
            <Text style={[styles.errorText, { color: c.error }]}>{error}</Text>
          </View>
        )}

        {validationErrors.length > 0 && (
          <View style={[styles.validationContainer, { backgroundColor: c.warningBg }]}>
            {validationErrors.map((ve, i) => (
              <Text key={i} style={[styles.validationText, { color: c.warning }]}>{ve}</Text>
            ))}
          </View>
        )}

        <TextInput
          style={[styles.input, { backgroundColor: c.inputBg, borderColor: c.border, color: c.textPrimary }]}
          placeholder="Nom d'affichage"
          placeholderTextColor={c.textTertiary}
          value={displayName}
          onChangeText={(text) => { clearError(); setDisplayName(text); }}
          onBlur={() => setTouched((p) => ({ ...p, name: true }))}
          autoComplete="name"
          editable={!isSubmitting}
        />

        <TextInput
          style={[styles.input, { backgroundColor: c.inputBg, borderColor: c.border, color: c.textPrimary }]}
          placeholder="Email"
          placeholderTextColor={c.textTertiary}
          value={email}
          onChangeText={(text) => { clearError(); setEmail(text); }}
          onBlur={() => setTouched((p) => ({ ...p, email: true }))}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isSubmitting}
        />

        <View style={[styles.passwordContainer, { backgroundColor: c.inputBg, borderColor: c.border }]}>
          <TextInput
            style={[styles.passwordInput, { color: c.textPrimary }]}
            placeholder="Mot de passe (min. 8 caractères)"
            placeholderTextColor={c.textTertiary}
            value={password}
            onChangeText={(text) => { clearError(); setPassword(text); }}
            onBlur={() => setTouched((p) => ({ ...p, password: true }))}
            secureTextEntry={!showPassword}
            autoComplete="new-password"
            editable={!isSubmitting}
          />
          <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color={c.textTertiary} />
          </TouchableOpacity>
        </View>

        {password.length > 0 && (
          <View style={styles.strengthRow}>
            <View style={[styles.strengthBar, { backgroundColor: c.progressBg }]}>
              <View style={[styles.strengthFill, {
                backgroundColor: password.length >= 8 ? c.success : c.warning,
                width: `${Math.min(100, (password.length / 8) * 100)}%`,
              }]} />
            </View>
            <Text style={[styles.strengthText, { color: c.textTertiary }]}>
              {password.length < 8 ? `${password.length}/8` : '\u2713'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: c.primary }, (!isValid || isSubmitting) && { opacity: 0.5 }]}
          onPress={handleRegister}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>S'inscrire</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/login" style={styles.link}>
          <Text style={[styles.linkText, { color: c.textSecondary }]}>
            Déjà un compte ?{' '}
            <Text style={{ color: c.primary, fontWeight: '600' }}>Se connecter</Text>
          </Text>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl },
  title: { fontSize: fontSize.title, fontWeight: 'bold', textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.md, textAlign: 'center', marginBottom: spacing.xxxl },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.lg },
  errorText: { fontSize: fontSize.sm, flex: 1 },
  validationContainer: { borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.lg },
  validationText: { fontSize: fontSize.sm, marginBottom: 2 },
  input: { borderWidth: 1, borderRadius: borderRadius.md, padding: spacing.lg, fontSize: fontSize.md, marginBottom: spacing.lg },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: borderRadius.md, marginBottom: spacing.sm },
  passwordInput: { flex: 1, padding: spacing.lg, fontSize: fontSize.md },
  eyeButton: { padding: spacing.lg },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  strengthBar: { height: 4, flex: 1, borderRadius: 2, overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 2 },
  strengthText: { fontSize: fontSize.xs, width: 24, textAlign: 'center' },
  button: { borderRadius: borderRadius.md, padding: spacing.lg, alignItems: 'center', height: 56, justifyContent: 'center', marginTop: spacing.sm },
  buttonText: { color: '#FFFFFF', fontSize: fontSize.lg, fontWeight: '600' },
  link: { marginTop: spacing.xxl, alignSelf: 'center' },
  linkText: { fontSize: fontSize.sm },
});
