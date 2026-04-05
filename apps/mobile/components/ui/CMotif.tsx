import React from 'react';
import { View, StyleSheet } from 'react-native';
import { cMotif } from '../../constants/theme';

interface Props {
  size?: keyof typeof cMotif.sizes;
  color?: string;
  opacity?: keyof typeof cMotif.opacity;
  rotation?: number;
  style?: object;
}

/**
 * Signature "C" arc motif derived from the Civique logo.
 * Used as subtle background decoration at low opacity.
 */
export function CMotif({
  size = 'lg',
  color = '#FFFFFF',
  opacity = 'subtle',
  rotation = 0,
  style,
}: Props) {
  const s = cMotif.sizes[size];
  const borderW = Math.max(s * 0.12, 2);

  return (
    <View
      style={[
        {
          width: s,
          height: s,
          borderRadius: s / 2,
          borderWidth: borderW,
          borderColor: color,
          borderRightColor: 'transparent',
          opacity: cMotif.opacity[opacity],
          transform: [{ rotate: `${rotation}deg` }],
        },
        styles.base,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
  },
});
