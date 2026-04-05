import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { CustomTabBar } from '../../components/navigation/CustomTabBar';

const visibleTabs = [
  { name: 'index', title: "S'entraîner" },
  { name: 'flashcards', title: 'Mémo' },
  { name: 'glossaire', title: 'Glossaire' },
  { name: 'exams', title: 'Examens' },
  { name: 'profile', title: 'Compte' },
];

const hiddenScreens = ['train', 'fiches', 'stats', 'choose-exam'];

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        {visibleTabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{ title: tab.title }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
