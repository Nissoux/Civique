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
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Choisir la langue</Text>
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => handleSelect(lang.code)}
                >
                  <View style={styles.optionLeft}>
                    <Text style={[styles.optionName, isSelected && styles.optionNameSelected]}>
                      {lang.nativeName}
                    </Text>
                    <Text style={styles.optionSub}>{lang.name}</Text>
                  </View>
                  <View style={styles.optionRight}>
                    {lang.rtl && (
                      <View style={styles.rtlBadge}>
                        <Text style={styles.rtlText}>RTL</Text>
                      </View>
                    )}
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={22} color="#002395" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  optionSelected: {
    backgroundColor: '#EEF1FB',
    borderWidth: 1,
    borderColor: '#002395',
  },
  optionLeft: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  optionNameSelected: {
    color: '#002395',
    fontWeight: '600',
  },
  optionSub: {
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
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rtlText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
  },
});
