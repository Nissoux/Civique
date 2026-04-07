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
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from '../../components/ui/MotiView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { AnimatedPressable, CMotif } from '../../components/ui';
import { performGoogleSignIn, performAppleSignIn, isAppleSignInAvailable } from '../../services/socialAuth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isSubmitting, error, clearError, setTokens, setUser } = useAuth();
  const router = useRouter();
  const [showApple, setShowApple] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  useEffect(() => {
    isAppleSignInAvailable().then(setShowApple);
  }, []);

  const handleGoogleLogin = async () => {
    setSocialLoading(true);
    try {
      const result = await performGoogleSignIn();
      if (result) {
        await setTokens(result.accessToken, result.refreshToken);
        setUser(result.user);
        router.replace('/(tabs)');
      }
    } catch {
      Alert.alert('Erreur', 'La connexion avec Google a échoué.');
    } finally {
      setSocialLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setSocialLoading(true);
    try {
      const result = await performAppleSignIn();
      if (result) {
        await setTokens(result.accessToken, result.refreshToken);
        setUser(result.user);
        router.replace('/(tabs)');
      }
    } catch {
      Alert.alert('Erreur', 'La connexion avec Apple a échoué.');
    } finally {
      setSocialLoading(false);
    }
  };

  const isValid = EMAIL_RE.test(email) && password.length >= 1;

  const handleLogin = async () => {
    if (!isValid) return;
    try {
      await login(email.trim().toLowerCase(), password);
    } catch {
      // error is set in hook
    }
  };

  return (
    <LinearGradient
      colors={c.gradientHero}
      style={styles.gradient}
    >
      {/* C Motifs decoration */}
      <CMotif size="xl" color="#FFFFFF" opacity="subtle" rotation={-45} style={{ top: '8%', right: -25 }} />
      <CMotif size="lg" color="#4D7CFF" opacity="subtle" rotation={60} style={{ bottom: '15%', left: -20 }} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + 16 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <MotiView
            from={{ opacity: 0, scale: 0.8, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 12, delay: 0 }}
          >
            <View style={styles.logoSection}>
              <Image
                source={require('../../assets/logo-c.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.title}>Civique</Text>
              <Text style={styles.subtitle}>
                Préparez votre examen de citoyenneté
              </Text>
            </View>
          </MotiView>

          {/* Error */}
          {error && (
            <MotiView
              from={{ opacity: 0, translateX: 20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <View style={[styles.errorContainer, { backgroundColor: 'rgba(239, 83, 80, 0.15)', borderColor: 'rgba(239, 83, 80, 0.3)' }]}>
                <Ionicons name="warning" size={16} color="#EF5350" />
                <Text style={[styles.errorText, { color: '#EF5350' }]}>{error}</Text>
              </View>
            </MotiView>
          )}

          {/* Email */}
          <TextInput
            style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }]}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={email}
            onChangeText={(text) => { clearError(); setEmail(text); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="off"
            textContentType="none"
            editable={!isSubmitting}
          />

          {/* Password */}
          <View style={[styles.passwordContainer, { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }]}>
            <TextInput
              style={[styles.passwordInput, { color: '#FFFFFF' }]}
              placeholder="Mot de passe"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={password}
              onChangeText={(text) => { clearError(); setPassword(text); }}
              secureTextEntry={!showPassword}
              autoComplete="off"
              textContentType="none"
              editable={!isSubmitting}
            />
              <AnimatedPressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                haptic={false}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="rgba(255,255,255,0.4)"
                />
              </AnimatedPressable>
            </View>

          {/* Forgot password */}
          <AnimatedPressable
            style={styles.forgotLink}
            onPress={() => router.push('/(auth)/forgot-password')}
            haptic={false}
          >
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </AnimatedPressable>

          {/* Submit button */}
            <AnimatedPressable
              onPress={handleLogin}
              disabled={!isValid || isSubmitting}
              scaleDown={0.97}
            >
              <LinearGradient
                colors={['#FFFFFF', '#E8E8F0']}
                style={[styles.button, (!isValid || isSubmitting) && { opacity: 0.5 }]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#002395" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Se connecter</Text>
                    <Ionicons name="arrow-forward" size={20} color="#002395" />
                  </>
                )}
              </LinearGradient>
            </AnimatedPressable>

          {/* Separator */}
          <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.separatorLine} />
            </View>

          {/* Social login buttons */}
            <AnimatedPressable
              onPress={handleGoogleLogin}
              style={styles.socialButton}
              scaleDown={0.95}
            >
              <Ionicons name="logo-google" size={20} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Continuer avec Google</Text>
            </AnimatedPressable>
            {showApple && (
              <AnimatedPressable
                onPress={handleAppleLogin}
                style={[styles.socialButton, { marginTop: spacing.md }]}
                scaleDown={0.95}
              >
                <Ionicons name="logo-apple" size={22} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Continuer avec Apple</Text>
              </AnimatedPressable>
            )}

          {/* Register link */}
          <Link href="/(auth)/register" style={styles.link}>
            <Text style={styles.linkText}>
              Pas encore de compte ?{' '}
              <Text style={styles.linkBold}>S'inscrire</Text>
            </Text>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
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
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 26,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
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
    color: 'rgba(255,255,255,0.5)',
  },
  button: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: '#002395',
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  link: {
    marginTop: spacing.xxl,
    alignSelf: 'center',
  },
  linkText: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.5)',
  },
  linkBold: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  separatorText: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: borderRadius.md,
    paddingVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
