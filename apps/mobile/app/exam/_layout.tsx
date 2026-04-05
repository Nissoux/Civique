import { Stack } from 'expo-router';

export default function ExamLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Examen blanc',
          headerStyle: { backgroundColor: '#002395' },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Stack.Screen
        name="session"
        options={{
          headerTitle: 'En cours',
          headerBackVisible: false,
          headerStyle: { backgroundColor: '#002395' },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          headerTitle: 'Résultats',
          headerBackVisible: false,
          headerStyle: { backgroundColor: '#002395' },
          headerTintColor: '#FFFFFF',
        }}
      />
    </Stack>
  );
}
