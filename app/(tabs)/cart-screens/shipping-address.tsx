import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Pressable, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenHeader } from "@/components/common";
import { scrollY } from "@/constants/const";
import { COLORS } from "@/styles/colors";
import { AddressManager } from "@/components/address/addressmanager";

const ShippingAddress = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        title="Shipping Address"
        leftIcon={{
          name: "arrow-back",
          type: "Ionicons",
        }}
        leftText="Checkout"
        onLeftPress={() => router.back()}
        scrollY={scrollY}
      />
      <AddressManager />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default ShippingAddress;
