import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useColors, borderRadius } from '../../constants/theme';

type TabIcon = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: TabIcon;
  iconFocused: TabIcon;
}

const tabs: TabConfig[] = [
  { name: 'index', title: "S'entraîner", icon: 'fitness-outline', iconFocused: 'fitness' },
  { name: 'flashcards', title: 'Mémo', icon: 'albums-outline', iconFocused: 'albums' },
  { name: 'glossaire', title: 'Glossaire', icon: 'book-outline', iconFocused: 'book' },
  { name: 'exams', title: 'Examens', icon: 'document-text-outline', iconFocused: 'document-text' },
  { name: 'profile', title: 'Compte', icon: 'person-outline', iconFocused: 'person' },
];

// Hide screens that are no longer tabs
const hiddenScreens = ['train', 'fiches', 'stats', 'choose-exam'];

export default function TabsLayout() {
  const c = useColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textTertiary,
        tabBarStyle: {
          backgroundColor: c.tabBar,
          borderTopColor: c.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={22}
                color={color}
              />
            ),
          }}
        />
      ))}
      {hiddenScreens.map((name) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{ href: null }}
        />
      ))}
    </Tabs>
  );
}
