import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors, borderRadius as br } from '../../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  padding?: number;
}

export function GlassCard({
  children,
  style,
  borderRadius = br.lg,
  padding = 16,
}: Props) {
  const c = useColors();

  return (
    <LinearGradient
      colors={[c.glassBackground, 'rgba(255,255,255,0.02)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          borderRadius,
          padding,
          borderColor: c.glassBorder,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});
