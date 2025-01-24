import React from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/styles/colors";
import { StackScreenHeader } from "../../../components/common";

interface OrderConfirmationParams {
  orderId: string;
  createdAt: string;
  total: string;
  items: string; // JSON string of ordered items
}

const OrderConfirmation = () => {
  const params = useLocalSearchParams<OrderConfirmationParams>();
  const orderedItems = JSON.parse(params.items || "[]");

  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        title="Order Confirmation"
        leftIcon={{
          name: "close-outline",
          type: "Ionicons",
        }}
        onLeftPress={() => router.push("./cart")}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.confirmationBox}>
          <Ionicons name="checkmark-circle" size={64} color={COLORS.primary} />
          <Text style={styles.confirmationText}>Order Confirmed!</Text>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.detailTitle}>Order Details</Text>
          <Text style={styles.detailText}>Order Number: {params.orderId}</Text>
          <Text style={styles.detailText}>
            Date: {new Date(params.createdAt).toLocaleString()}
          </Text>
          <Text style={styles.detailText}>
            Total: ${parseFloat(params.total).toFixed(2)}
          </Text>
        </View>

        <View style={styles.itemList}>
          <Text style={styles.detailTitle}>Ordered Items</Text>
          {orderedItems.map((item: any, index: number) => (
            <Text key={index} style={styles.itemText}>
              {item.quantity}x {item.name} - $
              {(item.price * item.quantity).toFixed(2)}
            </Text>
          ))}
        </View>

        <Pressable
          style={styles.viewOrdersButton}
          onPress={() => router.push("/orders")}>
          <Text style={styles.viewOrdersButtonText}>View My Orders</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  confirmationBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 24,
    fontFamily: "Poppins_Semibold",
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  orderDetails: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontFamily: "Poppins_Semibold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  itemList: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  itemText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  viewOrdersButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  viewOrdersButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsMedium",
  },
});

export default OrderConfirmation;
