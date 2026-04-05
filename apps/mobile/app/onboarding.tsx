import { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors } from '../constants/theme';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: '1',
    icon: 'shield-checkmark',
    title: 'Bienvenue sur Civique',
    subtitle: 'Préparez votre examen civique français',
  },
  {
    id: '2',
    icon: 'fitness',
    title: 'Entraînez-vous',
    subtitle: '611 questions, examens blancs, 6 langues',
  },
  {
    id: '3',
    icon: 'stats-chart',
    title: 'Suivez votre progression',
    subtitle: 'Statistiques, badges et fiches mémo',
  },
];

export default function OnboardingScreen() {
  const c = useColors();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }, []);

  const handleComplete = async () => {
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width }]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: c.primaryLight },
        ]}
      >
        <Ionicons name={item.icon} size={64} color={c.primary} />
      </View>
      <Text style={[styles.title, { color: c.textPrimary }]}>
        {item.title}
      </Text>
      <Text style={[styles.subtitle, { color: c.textSecondary }]}>
        {item.subtitle}
      </Text>
    </View>
  );

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        onScrollToIndexFailed={() => {}}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? c.primary : c.progressBg,
              },
              index === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomContainer}>
        {!isLastSlide && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: c.textSecondary }]}>
              Passer
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: c.primary }]}
          onPress={isLastSlide ? handleComplete : handleNext}
        >
          <Text style={[styles.mainButtonText, { color: c.textInverse }]}>
            {isLastSlide ? 'Commencer' : 'Suivant'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
    gap: 16,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 15,
  },
  mainButton: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  mainButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
