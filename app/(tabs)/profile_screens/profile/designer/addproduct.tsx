import { ScrollView, Keyboard, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import AddProduct from "@/components/product/add-product/addProduct";
import { COLORS } from "@/styles/colors";

const AddProductScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AddProduct />
    </SafeAreaView>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 15,
  },
});
