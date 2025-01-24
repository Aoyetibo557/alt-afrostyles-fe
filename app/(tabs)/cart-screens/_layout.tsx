import { Stack } from "expo-router";

export default function CartLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="cart"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="checkout"
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

      <Stack.Screen
        name="order-confirmation"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
