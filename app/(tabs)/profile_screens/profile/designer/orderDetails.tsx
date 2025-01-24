import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLocalSearchParams, router } from "expo-router";
import { useUpdateOrderMutation } from "@/api/mutations/orders";
import { useAlert } from "@/context/AlertContext";
import { COLORS } from "@/styles/colors";
import { IOrder, IAddress } from "@/types/index";
import { StackScreenHeader } from "@/components/common";
import { OrderStatusUpdate } from "@/components/designers/manage-orders/orderStatusUpdate";

const OrderDetails: React.FC = () => {
  const { showAlert } = useAlert();

  const { order } = useLocalSearchParams<{ order: IOrder }>();
  const [cleanedUpOrder, setCleanedUpOrder] = useState<Partial<IOrder>>();
  const [address, setAddress] = useState<IAddress>();

  const {
    mutate: updateOrder,
    isPending,
    error,
    data: updateOrderData,
  } = useUpdateOrderMutation();

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

  const handleUpdateOrder = async (data: {
    orderId: string;
    status: string;
    shippingCompany?: string;
    trackingNumber?: string;
    isInternational: boolean;
    cancellationReason?: string;
  }) => {
    try {
      await updateOrder({
        ...data,
        orderId: cleanedUpOrder?.order_id,
      });
      showAlert(
        "success",
        "Order updated successfully. Customer will be notified"
      );
    } catch (error) {
      showAlert("error", `Error updating order: ${error}`);
    }
  };

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
      <KeyboardAwareScrollView style={styles.body}>
        <View style={styles.modalContent}>
          <View style={styles.section}>
            <Text style={styles.title}>Manage Order Details</Text>
            <Text>Update tracking Information and status of order</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Information</Text>
            <Text style={styles.text}>Order #: {cleanedUpOrder?.order_id}</Text>
            <Text style={styles.text}>
              Date: {new Date(cleanedUpOrder?.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.text}>
              Total: ${cleanedUpOrder?.total_amount?.toFixed(2)}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <Text style={styles.text}>{address?.name}</Text>
            <Text style={styles.text}>
              {address?.street}, {address?.city} {address?.state},{" "}
              {address?.zip}
            </Text>
            <Text style={styles.text}>{address?.country}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {cleanedUpOrder?.products?.map((item) => (
              <View key={item?.id} style={styles.orderItem}>
                <Text style={styles.itemName}>{item?.name}</Text>
                <Text style={styles.itemDetails}>
                  Quantity: {item?.quantity} | Price at purchase: $
                  {item?.price_at_purchase?.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
          <OrderStatusUpdate
            initialStatus={cleanedUpOrder?.status || ""}
            onUpdateOrder={handleUpdateOrder}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },

  modalContent: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_Semibold",
    color: COLORS.textPrimary,
    marginBottom: 5,
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
});

export default OrderDetails;
