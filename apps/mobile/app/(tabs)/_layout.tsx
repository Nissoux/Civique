import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type TabIcon = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: TabIcon;
  iconFocused: TabIcon;
}

const tabs: TabConfig[] = [
  { name: 'index', title: 'Accueil', icon: 'home-outline', iconFocused: 'home' },
  { name: 'train', title: "S'entra\u00eener", icon: 'barbell-outline', iconFocused: 'barbell' },
  { name: 'fiches', title: 'Fiches', icon: 'document-text-outline', iconFocused: 'document-text' },
  { name: 'stats', title: 'Stats', icon: 'stats-chart-outline', iconFocused: 'stats-chart' },
  { name: 'profile', title: 'Profil', icon: 'person-outline', iconFocused: 'person' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#002395',
        tabBarInactiveTintColor: '#999',
        headerStyle: { backgroundColor: '#002395' },
        headerTintColor: '#FFFFFF',
        tabBarStyle: {
          paddingBottom: 4,
          height: 60,
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
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
