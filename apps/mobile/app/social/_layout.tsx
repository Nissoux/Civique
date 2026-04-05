import { Stack } from 'expo-router';

export default function SocialLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="leaderboard"
        options={{
          headerTitle: 'Classement',
          headerStyle: { backgroundColor: '#002395' },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Stack.Screen
        name="friends"
        options={{
          headerTitle: 'Amis',
          headerStyle: { backgroundColor: '#002395' },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Stack.Screen
        name="challenges"
        options={{
          headerTitle: 'Défis',
          headerStyle: { backgroundColor: '#002395' },
          headerTintColor: '#FFFFFF',
        }}
      />
    </Stack>
  );
}
