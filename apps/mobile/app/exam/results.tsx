import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef, useMemo, Fragment } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as examsService from '../../services/exams';
import type { ExamResultsResponse } from '../../services/exams';
import { useExamStore } from '../../stores/examStore';
import { useColors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CONFETTI_COLORS = ['#002395', '#ED2939', '#FFD700', '#2E7D32', '#FFFFFF'];
const CONFETTI_COUNT = 36;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfettiPiece {
  x: number;
  size: number;
  color: string;
  isCircle: boolean;
  delay: number;
}

function ConfettiOverlay() {
  const pieces = useMemo<ConfettiPiece[]>(() => {
    return Array.from({ length: CONFETTI_COUNT }, () => ({
      x: Math.random() * SCREEN_WIDTH,
      size: 6 + Math.random() * 10,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      isCircle: Math.random() > 0.5,
      delay: Math.random() * 800,
    }));
  }, []);

  const fallAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fallAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(2000),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={confettiStyles.overlay} pointerEvents="none">
      {pieces.map((piece, i) => {
        const translateY = fallAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-piece.size, SCREEN_HEIGHT + piece.size],
        });
        const translateX = fallAnim.interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [0, 15, -10, 20, -5],
        });

        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: piece.x,
              top: -piece.size,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.isCircle ? piece.size / 2 : 2,
              opacity: opacityAnim,
              transform: [
                { translateY },
                { translateX },
                {
                  rotate: fallAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', `${360 + Math.random() * 360}deg`],
                  }),
                },
              ],
            }}
          />
        );
      })}
    </View>
  );
}

const confettiStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
});

