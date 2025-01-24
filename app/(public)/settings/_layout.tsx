import { Stack } from "expo-router";

const SettingsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="notificationprefrences"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default SettingsLayout;
