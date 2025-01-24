import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="personalinfo"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="shipping-address"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
