import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { MotiView } from './MotiView';

interface Props {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  from?: { opacity?: number; translateY?: number; scale?: number };
}

export function AnimatedCard({
  children,
  delay = 0,
  style,
  from = { opacity: 0, translateY: 20, scale: 0.97 },
}: Props) {
  return (
    <MotiView
      from={{ opacity: from.opacity ?? 0, translateY: from.translateY ?? 20, scale: from.scale ?? 0.97 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: 'timing',
        duration: 500,
        delay,
      }}
      style={style}
    >
      {children}
    </MotiView>
  );
}
