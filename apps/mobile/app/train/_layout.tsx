import { Stack } from 'expo-router';

export default function TrainLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[themeId]"
        options={{
          headerTitle: 'Entraînement',
          headerStyle: { backgroundColor: '#002395' },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Stack.Screen
        name="random"
        options={{
          headerTitle: 'Entraînement libre',
          headerStyle: { backgroundColor: '#002395' },
          headerTintColor: '#FFFFFF',
        }}
      />
    </Stack>
  );
}
