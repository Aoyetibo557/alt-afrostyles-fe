import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetDesignerOrdersQuery } from "@/api/queries/orders";
import { useDesigner } from "@/context/DesignerContext";
import { StackScreenHeader, Loading } from "@/components/common";
import { COLORS } from "@/styles/colors";
import { OrderListItem } from "@/components/designers/manage-orders/orderListItem";
import { OrderDetailsModal } from "@/components/designers/manage-orders/orderDetailsModal";
import { IOrder } from "@/types/index";

const OrderManagement = () => {
  const { designerProfile } = useDesigner();

  const {
    data: queryResponse,
    isLoading,
    error,
    refetch,
  } = useGetDesignerOrdersQuery(designerProfile?.id);

  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  if (isLoading) {
    return (
      <Loading loadingText="Fetching store orders" isLoading={isLoading} />
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.cotainer}>
        <Text style={styles.errorText}>
          Error loading orders. Please try again.
        </Text>
      </SafeAreaView>
    );
  }

  const handleOrderPress = (order: Order) => {
    router.push({
      pathname: "./orderDetails",
      params: { order: JSON.stringify(order) },
    });
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    //move this to order status component. Eventullly a listner would be handle refech for certain things
    refetch();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        title="Order Management"
        leftIcon={{
          name: "arrow-back",
          type: "Ionicons",
        }}
        onLeftPress={() => router.back()}
      />
      <FlatList
        data={queryResponse?.orders}
        renderItem={({ item }) => (
          <OrderListItem order={item} onPress={() => handleOrderPress(item)} />
        )}
        keyExtractor={(item) => item.order_id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: COLORS.error,
    textAlign: "center",
    marginTop: 20,
  },
});

export default OrderManagement;
