import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="productlist" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen name="productimagesview" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
