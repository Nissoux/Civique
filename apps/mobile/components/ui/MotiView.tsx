import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface AnimValues {
  opacity?: number;
  translateY?: number;
  translateX?: number;
  scale?: number;
  width?: string | number;
  backgroundColor?: string;
}

interface TransitionConfig {
  type?: 'timing' | 'spring';
  duration?: number;
  delay?: number;
  damping?: number;
  stiffness?: number;
  loop?: boolean;
  repeatReverse?: boolean;
}

interface MotiViewProps {
  from?: AnimValues;
  animate?: AnimValues;
  exit?: AnimValues;
  transition?: TransitionConfig;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function MotiView({
  from,
  animate,
  transition = {},
  style,
  children,
}: MotiViewProps) {
  const {
    type = 'timing',
    duration = 400,
    delay = 0,
    damping = 15,
    stiffness = 150,
    loop = false,
    repeatReverse = false,
  } = transition;

  const opacity = useRef(new Animated.Value(from?.opacity ?? 1)).current;
  const translateY = useRef(new Animated.Value(from?.translateY ?? 0)).current;
  const translateX = useRef(new Animated.Value(from?.translateX ?? 0)).current;
  const scale = useRef(new Animated.Value(from?.scale ?? 1)).current;
  // width: 0-100 for percentage-based widths
  const widthAnim = useRef(new Animated.Value(parseWidthValue(from?.width) ?? 0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const hasBgAnim = animate?.backgroundColor !== undefined;
  const bgFrom = from?.backgroundColor;
  const bgTo = animate?.backgroundColor;

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];

    const makeAnim = (value: Animated.Value, target: number, useNative = true) => {
      const baseAnim = type === 'spring'
        ? Animated.spring(value, {
            toValue: target,
            damping,
            stiffness,
            useNativeDriver: useNative,
          })
        : Animated.timing(value, {
            toValue: target,
            duration,
            useNativeDriver: useNative,
          });

      const delayedAnim = delay > 0
        ? Animated.sequence([Animated.delay(delay), baseAnim])
        : baseAnim;

      if (loop) {
        return Animated.loop(delayedAnim, { resetBeforeIteration: !repeatReverse });
      }
      return delayedAnim;
    };

    if (animate?.opacity !== undefined) animations.push(makeAnim(opacity, animate.opacity));
    if (animate?.translateY !== undefined) animations.push(makeAnim(translateY, animate.translateY));
    if (animate?.translateX !== undefined) animations.push(makeAnim(translateX, animate.translateX));
    if (animate?.scale !== undefined) animations.push(makeAnim(scale, animate.scale));
    if (animate?.width !== undefined) {
      const targetWidth = parseWidthValue(animate.width) ?? 0;
      animations.push(makeAnim(widthAnim, targetWidth, false));
    }
    if (hasBgAnim) {
      animations.push(makeAnim(bgAnim, 1, false));
    }

    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  }, [
    animate?.opacity,
    animate?.translateY,
    animate?.translateX,
    animate?.scale,
    animate?.width,
    animate?.backgroundColor,
  ]);

  // Build style
  const animStyle: any = {
    opacity,
    transform: [
      { translateY },
      { translateX },
      { scale },
    ],
  };

  // Width animation (percentage string)
  if (animate?.width !== undefined) {
    animStyle.width = widthAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });
  }

  // Background color animation
  if (hasBgAnim && bgFrom && bgTo) {
    animStyle.backgroundColor = bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [bgFrom, bgTo],
    });
  } else if (hasBgAnim && bgTo) {
    animStyle.backgroundColor = bgTo;
  }

  return (
    <Animated.View style={[animStyle, style]}>
      {children}
    </Animated.View>
  );
}

export function AnimatePresence({
  children,
}: {
  children: React.ReactNode;
  exitBeforeEnter?: boolean;
}) {
  return <>{children}</>;
}

function parseWidthValue(w: string | number | undefined): number | undefined {
  if (w === undefined) return undefined;
  if (typeof w === 'number') return w;
  const match = w.match(/^([\d.]+)%$/);
  if (match) return parseFloat(match[1]);
  return 0;
}
