import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="subscription"
        options={{
          headerTitle: 'Abonnement',
          headerStyle: { backgroundColor: '#002395' },
          headerTintColor: '#FFFFFF',
        }}
      />
    </Stack>
  );
}
