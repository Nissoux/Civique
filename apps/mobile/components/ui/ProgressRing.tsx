import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface Props {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  duration?: number;
  showValue?: boolean;
  valueColor?: string;
  valueFontSize?: number;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  color = '#4D7CFF',
  bgColor = 'rgba(255,255,255,0.1)',
  duration = 1000,
  showValue = true,
  valueColor = '#FFFFFF',
  valueFontSize = 18,
  children,
}: Props) {
  const animValue = useRef(new Animated.Value(0)).current;
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const listener = animValue.addListener(({ value }) => {
      setDisplayProgress(value);
    });
    Animated.timing(animValue, {
      toValue: progress,
      duration,
      useNativeDriver: false,
    }).start();
    return () => animValue.removeListener(listener);
  }, [progress]);

  // Simple circle progress using border trick
  const outerSize = size;
  const innerSize = size - strokeWidth * 2;

  return (
    <View style={[styles.container, { width: outerSize, height: outerSize }]}>
      {/* Background circle */}
      <View style={[
        styles.circle,
        {
          width: outerSize,
          height: outerSize,
          borderRadius: outerSize / 2,
          borderWidth: strokeWidth,
          borderColor: bgColor,
        },
      ]} />
      {/* Progress arc - simplified as a colored border with rotation */}
      <View style={[
        styles.circle,
        {
          width: outerSize,
          height: outerSize,
          borderRadius: outerSize / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          borderRightColor: displayProgress < 25 ? 'transparent' : color,
          borderBottomColor: displayProgress < 50 ? 'transparent' : color,
          borderLeftColor: displayProgress < 75 ? 'transparent' : color,
          transform: [{ rotate: '-45deg' }],
        },
      ]} />
      {/* Center content */}
      <View style={styles.center}>
        {children ?? (showValue && (
          <Text style={[styles.value, { color: valueColor, fontSize: valueFontSize }]}>
            {Math.round(displayProgress)}%
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontWeight: '700',
  },
});
