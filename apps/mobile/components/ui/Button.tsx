import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'premium';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
}

const VARIANT_STYLES: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: '#002395', text: '#FFFFFF' },
  secondary: { bg: '#EEF1FB', text: '#002395' },
  outline: { bg: 'transparent', text: '#002395', border: '#002395' },
  danger: { bg: '#FFFFFF', text: '#ED2939', border: '#ED2939' },
  premium: { bg: '#FFD700', text: '#333333' },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  size = 'medium',
}: ButtonProps) {
  const v = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1.5, borderColor: v.border } : undefined,
        sizeStyle.container,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={sizeStyle.iconSize}
              color={v.text}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={[styles.text, { color: v.text }, sizeStyle.text, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const SIZE_STYLES = {
  small: {
    container: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 } as ViewStyle,
    text: { fontSize: 13 } as TextStyle,
    iconSize: 14,
  },
  medium: {
    container: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12 } as ViewStyle,
    text: { fontSize: 16 } as TextStyle,
    iconSize: 18,
  },
  large: {
    container: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 14 } as ViewStyle,
    text: { fontSize: 17 } as TextStyle,
    iconSize: 20,
  },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
