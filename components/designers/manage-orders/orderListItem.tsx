import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "@/styles/colors";
import { IOrder } from "@/types/index";
import { truncate } from "lodash";

interface OrderListItemProps {
  order: IOrder;
  onPress: () => void;
}

export const OrderListItem: React.FC<OrderListItemProps> = ({
  order,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>
          Order #{truncate(order?.order_id, { length: 20 })}
        </Text>
        <Text style={styles.orderDate}>
          {new Date(order?.created_at).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.orderStatus}>
        <Text style={styles.statusText}>{order?.status}</Text>
        <Text style={styles.totalText}>${order?.total_amount?.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: COLORS.cardBackground,
    marginBottom: 10,
    borderRadius: 8,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontFamily: "PoppinsMedium",
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  orderDate: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  orderStatus: {
    alignItems: "flex-end",
  },
  statusText: {
    fontFamily: "PoppinsMedium",
    fontSize: 14,
    color: COLORS.primary,
  },
  totalText: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});