export default function ExamResultsScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { currentSession, reset } = useExamStore();

  const c = useColors();
  const insets = useSafeAreaInsets();
  const effectiveSessionId = sessionId || currentSession?.id;

  const [results, setResults] = useState<ExamResultsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FIX 6: isMounted flag to prevent state updates after unmount
  useEffect(() => {
    let isMounted = true;

    async function loadResults() {
      if (!effectiveSessionId) {
        if (isMounted) {
          setError('Aucune session trouvée');
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await examsService.getExamResults(effectiveSessionId);
        if (isMounted) {
          setResults(data);
        }
      } catch {
        if (isMounted) {
          setError('Impossible de charger les résultats');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadResults();

    return () => {
      isMounted = false;
    };
  }, [effectiveSessionId]);

  const handleGoHome = () => {
    reset();
    router.replace('/(tabs)');
  };

  const handleRetry = () => {
    reset();
    router.replace('/exam');
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: c.background }}>
        <ActivityIndicator size="large" color={c.primary} />
        <Text style={{ fontSize: 16, color: c.textSecondary, marginTop: 16 }}>Chargement des résultats...</Text>
      </View>
    );
  }

  if (error || !results) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: c.background }}>
        <Ionicons name="alert-circle" size={48} color={c.secondary} />
        <Text style={{ fontSize: 16, color: c.textSecondary, marginTop: 12, marginBottom: 20 }}>{error || 'Erreur inconnue'}</Text>
        <TouchableOpacity
          style={{ backgroundColor: c.primary, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 14 }}
          onPress={handleGoHome}
        >
          <Text style={{ color: c.textInverse, fontSize: 16, fontWeight: '600' }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const session = results?.session;
  const themeBreakdown = results?.themeBreakdown;
  const wrongAnswers = results?.wrongAnswers;
  const score = session?.score || 0;
  const total = session?.totalQuestions || 40;
  const passed = session?.passed ?? score >= 32;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}>
        {/* Result header */}
        <View
          style={{
            backgroundColor: c.card,
            borderRadius: 20,
            padding: 32,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              backgroundColor: passed ? c.successBg : c.errorBg,
            }}
          >
            <Ionicons
              name={passed ? 'checkmark-circle' : 'close-circle'}
              size={48}
              color={passed ? c.success : c.error}
            />
          </View>

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: c.textPrimary, marginBottom: 8 }}>
            {passed ? 'Félicitations !' : 'Continuez vos efforts'}
          </Text>

          <Text style={{ fontSize: 14, color: c.textSecondary, textAlign: 'center', marginBottom: 24 }}>
            {passed
              ? "Vous avez réussi l'examen blanc"
              : "Vous n'avez pas atteint le seuil de réussite"}
          </Text>

          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 48, fontWeight: 'bold', color: c.primary }}>
              {score}/{total}
            </Text>
            <Text style={{ fontSize: 14, color: c.textSecondary, marginTop: 4 }}>bonnes réponses</Text>
            <Text style={{ fontSize: 20, fontWeight: '600', color: c.primary, marginTop: 8 }}>{percentage}%</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: c.background,
              borderRadius: 8,
              padding: 12,
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="information-circle" size={16} color={c.textSecondary} />
            <Text style={{ fontSize: 13, color: c.textSecondary }}>
              Seuil de réussite : 80% (32/40)
            </Text>
          </View>
        </View>

        {/* Theme breakdown */}
        {themeBreakdown && themeBreakdown.length > 0 && (
          <View
            style={{
              backgroundColor: c.card,
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: c.textPrimary, marginBottom: 16 }}>Résultats par thème</Text>
            {themeBreakdown.map((theme) => {
              const themePercent =
                theme.total > 0
                  ? Math.round((theme.correct / theme.total) * 100)
                  : 0;
              const isGood = themePercent >= 80;

              return (
                <View key={theme.themeId} style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 14, color: c.textPrimary, flex: 1, marginRight: 8 }} numberOfLines={1}>
                      {theme.themeName}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: c.textSecondary }}>
                      {theme.correct}/{theme.total}
                    </Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: c.progressBg, borderRadius: 4, overflow: 'hidden' }}>
                    <View
                      style={{
                        height: '100%',
                        borderRadius: 4,
                        width: `${themePercent}%`,
                        backgroundColor: isGood ? c.success : c.warning,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Wrong answers */}
        {wrongAnswers && wrongAnswers.length > 0 && (
          <View
            style={{
              backgroundColor: c.card,
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: c.textPrimary, marginBottom: 16 }}>
              Réponses incorrectes ({wrongAnswers.length})
            </Text>
            {wrongAnswers.map((wa, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: c.surfaceElevated,
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 12,
                  borderLeftWidth: 3,
                  borderLeftColor: c.error,
                }}
              >
                <Text style={{ fontSize: 14, color: c.textPrimary, marginBottom: 10, lineHeight: 20 }}>{wa.questionText}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <Ionicons name="close-circle" size={16} color={c.error} style={{ marginTop: 2 }} />
                  <Text style={{ fontSize: 13, color: c.error, flex: 1, lineHeight: 19 }}>
                    {wa.choices?.find((ch: any) => ch.id === wa.selectedChoice)?.text || wa.selectedChoice.toUpperCase()}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                  <Ionicons name="checkmark-circle" size={16} color={c.success} style={{ marginTop: 2 }} />
                  <Text style={{ fontSize: 13, color: c.success, flex: 1, lineHeight: 19 }}>
                    {wa.choices?.find((ch: any) => ch.id === wa.correctChoice)?.text || wa.correctChoiceText || wa.correctChoice.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action buttons */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            style={{ backgroundColor: c.primary, borderRadius: 14, padding: 16, alignItems: 'center' }}
            onPress={handleGoHome}
          >
            <Text style={{ color: c.textInverse, fontSize: 16, fontWeight: '600' }}>Retour à l'accueil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: c.surfaceElevated, borderRadius: 14, padding: 16, alignItems: 'center' }}
            onPress={handleRetry}
          >
            <Text style={{ color: c.textPrimary, fontSize: 16, fontWeight: '500' }}>Recommencer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {passed && <ConfettiOverlay />}
    </View>
  );
}
