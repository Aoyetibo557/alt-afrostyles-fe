import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { COLORS } from "@/styles/colors";
import { StackScreenHeader, Text } from "@/components/common";
import { OrderStatusStepper } from "../../../../components/orders/orderStatusStepper";
import { useGetOrderDetailsQuery } from "@/api/queries/orders";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
}

const OrderDetails = () => {
  const { id, order } = useLocalSearchParams<{ id: string; order: {} }>();
  const { data: queryResponse, isLoading, error } = useGetOrderDetailsQuery(id);
  const [cleanedUpOrder, setCleanedUpOrder] = useState();
  const [address, setAddress] = useState();

  useEffect(() => {
    if (order) {
      setCleanedUpOrder(JSON.parse(order));
    }
  }, []);

  useEffect(() => {
    if (cleanedUpOrder) {
      setAddress(JSON.parse(cleanedUpOrder?.shipping_address));
    }
  }, [cleanedUpOrder]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StackScreenHeader
          title="Order Details"
          leftIcon={{
            name: "arrow-back",
            type: "Ionicons",
          }}
          onLeftPress={() => router.back()}
        />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <StackScreenHeader
          title="Order Details"
          leftIcon={{
            name: "arrow-back",
            type: "Ionicons",
          }}
          onLeftPress={() => router.back()}
        />
        <Text style={styles.errorText}>
          Error loading order details. Please try again.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        title="Order Details"
        leftIcon={{
          name: "arrow-back",
          type: "Ionicons",
        }}
        onLeftPress={() => router.back()}
      />
      <OrderStatusStepper currentStatus={cleanedUpOrder?.status} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text variant="subheading">Order Information</Text>
          <View>
            <Text>Order #:</Text>
            <Text weight="bold">{id}</Text>
          </View>
          <Text>
            Date: {new Date(cleanedUpOrder?.created_at).toLocaleDateString()}
          </Text>
          <Text>Status: {cleanedUpOrder?.status}</Text>
          <Text>Total: ${cleanedUpOrder?.total_amount?.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text variant="subheading">Shipping Information</Text>
          <Text variant="body" weight="semibold">
            {address?.name}
          </Text>
          <Text style={styles.text}>
            {address?.street}, {address?.city} {address?.state}, {address?.zip},{" "}
            {address?.country}
          </Text>
        </View>

        {cleanedUpOrder?.status === "shipped" && (
          <View style={styles.section}>
            <Text variant="subheading">Tracking Information</Text>
            <View>
              <Text>Tracking #: </Text>
              <Text weight="bold">{cleanedUpOrder?.tracking_number}</Text>
              <Text>Shipping company </Text>
              <Text weight="bold">{cleanedUpOrder?.shipping_company}</Text>
              <Text>Estimated delivery date</Text>
              <Text>{cleanedUpOrder?.estimated_delivery_date}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text variant="subheading">Order Items</Text>
          {queryResponse?.products?.map((item) => (
            <View key={item?.id} style={styles.orderItem}>
              <Text variant="body">{item?.name}</Text>
              <Text style={styles.itemDetails}>
                Quantity: {item?.quantity} | Price: ${item?.price?.toFixed(2)}
              </Text>
              <Text style={styles.itemTotal}>
                Total: ${(item?.quantity * item?.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: "190%",
    backgroundColor: COLORS.background,
  },
  scrollView: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  section: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_Semibold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  orderItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: COLORS.textPrimary,
  },
  itemDetails: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: COLORS.textSecondary,
  },
  itemTotal: {
    fontSize: 14,
    fontFamily: "PoppinsMedium",
    color: COLORS.primary,
    marginTop: 5,
  },
  errorText: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: COLORS.error,
    textAlign: "center",
    marginTop: 20,
  },
});

export default OrderDetails;
