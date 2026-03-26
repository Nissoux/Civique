import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LANGUAGES, type Language } from '@civique/shared';
import { useLanguageStore } from '../stores/languageStore';
import api from '../services/api';

interface LanguagePickerProps {
  onLanguageChange?: (lang: Language) => void;
}

export default function LanguagePicker({ onLanguageChange }: LanguagePickerProps) {
  const [visible, setVisible] = useState(false);
  const { currentLang, setLanguage } = useLanguageStore();

  const currentLangDef = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];

  const handleSelect = async (code: Language) => {
    await setLanguage(code);
    setVisible(false);
    try {
      await api.patch('/auth/me', { preferredLang: code });
    } catch {
      // silent - local state already updated
    }
    onLanguageChange?.(code);
  };

  return (
    <>
      <TouchableOpacity style={styles.pill} onPress={() => setVisible(true)}>
        <Ionicons name="language" size={16} color="#002395" />
        <Text style={styles.pillText}>{currentLangDef.code.toUpperCase()}</Text>
        <Ionicons name="chevron-down" size={14} color="#002395" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Choisir la langue</Text>
            <Text style={styles.sheetSubtitle}>
              S{'\u00e9'}lectionnez votre langue pr{'\u00e9'}f{'\u00e9'}r{'\u00e9'}e
            </Text>
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => handleSelect(lang.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionLeft}>
                    <Text style={[styles.optionNative, isSelected && styles.optionNativeSelected]}>
                      {lang.nativeName}
                    </Text>
                    <Text style={styles.optionName}>{lang.name}</Text>
                  </View>
                  <View style={styles.optionRight}>
                    {lang.rtl && (
                      <View style={styles.rtlBadge}>
                        <Text style={styles.rtlText}>RTL</Text>
                      </View>
                    )}
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={24} color="#002395" />
                    ) : (
                      <View style={styles.unselectedCircle} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF1FB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002395',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#F0F3FF',
    borderColor: '#002395',
  },
  optionLeft: {
    flex: 1,
  },
  optionNative: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
  },
  optionNativeSelected: {
    color: '#002395',
    fontWeight: '700',
  },
  optionName: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rtlBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rtlText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DDD',
  },
});
