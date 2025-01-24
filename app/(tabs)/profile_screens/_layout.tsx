import { router, Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings-screens"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
