import { Stack } from "expo-router";

export default function OrdersLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="order-history"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
