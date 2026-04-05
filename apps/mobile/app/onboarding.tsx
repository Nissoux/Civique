import { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from '../components/ui/MotiView';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useColors, spacing, borderRadius } from '../constants/theme';
import { AnimatedPressable, CMotif } from '../components/ui';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  gradient: readonly [string, string, string];
  motifRotations: number[];
}

const slides: Slide[] = [
  {
    id: '1',
    icon: 'shield-checkmark',
    title: 'Bienvenue sur Civique',
    subtitle: 'Préparez votre examen civique français avec confiance',
    gradient: ['#0A1628', '#0F1B3D', '#002395'],
    motifRotations: [-30, 120, 60],
  },
  {
    id: '2',
    icon: 'fitness',
    title: 'Entraînez-vous',
    subtitle: '611 questions, examens blancs et 6 langues disponibles',
    gradient: ['#0A1628', '#1A2340', '#2962FF'],
    motifRotations: [45, -60, 150],
  },
  {
    id: '3',
    icon: 'stats-chart',
    title: 'Suivez votre progression',
    subtitle: 'Statistiques détaillées, flashcards et fiches mémo',
    gradient: ['#0A1628', '#1B2E1C', '#2E7D32'],
    motifRotations: [90, -120, 30],
  },
];

export default function OnboardingScreen() {
  const c = useColors();
  const router = useRouter();
  const { setDone } = useOnboardingStore();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleComplete = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.setItem('onboarding_done', 'true');
    setDone(true);
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleSkip = () => handleComplete();

  const isLastSlide = currentIndex === slides.length - 1;

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => (
    <LinearGradient
      colors={item.gradient as unknown as [string, string, ...string[]]}
      style={[styles.slide, { width }]}
    >
      {/* C Motifs decoration */}
      <CMotif size="xl" color="#FFFFFF" opacity="light" rotation={item.motifRotations[0]} style={{ top: '10%', right: -30 }} />
      <CMotif size="lg" color="#FFFFFF" opacity="subtle" rotation={item.motifRotations[1]} style={{ bottom: '25%', left: -20 }} />
      <CMotif size="md" color="#4D7CFF" opacity="medium" rotation={item.motifRotations[2]} style={{ top: '35%', left: '15%' }} />

      <MotiView
        from={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: currentIndex === index ? 1 : 0.5, scale: currentIndex === index ? 1 : 0.8 }}
        transition={{ type: 'spring', damping: 12, stiffness: 150 }}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={64} color="#FFFFFF" />
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: currentIndex === index ? 1 : 0, translateY: currentIndex === index ? 0 : 20 }}
        transition={{ delay: 150 }}
      >
        <Text style={styles.title}>{item.title}</Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: currentIndex === index ? 1 : 0, translateY: currentIndex === index ? 0 : 20 }}
        transition={{ delay: 250 }}
      >
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </MotiView>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Bottom overlay */}
      <View style={styles.bottomOverlay}>
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <MotiView
              key={index}
              animate={{
                width: index === currentIndex ? 28 : 8,
                opacity: index === currentIndex ? 1 : 0.4,
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              style={[
                styles.dot,
                { backgroundColor: '#FFFFFF' },
              ]}
            />
          ))}
        </View>

        {/* Bottom buttons */}
        <View style={styles.bottomContainer}>
          {!isLastSlide && (
            <AnimatedPressable onPress={handleSkip}>
              <Text style={styles.skipText}>Passer</Text>
            </AnimatedPressable>
          )}

          <AnimatedPressable
            onPress={isLastSlide ? handleComplete : handleNext}
            scaleDown={0.95}
          >
            <LinearGradient
              colors={['#FFFFFF', '#E8E8F0']}
              style={styles.mainButton}
            >
              <Text style={styles.mainButtonText}>
                {isLastSlide ? 'Commencer' : 'Suivant'}
              </Text>
              <Ionicons
                name={isLastSlide ? 'rocket' : 'arrow-forward'}
                size={20}
                color="#002395"
              />
            </LinearGradient>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: 'rgba(255,255,255,0.7)',
    maxWidth: 300,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  bottomContainer: {
    alignItems: 'center',
    gap: 16,
  },
  skipText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
    paddingVertical: 8,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#002395',
  },
});
