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
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isSubmitting, error, clearError } = useAuth();

  const isValid = EMAIL_RE.test(email) && password.length >= 1;

  const handleLogin = async () => {
    if (!isValid) return;
    try {
      await login(email.trim(), password);
    } catch {
      // error is set in hook
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: c.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + 16 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoSection}>
          <View style={[styles.logoCircle, { backgroundColor: c.primaryLight }]}>
            <Ionicons name="shield-checkmark" size={40} color={c.primary} />
          </View>
          <Text style={[styles.title, { color: c.textPrimary }]}>Civique</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>
            Préparez votre examen de citoyenneté
          </Text>
        </View>

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: c.errorBg }]}>
            <Ionicons name="warning" size={16} color={c.error} />
            <Text style={[styles.errorText, { color: c.error }]}>{error}</Text>
          </View>
        )}

        <TextInput
          style={[styles.input, { backgroundColor: c.inputBg, borderColor: c.border, color: c.textPrimary }]}
          placeholder="Email"
          placeholderTextColor={c.textTertiary}
          value={email}
          onChangeText={(text) => {
            clearError();
            setEmail(text);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isSubmitting}
        />

        <View style={[styles.passwordContainer, { backgroundColor: c.inputBg, borderColor: c.border }]}>
          <TextInput
            style={[styles.passwordInput, { color: c.textPrimary }]}
            placeholder="Mot de passe"
            placeholderTextColor={c.textTertiary}
            value={password}
            onChangeText={(text) => {
              clearError();
              setPassword(text);
            }}
            secureTextEntry={!showPassword}
            autoComplete="password"
            editable={!isSubmitting}
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

        <TouchableOpacity
          style={styles.forgotLink}
          onPress={() => Alert.alert(
            'Mot de passe oublié',
            'Contactez le support à support@integrafle.fr pour réinitialiser votre mot de passe.'
          )}
        >
          <Text style={[styles.forgotText, { color: c.primary }]}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: c.primary }, (!isValid || isSubmitting) && { opacity: 0.5 }]}
          onPress={handleLogin}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/register" style={styles.link}>
          <Text style={[styles.linkText, { color: c.textSecondary }]}>
            Pas encore de compte ?{' '}
            <Text style={{ color: c.primary, fontWeight: '600' }}>S'inscrire</Text>
          </Text>
        </Link>
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
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: 'center',
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
    marginBottom: spacing.sm,
  },
  passwordInput: {
    flex: 1,
    padding: spacing.lg,
    fontSize: fontSize.md,
  },
  eyeButton: {
    padding: spacing.lg,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotText: {
    fontSize: fontSize.sm,
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
  link: {
    marginTop: spacing.xxl,
    alignSelf: 'center',
  },
  linkText: {
    fontSize: fontSize.sm,
  },
});
