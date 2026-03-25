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
import { useAuth } from '../../hooks/useAuth';

export default function RegisterScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isSubmitting, error, clearError } = useAuth();

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

  const isValid =
    displayName.trim().length >= 2 &&
    email.includes('@') &&
    password.length >= 8;

  const handleRegister = async () => {
    if (!isValid) return;
    try {
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
        <Text style={styles.title}>Cr{'\u00e9'}er un compte</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {validationErrors.length > 0 && (
          <View style={styles.validationContainer}>
            {validationErrors.map((ve, i) => (
              <Text key={i} style={styles.validationText}>
                {ve}
              </Text>
            ))}
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Nom d'affichage"
          value={displayName}
          onChangeText={(text) => {
            clearError();
            setDisplayName(text);
          }}
          autoComplete="name"
          editable={!isSubmitting}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
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

        <TextInput
          style={styles.input}
          placeholder="Mot de passe (min. 8 caract\u00e8res)"
          value={password}
          onChangeText={(text) => {
            clearError();
            setPassword(text);
          }}
          secureTextEntry
          autoComplete="new-password"
          editable={!isSubmitting}
        />

        <TouchableOpacity
          style={[styles.button, (!isValid || isSubmitting) && styles.buttonDisabled]}
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
          <Text style={styles.linkText}>
            D{'\u00e9'}j{'\u00e0'} un compte ? Se connecter
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#002395',
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
  validationContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  validationText: {
    color: '#E65100',
    fontSize: 13,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
  },
  button: {
    backgroundColor: '#002395',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    height: 56,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#99A8CC',
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
    color: '#002395',
    fontSize: 14,
  },
});
