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
  const widthAnim = useRef(new Animated.Value(parseWidthValue(from?.width) ?? 0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const hasWidthAnim = animate?.width !== undefined;
  const hasBgAnim = animate?.backgroundColor !== undefined;
  const bgFrom = from?.backgroundColor;
  const bgTo = animate?.backgroundColor;

  useEffect(() => {
    // Native driver animations (opacity, translate, scale)
    const nativeAnims: Animated.CompositeAnimation[] = [];
    // JS thread animations (width, backgroundColor)
    const jsAnims: Animated.CompositeAnimation[] = [];

    const makeAnim = (value: Animated.Value, target: number, useNative: boolean) => {
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

    // Native driver group
    if (animate?.opacity !== undefined) nativeAnims.push(makeAnim(opacity, animate.opacity, true));
    if (animate?.translateY !== undefined) nativeAnims.push(makeAnim(translateY, animate.translateY, true));
    if (animate?.translateX !== undefined) nativeAnims.push(makeAnim(translateX, animate.translateX, true));
    if (animate?.scale !== undefined) nativeAnims.push(makeAnim(scale, animate.scale, true));

    // JS driver group (cannot use native driver)
    if (hasWidthAnim) {
      const targetWidth = parseWidthValue(animate!.width) ?? 0;
      jsAnims.push(makeAnim(widthAnim, targetWidth, false));
    }
    if (hasBgAnim) {
      jsAnims.push(makeAnim(bgAnim, 1, false));
    }

    // Run both groups in parallel (each group internally consistent)
    const allAnims: Animated.CompositeAnimation[] = [];
    if (nativeAnims.length > 0) allAnims.push(Animated.parallel(nativeAnims));
    if (jsAnims.length > 0) allAnims.push(Animated.parallel(jsAnims));

    if (allAnims.length > 0) {
      Animated.parallel(allAnims).start();
    }
  }, [
    animate?.opacity,
    animate?.translateY,
    animate?.translateX,
    animate?.scale,
    animate?.width,
    animate?.backgroundColor,
  ]);

  // Build animated style
  const nativeStyle = {
    opacity,
    transform: [
      { translateY },
      { translateX },
      { scale },
    ],
  };

  const jsStyle: any = {};

  if (hasWidthAnim) {
    jsStyle.width = widthAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });
  }

  if (hasBgAnim && bgFrom && bgTo) {
    jsStyle.backgroundColor = bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [bgFrom, bgTo],
    });
  } else if (hasBgAnim && bgTo) {
    jsStyle.backgroundColor = bgTo;
  }

  // If we have JS-driven styles, we can't use the native-driven transform
  // on the same view. Use nested views instead.
  if (hasWidthAnim || hasBgAnim) {
    return (
      <Animated.View style={[nativeStyle, style]}>
        <Animated.View style={jsStyle}>
          {children}
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[nativeStyle, style]}>
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
