import React, { useRef, useCallback } from 'react';
import { Animated, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  haptic?: boolean;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
  scaleDown?: number;
  activeOpacity?: number;
}

export function AnimatedPressable({
  children,
  onPress,
  onLongPress,
  style,
  disabled = false,
  haptic = true,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  scaleDown = 0.97,
  activeOpacity = 0.9,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: scaleDown,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleDown]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, []);

  const handlePress = useCallback(() => {
    if (disabled) return;
    if (haptic) {
      Haptics.impactAsync(hapticStyle);
    }
    onPress?.();
  }, [disabled, haptic, hapticStyle, onPress]);

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={style}
    >
      <Animated.View style={[{ transform: [{ scale }] }, disabled && { opacity: 0.5 }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}
