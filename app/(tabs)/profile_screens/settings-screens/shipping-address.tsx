import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { StackScreenHeader } from "@/components/common";
import { scrollY } from "@/constants/const";
import { AddressManager } from "@/components/address/addressmanager";
import { COLORS } from "@/styles/colors";

const ShippingAddress = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        title="Shipping Address"
        leftIcon={{
          name: "arrow-back",
          type: "Ionicons",
        }}
        leftText=""
        onLeftPress={() => router.back()}
        scrollY={scrollY}
      />
      <AddressManager />
    </SafeAreaView>
  );
};

export default ShippingAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    backgroundColor: COLORS.background,
  },
});
