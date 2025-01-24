import { Stack } from "expo-router";

export default function PublicLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="auth"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="product"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="designer"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="editAddress"
        options={{
          headerShown: false,
        }}
        presentation="modal"
      />
    </Stack>
  );
}
