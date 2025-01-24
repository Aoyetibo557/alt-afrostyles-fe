import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/styles/colors";

export const PaymentMethod = ({ paymentMethod, onPaymentMethodChange }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Payment Method</Text>
    <Pressable
      style={[
        styles.paymentOption,
        paymentMethod === "creditCard" && styles.selectedPayment,
      ]}
      onPress={() => onPaymentMethodChange("creditCard")}>
      <Ionicons name="card-outline" size={24} color={COLORS.textPrimary} />
      <Text style={styles.paymentOptionText}>Credit Card</Text>
    </Pressable>
    <Pressable
      style={[
        styles.paymentOption,
        paymentMethod === "paypal" && styles.selectedPayment,
      ]}
      onPress={() => onPaymentMethodChange("paypal")}>
      <Ionicons name="logo-paypal" size={24} color={COLORS.textPrimary} />
      <Text style={styles.paymentOptionText}>PayPal</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: COLORS.textPrimary,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: COLORS.cardBackground,
  },
  selectedPayment: {
    backgroundColor: COLORS.primaryLight,
  },
  paymentOptionText: {
    marginLeft: 10,
    color: COLORS.textPrimary,
  },
});
