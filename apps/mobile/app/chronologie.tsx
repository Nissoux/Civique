import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors, spacing, fontSize, borderRadius } from '../constants/theme';

type EventCategory = 'institution' | 'rights' | 'social';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  category: EventCategory;
}

const TIMELINE_DATA: TimelineEvent[] = [
  {
    year: '1789',
    title: 'Revolution francaise',
    description: 'Prise de la Bastille le 14 juillet',
    category: 'institution',
  },
  {
    year: '1789',
    title: 'Declaration des Droits de l\'Homme et du Citoyen',
    description: 'Texte fondateur des libertes fondamentales',
    category: 'rights',
  },
  {
    year: '1791',
    title: 'Premiere Constitution',
    description: 'Monarchie constitutionnelle',
    category: 'institution',
  },
  {
    year: '1792',
    title: 'Premiere Republique',
    description: 'Abolition de la monarchie, proclamation de la Republique',
    category: 'institution',
  },
  {
    year: '1848',
    title: 'Abolition de l\'esclavage',
    description: 'Decret porte par Victor Schoelcher',
    category: 'rights',
  },
  {
    year: '1848',
    title: 'Suffrage universel masculin',
    description: 'Tous les hommes de plus de 21 ans peuvent voter',
    category: 'rights',
  },
  {
    year: '1881-1882',
    title: 'Lois Jules Ferry',
    description: 'Ecole laique, gratuite et obligatoire',
    category: 'social',
  },
  {
    year: '1905',
    title: 'Separation des Eglises et de l\'Etat',
    description: 'Loi garantissant la laicite de la Republique',
    category: 'institution',
  },
  {
    year: '1944',
    title: 'Droit de vote des femmes',
    description: 'Les femmes obtiennent le droit de vote',
    category: 'rights',
  },
  {
    year: '1945',
    title: 'Fin de la Seconde Guerre mondiale',
    description: 'Liberation de la France et victoire des Allies',
    category: 'institution',
  },
  {
    year: '1945',
    title: 'Creation de la Securite sociale',
    description: 'Systeme de protection sociale universel',
    category: 'social',
  },
  {
    year: '1946',
    title: 'IVe Republique',
    description: 'Nouvelle constitution apres la Liberation',
    category: 'institution',
  },
  {
    year: '1957',
    title: 'Traite de Rome',
    description: 'Creation de la Communaute economique europeenne (CEE)',
    category: 'institution',
  },
  {
    year: '1958',
    title: 'Ve Republique',
    description: 'Constitution du 4 octobre, regime actuel',
    category: 'institution',
  },
  {
    year: '1962',
    title: 'Election du President au suffrage universel direct',
    description: 'Referendum modifiant le mode d\'election presidentielle',
    category: 'institution',
  },
  {
    year: '1974',
    title: 'Majorite a 18 ans',
    description: 'Abaissement de l\'age de la majorite de 21 a 18 ans',
    category: 'rights',
  },
  {
    year: '1975',
    title: 'Loi Veil (IVG)',
    description: 'Legalisation de l\'interruption volontaire de grossesse',
    category: 'rights',
  },
  {
    year: '1981',
    title: 'Abolition de la peine de mort',
    description: 'Loi portee par Robert Badinter',
    category: 'rights',
  },
  {
    year: '2000',
    title: 'Quinquennat',
    description: 'Mandat presidentiel reduit de 7 a 5 ans',
    category: 'institution',
  },
  {
    year: '2002',
    title: 'Passage a l\'Euro',
    description: 'Monnaie unique europeenne en circulation',
    category: 'institution',
  },
  {
    year: '2004',
    title: 'Charte de l\'environnement',
    description: 'Adossee a la Constitution, droits et devoirs environnementaux',
    category: 'rights',
  },
  {
    year: '2013',
    title: 'Mariage pour tous',
    description: 'Ouverture du mariage aux couples de meme sexe',
    category: 'rights',
  },
  {
    year: '2024',
    title: 'Loi immigration',
    description: 'Examen civique obligatoire pour les demandeurs',
    category: 'institution',
  },
];

const categoryColors: Record<EventCategory, { dot: string; label: string }> = {
  institution: { dot: '#002395', label: 'Institutions' },
  rights: { dot: '#ED2939', label: 'Droits' },
  social: { dot: '#2E7D32', label: 'Social' },
};

export default function ChronologieScreen() {
  const colors = useColors();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#0A0E1A' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Chronologie</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Legend */}
      <View style={[styles.legend, { backgroundColor: colors.surface }]}>
        {Object.entries(categoryColors).map(([key, val]) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: val.dot }]} />
            <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>{val.label}</Text>
          </View>
        ))}
      </View>

      {/* Timeline */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {TIMELINE_DATA.map((event, index) => {
          const catColor = categoryColors[event.category].dot;
          const isLast = index === TIMELINE_DATA.length - 1;

          return (
            <View key={`${event.year}-${index}`} style={styles.timelineRow}>
              {/* Left: line + dot */}
              <View style={styles.timelineLeft}>
                <View style={[styles.dot, { backgroundColor: catColor }]} />
                {!isLast && (
                  <View style={[styles.line, { backgroundColor: colors.border }]} />
                )}
              </View>

              {/* Right: content */}
              <View
                style={[
                  styles.eventCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.eventYear, { color: catColor }]}>{event.year}</Text>
                <Text style={[styles.eventTitle, { color: colors.textPrimary }]}>
                  {event.title}
                </Text>
                <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
                  {event.description}
                </Text>
              </View>
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: fontSize.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 90,
  },
  timelineLeft: {
    width: 30,
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 4,
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: -2,
  },
  eventCard: {
    flex: 1,
    marginLeft: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  eventYear: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    marginBottom: 2,
  },
  eventTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: fontSize.md,
    lineHeight: 20,
  },
});
