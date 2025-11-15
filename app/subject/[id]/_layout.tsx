import { Stack } from 'expo-router';

export default function SubjectLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="problem" />
    </Stack>
  );
}
