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
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../../hooks/useAuth';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';

WebBrowser.maybeCompleteAuthSession();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GOOGLE_CLIENT_ID =
  '593427095159-ccfousaqelr1rj1mk9ojhifbo87levud.apps.googleusercontent.com';

export default function LoginScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  const { login, socialLogin, isSubmitting, error, clearError } = useAuth();

  const trimmedEmail = email.trim();
  const isValid = EMAIL_RE.test(trimmedEmail) && password.length >= 1;

  // ── Google Auth ──────────────────────────────
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_CLIENT_ID,
    clientId: GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        handleGoogleLogin(id_token);
      }
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    setSocialLoading('google');
    try {
      // Decode JWT payload to get email and name
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      await socialLogin('google', idToken, payload.email, payload.name);
    } catch {
      // error is set in hook
    } finally {
      setSocialLoading(null);
    }
  };

  // ── Apple Auth ───────────────────────────────
  const handleAppleLogin = async () => {
    setSocialLoading('apple');
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const idToken = credential.identityToken;
      if (!idToken) {
        throw new Error('No identity token from Apple');
      }

      const displayName =
        credential.fullName?.givenName && credential.fullName?.familyName
          ? `${credential.fullName.givenName} ${credential.fullName.familyName}`
          : undefined;

      // Decode JWT payload to get email
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      await socialLogin('apple', idToken, credential.email || payload.email, displayName);
    } catch (err: any) {
      if (err?.code !== 'ERR_REQUEST_CANCELED') {
        // error is set in hook
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const handleLogin = async () => {
    if (!isValid) return;
    try {
      await login(trimmedEmail, password);
    } catch {
      // error is set in hook
    }
  };

  const isBusy = isSubmitting || socialLoading !== null;

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
          editable={!isBusy}
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
            editable={!isBusy}
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
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          <Text style={[styles.forgotText, { color: c.primary }]}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: c.primary }]}
          onPress={() => {
            if (isBusy) return;
            if (!email.trim().includes('@')) { clearError(); return; }
            if (password.length < 1) return;
            handleLogin();
          }}
          activeOpacity={0.7}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        {/* ── Separator ─────────────────────────── */}
        <View style={styles.separatorContainer}>
          <View style={[styles.separatorLine, { backgroundColor: c.border }]} />
          <Text style={[styles.separatorText, { color: c.textTertiary }]}>ou</Text>
          <View style={[styles.separatorLine, { backgroundColor: c.border }]} />
        </View>

        {/* ── Social Login Buttons ──────────────── */}
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: '#FFFFFF', borderColor: c.border, borderWidth: 1 }]}
          onPress={() => {
            if (isBusy) return;
            clearError();
            promptAsync();
          }}
          activeOpacity={0.7}
          disabled={!request || isBusy}
        >
          {socialLoading === 'google' ? (
            <ActivityIndicator color="#4285F4" />
          ) : (
            <>
              <Image
                source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                style={styles.socialIcon}
              />
              <Text style={[styles.socialButtonText, { color: '#1A1A2E' }]}>
                Continuer avec Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: '#000000' }]}
            onPress={() => {
              if (isBusy) return;
              clearError();
              handleAppleLogin();
            }}
            activeOpacity={0.7}
            disabled={isBusy}
          >
            {socialLoading === 'apple' ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                <Text style={[styles.socialButtonText, { color: '#FFFFFF' }]}>
                  Continuer avec Apple
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

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
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    marginHorizontal: spacing.lg,
    fontSize: fontSize.sm,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    height: 56,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  link: {
    marginTop: spacing.lg,
    alignSelf: 'center',
  },
  linkText: {
    fontSize: fontSize.sm,
  },
});
