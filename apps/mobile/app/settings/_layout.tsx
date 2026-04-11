import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="subscription"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
