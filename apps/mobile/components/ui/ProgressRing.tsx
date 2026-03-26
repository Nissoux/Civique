import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
  showPercent?: boolean;
}

export default function ProgressRing({
  progress,
  size = 140,
  strokeWidth = 12,
  color = '#002395',
  bgColor = '#ECECEC',
  label,
  sublabel,
  showPercent = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.labelContainer}>
        {showPercent && (
          <Text style={[styles.percent, { color, fontSize: size * 0.22 }]}>
            {Math.round(clampedProgress)}%
          </Text>
        )}
        {label && (
          <Text style={[styles.label, { fontSize: size * 0.09 }]}>{label}</Text>
        )}
        {sublabel && (
          <Text style={[styles.sublabel, { fontSize: size * 0.075 }]}>{sublabel}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  percent: {
    fontWeight: 'bold',
  },
  label: {
    color: '#666',
    fontWeight: '500',
    marginTop: 2,
  },
  sublabel: {
    color: '#999',
    marginTop: 1,
  },
});
