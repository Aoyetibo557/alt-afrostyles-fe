import { Stack } from "expo-router";

export default function DesignerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="storedetails"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="addproduct"
        options={{
          headerShown: false,
          headerTitle: "Add New Product",
        }}
      />
      <Stack.Screen
        name="manageinventory"
        options={{
          headerShown: false,
          headerTitle: "Manage Inventory",
        }}
      />
      <Stack.Screen
        name="manageOrders"
        options={{
          headerShown: false,
          headerTitle: "Manage Orders",
        }}
      />
      <Stack.Screen
        name="orderDetails"
        options={{
          headerShown: false,
          headerTitle: "Order Details",
        }}
      />
      <Stack.Screen
        name="viewinventory"
        options={{
          headerShown: false,
          headerTitle: "View Inventory",
        }}
      />
    </Stack>
  );
}
