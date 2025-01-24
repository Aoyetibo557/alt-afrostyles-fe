import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { Suspense } from "react";
import { containerStyles } from "@/styles/general";
import SignupForm from "@components/signup/signupform";

const SignupScreen = () => {
  return (
    <SafeAreaView style={containerStyles.container}>
      <SignupForm />
    </SafeAreaView>
  );
};

export default SignupScreen;
