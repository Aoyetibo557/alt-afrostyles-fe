import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profileScreen"
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
    </Stack>
  );
}
