import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BadgeVariant = 'default' | 'premium' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  style?: ViewStyle;
  size?: 'small' | 'medium';
}

const VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: '#F0F0F0', text: '#666' },
  premium: { bg: '#FFD700', text: '#333' },
  success: { bg: '#E8F5E9', text: '#2ECC71' },
  warning: { bg: '#FFF3E0', text: '#F57C00' },
  error: { bg: '#FFEBEE', text: '#ED2939' },
  info: { bg: '#EEF1FB', text: '#002395' },
};

export default function Badge({ text, variant = 'default', icon, style, size = 'small' }: BadgeProps) {
  const colors = VARIANT_COLORS[variant];
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.bg,
          paddingHorizontal: isSmall ? 8 : 10,
          paddingVertical: isSmall ? 3 : 5,
          borderRadius: isSmall ? 8 : 10,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={isSmall ? 10 : 13}
          color={colors.text}
          style={{ marginRight: 4 }}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: isSmall ? 10 : 12,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
  },
});
