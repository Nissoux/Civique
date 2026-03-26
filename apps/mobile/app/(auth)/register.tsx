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
import { LANGUAGES, type Language } from '@civique/shared';
import { useAuth } from '../../hooks/useAuth';
import { useLanguageStore } from '../../stores/languageStore';

export default function RegisterScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>('fr');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isSubmitting, error, clearError } = useAuth();
  const { setLanguage } = useLanguageStore();

  const validationErrors: string[] = [];
  if (displayName.length > 0 && displayName.trim().length < 2) {
    validationErrors.push('Le nom doit contenir au moins 2 caract\u00e8res');
  }
  if (email.length > 0 && !email.includes('@')) {
    validationErrors.push('Email invalide');
  }
  if (password.length > 0 && password.length < 8) {
    validationErrors.push('Le mot de passe doit contenir au moins 8 caract\u00e8res');
  }
  if (confirmPassword.length > 0 && password !== confirmPassword) {
    validationErrors.push('Les mots de passe ne correspondent pas');
  }

  const isValid =
    displayName.trim().length >= 2 &&
    email.includes('@') &&
    password.length >= 8 &&
    password === confirmPassword;

  const handleRegister = async () => {
    if (!isValid) return;
    try {
      await setLanguage(selectedLang);
      await register(email.trim(), password, displayName.trim());
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

        <Text style={styles.title}>Cr{'\u00e9'}er un compte</Text>
        <Text style={styles.subtitle}>
          Rejoignez Civique pour pr{'\u00e9'}parer votre examen
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={18} color="#C62828" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {validationErrors.length > 0 && (
          <View style={styles.validationContainer}>
            {validationErrors.map((ve, i) => (
              <View key={i} style={styles.validationRow}>
                <Ionicons name="warning" size={14} color="#E65100" />
                <Text style={styles.validationText}>{ve}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nom d'affichage"
            placeholderTextColor="#AAA"
            value={displayName}
            onChangeText={(text) => {
              clearError();
              setDisplayName(text);
            }}
            autoComplete="name"
            editable={!isSubmitting}
          />
        </View>

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
            placeholder="Mot de passe (min. 8 caract\u00e8res)"
            placeholderTextColor="#AAA"
            value={password}
            onChangeText={(text) => {
              clearError();
              setPassword(text);
            }}
            secureTextEntry={!showPassword}
            autoComplete="new-password"
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

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor="#AAA"
            value={confirmPassword}
            onChangeText={(text) => {
              clearError();
              setConfirmPassword(text);
            }}
            secureTextEntry={!showPassword}
            editable={!isSubmitting}
          />
        </View>

        {/* Language Preference Picker */}
        <Text style={styles.sectionLabel}>Langue pr{'\u00e9'}f{'\u00e9'}r{'\u00e9'}e</Text>
        <View style={styles.langGrid}>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === selectedLang;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langChip,
                  isSelected && styles.langChipSelected,
                ]}
                onPress={() => setSelectedLang(lang.code)}
                disabled={isSubmitting}
              >
                <Text
                  style={[
                    styles.langChipText,
                    isSelected && styles.langChipTextSelected,
                  ]}
                >
                  {lang.nativeName}
                </Text>
                {lang.rtl && (
                  <View style={styles.rtlBadge}>
                    <Text style={styles.rtlText}>RTL</Text>
                  </View>
                )}
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={16} color="#002395" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.button, (!isValid || isSubmitting) && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={!isValid || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.buttonText}>S'inscrire</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/login" style={styles.link}>
          <Text style={styles.linkText}>
            D{'\u00e9'}j{'\u00e0'} inscrit ?{' '}
            <Text style={styles.linkBold}>Connectez-vous</Text>
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
    marginBottom: 24,
  },
  stripe: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#002395',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
    marginBottom: 28,
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
  validationContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    gap: 6,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  validationText: {
    color: '#E65100',
    fontSize: 13,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 15,
    color: '#333',
  },
  eyeButton: {
    padding: 8,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 4,
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  langChipSelected: {
    backgroundColor: '#EEF1FB',
    borderColor: '#002395',
  },
  langChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  langChipTextSelected: {
    color: '#002395',
    fontWeight: '600',
  },
  rtlBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  rtlText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#333',
  },
  button: {
    backgroundColor: '#002395',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
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
