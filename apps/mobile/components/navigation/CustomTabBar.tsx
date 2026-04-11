import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useColors, borderRadius } from '../../constants/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

type TabIcon = React.ComponentProps<typeof Ionicons>['name'];

interface TabDef {
  icon: TabIcon;
  iconFocused: TabIcon;
}

const TAB_ICONS: Record<string, TabDef> = {
  index: { icon: 'fitness-outline', iconFocused: 'fitness' },
  flashcards: { icon: 'albums-outline', iconFocused: 'albums' },
  glossaire: { icon: 'book-outline', iconFocused: 'book' },
  exams: { icon: 'document-text-outline', iconFocused: 'document-text' },
  profile: { icon: 'person-outline', iconFocused: 'person' },
};

const VISIBLE_TABS = ['index', 'flashcards', 'glossaire', 'exams', 'profile'];
const TAB_BAR_HEIGHT = 64;
const TAB_BAR_MARGIN_H = 16;

function TabItem({
  label,
  isFocused,
  onPress,
  onLongPress,
  tabName,
  color,
  focusedColor,
}: {
  label: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  tabName: string;
  color: string;
  focusedColor: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const labelOpacity = useRef(new Animated.Value(isFocused ? 1 : 0.7)).current;

  useEffect(() => {
    Animated.timing(labelOpacity, {
      toValue: isFocused ? 1 : 0.7,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.25, useNativeDriver: true, speed: 50, bounciness: 8 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 4 }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const icons = TAB_ICONS[tabName];
  if (!icons) return null;

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      activeOpacity={1}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={isFocused ? icons.iconFocused : icons.icon}
          size={22}
          color={isFocused ? focusedColor : color}
        />
      </Animated.View>
      <Animated.Text
        style={[
          styles.tabLabel,
          { color: isFocused ? focusedColor : color, opacity: labelOpacity },
        ]}
        numberOfLines={1}
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();

  const visibleRoutes = state.routes.filter((r) => VISIBLE_TABS.includes(r.name));
  const visibleIndex = visibleRoutes.findIndex(
    (r) => r.key === state.routes[state.index]?.key,
  );

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 28 : 16) },
      ]}
    >
      <LinearGradient
        colors={[c.glassBackground, 'rgba(255,255,255,0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.container,
          {
            borderColor: c.glassBorder,
            backgroundColor: c.surfaceElevated,
          },
        ]}
      >
        {visibleRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = visibleIndex === index;

          return (
            <TabItem
              key={route.key}
              label={label}
              isFocused={isFocused}
              tabName={route.name}
              color={c.textTertiary}
              focusedColor={c.primary}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              onLongPress={() => {
                navigation.emit({ type: 'tabLongPress', target: route.key });
              }}
            />
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: TAB_BAR_MARGIN_H,
  },
  container: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
