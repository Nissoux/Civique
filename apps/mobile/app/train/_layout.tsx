import { Stack } from 'expo-router';

export default function TrainLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[themeId]"
        options={{
          headerTitle: 'Entra\u00eenement',
          headerStyle: { backgroundColor: '#002395' },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Stack.Screen
        name="random"
        options={{
          headerTitle: 'Entra\u00eenement libre',
          headerStyle: { backgroundColor: '#002395' },
          headerTintColor: '#FFFFFF',
        }}
      />
    </Stack>
  );
}
