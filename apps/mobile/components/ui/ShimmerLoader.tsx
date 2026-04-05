import React, { useEffect, useRef } from 'react';
import { StyleSheet, StyleProp, ViewStyle, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors, borderRadius } from '../../constants/theme';

interface Props {
  width: number | string;
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export function ShimmerLoader({
  width,
  height,
  radius = borderRadius.md,
  style,
}: Props) {
  const c = useColors();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius: radius,
          backgroundColor: c.skeleton,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['transparent', c.glassBackground, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </Animated.View>
  );
}
