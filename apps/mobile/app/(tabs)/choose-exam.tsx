import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { EXAM_TYPES, useExamTypeStore } from '../../stores/examTypeStore';
import type { ExamTypeCode } from '../../stores/examTypeStore';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChooseExamScreen() {
  const { selectedExamType, setExamType } = useExamTypeStore();
  const router = useRouter();
  const c = useColors();

  const insets = useSafeAreaInsets();

  const handleSelect = async (code: ExamTypeCode) => {
    await setExamType(code);
    router.replace('/(tabs)');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl }]}
    >
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: c.primary + '15' }]}>
          <Text style={styles.headerEmoji}>🎯</Text>
        </View>
        <Text style={[styles.title, { color: c.textPrimary }]}>
          Quel examen préparez-vous ?
        </Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>
          Les questions et mises en situation seront adaptées à votre objectif
        </Text>
      </View>

      {EXAM_TYPES.map((examType) => {
        const isSelected = selectedExamType === examType.code;
        return (
          <TouchableOpacity
            key={examType.code}
            style={[
              styles.card,
              { backgroundColor: c.card, borderColor: c.border },
              isSelected && { borderColor: examType.color, backgroundColor: examType.color + '08' },
            ]}
            onPress={() => handleSelect(examType.code)}
            activeOpacity={0.7}
          >
            <View style={styles.cardTop}>
              <Text style={styles.cardEmoji}>{examType.emoji}</Text>
              <View style={styles.cardTitleRow}>
                <Text style={[styles.cardTitle, { color: c.textPrimary }]}>{examType.label}</Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={22} color={examType.color} />
                )}
              </View>
            </View>
            <Text style={[styles.cardDesc, { color: c.textSecondary }]}>{examType.description}</Text>
            <View style={[styles.cardFooter, { borderTopColor: c.border }]}>
              <View style={[styles.cardBadge, { backgroundColor: examType.color + '15' }]}>
                <Text style={[styles.cardBadgeText, { color: examType.color }]}>
                  {examType.code.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.cardAction, { color: examType.color }]}>
                {isSelected ? 'Sélectionné' : 'Choisir'}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <Text style={[styles.footer, { color: c.textTertiary }]}>
        Vous pourrez changer ce choix à tout moment depuis l'écran d'accueil
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.xxl,
    paddingTop: 20, // insets.top added dynamically
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  headerEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    flex: 1,
  },
  cardDesc: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.md,
    paddingLeft: 44,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  cardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardAction: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  footer: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 20,
  },
});
