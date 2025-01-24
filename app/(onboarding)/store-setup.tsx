import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { containerStyles } from "../../styles/general";
import { StoreSetupComp } from "../../components/designers/setupstore";

export default function StoreSetup() {
  const router = useRouter();

  return (
    <SafeAreaView style={[containerStyles.container]}>
      <StoreSetupComp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
