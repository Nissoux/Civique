import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleProp, TextStyle, Animated } from 'react-native';

interface Props {
  value: number;
  duration?: number;
  style?: StyleProp<TextStyle>;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  duration = 800,
  style,
  prefix = '',
  suffix = '',
  decimals = 0,
}: Props) {
  const animValue = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    animValue.setValue(0);
    const listener = animValue.addListener(({ value: v }) => {
      setDisplay(v);
    });

    Animated.timing(animValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    return () => animValue.removeListener(listener);
  }, [value]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toString();

  return (
    <Text style={style}>
      {prefix}{formatted}{suffix}
    </Text>
  );
}
