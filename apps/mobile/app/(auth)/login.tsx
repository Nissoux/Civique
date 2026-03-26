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
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isSubmitting, error, clearError } = useAuth();

  const isValid = email.includes('@') && password.length >= 1;

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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* French Flag Stripe */}
        <View style={styles.flagStripe}>
          <View style={[styles.stripe, { backgroundColor: '#002395' }]} />
          <View style={[styles.stripe, { backgroundColor: '#FFFFFF' }]} />
          <View style={[styles.stripe, { backgroundColor: '#ED2939' }]} />
        </View>

        {/* Logo Area */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={40} color="#002395" />
          </View>
          <Text style={styles.title}>Civique</Text>
          <Text style={styles.subtitle}>
            Pr{'\u00e9'}parez votre examen de citoyennet{'\u00e9'} fran{'\u00e7'}aise
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={18} color="#C62828" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#AAA"
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
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#AAA"
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
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, (!isValid || isSubmitting) && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!isValid || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.buttonText}>Se connecter</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/register" style={styles.link}>
          <Text style={styles.linkText}>
            Pas encore de compte ?{' '}
            <Text style={styles.linkBold}>Inscrivez-vous</Text>
          </Text>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  flagStripe: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 32,
  },
  stripe: {
    flex: 1,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF1FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#002395',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#002395',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 8,
  },
  button: {
    backgroundColor: '#002395',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    height: 56,
    gap: 8,
    shadowColor: '#002395',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#99A8CC',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    marginTop: 24,
    alignSelf: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 14,
  },
  linkBold: {
    color: '#002395',
    fontWeight: '600',
  },
});
