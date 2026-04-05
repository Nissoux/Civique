import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, spacing, fontSize, borderRadius } from '../constants/theme';
import { useLanguageStore } from '../stores/languageStore';
import type { Flashcard } from '../stores/flashcardStore';

interface FlashcardSessionProps {
  cards: Flashcard[];
  onComplete: (results: { known: number[]; unknown: number[] }) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.xxl * 2;

export default function FlashcardSession({ cards, onComplete }: FlashcardSessionProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { currentLang } = useLanguageStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [unknown, setUnknown] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = useCallback(() => {
    if (isFlipped) {
      Animated.spring(flipAnim, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnim, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  }, [isFlipped, flipAnim]);

  const resetFlip = useCallback(() => {
    flipAnim.setValue(0);
    setIsFlipped(false);
  }, [flipAnim]);

  const handleAnswer = useCallback(
    (status: 'known' | 'unknown') => {
      const card = cards[currentIndex];
      if (status === 'known') {
        setKnown((prev) => [...prev, card.id]);
      } else {
        setUnknown((prev) => [...prev, card.id]);
      }

      if (currentIndex + 1 >= cards.length) {
        const finalKnown = status === 'known' ? [...known, card.id] : known;
        const finalUnknown = status === 'unknown' ? [...unknown, card.id] : unknown;
        setFinished(true);
        onComplete({ known: finalKnown, unknown: finalUnknown });
      } else {
        resetFlip();
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentIndex, cards, known, unknown, onComplete, resetFlip]
  );

  const card = cards[currentIndex];
  const showTranslation = currentLang !== 'fr' && card?.translations?.[currentLang as 'ar' | 'es'];
  const translation = showTranslation ? card.translations[currentLang as 'ar' | 'es'] : null;

  // ── Summary screen ──
  if (finished) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: c.background }}
        contentContainerStyle={{ padding: spacing.xxl, alignItems: 'center', paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + 16 }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: c.successBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.xxl,
          }}
        >
          <Ionicons name="checkmark-done" size={40} color={c.success} />
        </View>

        <Text style={{ fontSize: fontSize.xxl, fontWeight: '700', color: c.textPrimary, marginBottom: spacing.sm }}>
          Révision terminée !
        </Text>
        <Text style={{ fontSize: fontSize.md, color: c.textSecondary, marginBottom: spacing.xxxl, textAlign: 'center' }}>
          Voici le résumé de votre session
        </Text>

        <View style={{ flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.xxxl, width: '100%' }}>
          {/* Known */}
          <View
            style={{
              flex: 1,
              backgroundColor: c.successBg,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              alignItems: 'center',
            }}
          >
            <Ionicons name="checkmark-circle" size={32} color={c.success} />
            <Text style={{ fontSize: fontSize.xxxl, fontWeight: '700', color: c.success, marginTop: spacing.sm }}>
              {known.length}
            </Text>
            <Text style={{ fontSize: fontSize.sm, color: c.success, fontWeight: '600' }}>Maîtrisées</Text>
          </View>

          {/* Unknown */}
          <View
            style={{
              flex: 1,
              backgroundColor: c.errorBg,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              alignItems: 'center',
            }}
          >
            <Ionicons name="close-circle" size={32} color={c.error} />
            <Text style={{ fontSize: fontSize.xxxl, fontWeight: '700', color: c.error, marginTop: spacing.sm }}>
              {unknown.length}
            </Text>
            <Text style={{ fontSize: fontSize.sm, color: c.error, fontWeight: '600' }}>À revoir</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={{ width: '100%', marginBottom: spacing.xxxl }}>
          <View
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: c.progressBg,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${cards.length > 0 ? (known.length / cards.length) * 100 : 0}%`,
                backgroundColor: c.success,
                borderRadius: 4,
              }}
            />
          </View>
          <Text style={{ fontSize: fontSize.sm, color: c.textSecondary, marginTop: spacing.xs, textAlign: 'center' }}>
            {known.length} / {cards.length} cartes maîtrisées
          </Text>
        </View>
      </ScrollView>
    );
  }

  // ── Card session ──
  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      {/* Progress header */}
      <View style={{ paddingHorizontal: spacing.xxl, paddingTop: spacing.lg, paddingBottom: spacing.md }}>
        <Text style={{ fontSize: fontSize.md, fontWeight: '600', color: c.textSecondary, textAlign: 'center' }}>
          {currentIndex + 1}/{cards.length} cartes
        </Text>
        <View
          style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: c.progressBg,
            marginTop: spacing.sm,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${((currentIndex + 1) / cards.length) * 100}%`,
              backgroundColor: c.primary,
              borderRadius: 2,
            }}
          />
        </View>
      </View>

      {/* Card area */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl }}>
        <TouchableOpacity activeOpacity={0.9} onPress={flipCard} style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.3 }}>
          {/* Front face */}
          <Animated.View
            style={[
              styles.cardFace,
              {
                backgroundColor: c.card,
                borderColor: c.border,
                borderRadius: borderRadius.xl,
                transform: [{ rotateY: frontInterpolate }],
              },
            ]}
          >
            <Ionicons name="help-circle-outline" size={40} color={c.primary} style={{ marginBottom: spacing.xl }} />
            <Text style={{ fontSize: fontSize.xl, fontWeight: '700', color: c.textPrimary, textAlign: 'center', lineHeight: 28 }}>
              {card.front}
            </Text>
            {translation && (
              <Text
                style={{
                  fontSize: fontSize.md,
                  color: c.textSecondary,
                  textAlign: 'center',
                  marginTop: spacing.lg,
                  fontStyle: 'italic',
                }}
              >
                {translation.front}
              </Text>
            )}
            <Text style={{ fontSize: fontSize.xs, color: c.textTertiary, marginTop: spacing.xxl }}>
              Appuyez pour retourner
            </Text>
          </Animated.View>

          {/* Back face */}
          <Animated.View
            style={[
              styles.cardFace,
              {
                backgroundColor: c.card,
                borderColor: c.border,
                borderRadius: borderRadius.xl,
                transform: [{ rotateY: backInterpolate }],
              },
            ]}
          >
            <Ionicons name="bulb-outline" size={40} color={c.accent} style={{ marginBottom: spacing.xl }} />
            <Text style={{ fontSize: fontSize.xl, fontWeight: '700', color: c.textPrimary, textAlign: 'center', lineHeight: 28 }}>
              {card.back}
            </Text>
            {translation && (
              <Text
                style={{
                  fontSize: fontSize.md,
                  color: c.textSecondary,
                  textAlign: 'center',
                  marginTop: spacing.lg,
                  fontStyle: 'italic',
                }}
              >
                {translation.back}
              </Text>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Action buttons */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: spacing.xxl,
          paddingBottom: insets.bottom + 16,
          gap: spacing.lg,
        }}
      >
        <TouchableOpacity
          style={[
            styles.actionBtn,
            {
              backgroundColor: c.errorBg,
              borderColor: c.error,
              borderWidth: 1.5,
              borderRadius: borderRadius.lg,
            },
          ]}
          onPress={() => handleAnswer('unknown')}
        >
          <Ionicons name="close" size={24} color={c.error} />
          <Text style={{ fontSize: fontSize.md, fontWeight: '700', color: c.error, marginLeft: spacing.sm }}>
            Je ne sais pas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionBtn,
            {
              backgroundColor: c.successBg,
              borderColor: c.success,
              borderWidth: 1.5,
              borderRadius: borderRadius.lg,
            },
          ]}
          onPress={() => handleAnswer('known')}
        >
          <Ionicons name="checkmark" size={24} color={c.success} />
          <Text style={{ fontSize: fontSize.md, fontWeight: '700', color: c.success, marginLeft: spacing.sm }}>
            Je sais
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
});
