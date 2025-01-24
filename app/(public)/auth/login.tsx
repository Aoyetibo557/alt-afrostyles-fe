import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { Suspense } from "react";
import { containerStyles } from "@/styles/general";
import LoginForm from "@components/login/loginform";

const LoginScreen = () => {
  return (
    <SafeAreaView style={containerStyles.container}>
      <Suspense fallback={<Text>Loading...</Text>}>
        <LoginForm />
      </Suspense>
    </SafeAreaView>
  );
};

export default LoginScreen;
