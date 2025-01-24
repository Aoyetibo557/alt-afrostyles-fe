import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

export const OrderSummary = ({ cartItems, subtotal, tax, shipping, total }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      {cartItems.map((item) => (
        <View key={item.product_id} style={styles.orderItem}>
          <Text style={styles.orderItemText}>{item.name}</Text>
          <Text style={styles.orderItemText}>
            {item.quantity} x ${item.price?.toFixed(2)}
          </Text>
        </View>
      ))}
      <View style={styles.summaryItem}>
        <Text style={styles.summaryText}>Subtotal:</Text>
        <Text style={styles.summaryAmount}>${subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryText}>Tax:</Text>
        <Text style={styles.summaryAmount}>${tax.toFixed(2)}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryText}>Shipping:</Text>
        <Text style={styles.summaryAmount}>${shipping?.toFixed(2)}</Text>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: COLORS.textPrimary,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  orderItemText: {
    color: COLORS.textPrimary,
    fontFamily: "Poppins",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryText: {
    color: COLORS.textPrimary,
    fontFamily: "Poppins",
  },
  summaryAmount: {
    color: COLORS.textPrimary,
    fontFamily: "Poppins",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontFamily: "PoppinsMedium",
    color: COLORS.textPrimary,
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: "Poppins_Semibold",
    color: COLORS.textPrimary,
  },
});
