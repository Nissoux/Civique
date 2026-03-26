import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({ children, onPress, style, variant = 'default' }: CardProps) {
  const cardStyle = [
    styles.base,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  elevated: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  outlined: {
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
});
