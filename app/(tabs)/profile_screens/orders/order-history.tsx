import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { COLORS } from "@/styles/colors";
import { StackScreenHeader } from "@/components/common";
import { useGetOrderHistoryQuery } from "@/api/queries/orders";
import { Ionicons } from "@expo/vector-icons";
import { truncate } from "lodash";

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
}

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState<"recent" | "all">("recent");
  const { data: queryResponse, isLoading, error } = useGetOrderHistoryQuery();

  const renderOrderItem = ({ item }: { item: Order }) => (
    <Pressable
      style={styles.orderItem}
      onPress={() =>
        router.push({
          pathname: "./[id]",
          params: { id: item.id, order: JSON.stringify(item) },
        })
      }>
      <View style={styles.iconwrap}>
        <Ionicons name="gift-outline" size={24} color="black" />
      </View>
      <View style={styles.orderInfo}>
        <Text style={styles.orderNumber}>
          Order #{truncate(item.id, { length: 15 })}
        </Text>
        <Text style={styles.orderDate}>
          {new Date(item?.created_at).toLocaleDateString()}
        </Text>
        <Text>{item?.status.toUpperCase()}</Text>
      </View>
      <View style={styles.orderStatus}>
        <Text style={styles.orderTotal}>${item?.total_amount?.toFixed(2)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
    </Pressable>
  );

  const recentOrders =
    queryResponse?.orders?.filter(
      (order) =>
        new Date(order.created_at) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ||
        order.status === "pending"
    ) || [];

  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        title="Order History"
        leftIcon={{
          name: "arrow-back",
          type: "Ionicons",
        }}
        onLeftPress={() => router.back()}
      />
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "recent" && styles.activeTab]}
          onPress={() => setActiveTab("recent")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "recent" && styles.activeTabText,
            ]}>
            Recent
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}>
            All Orders
          </Text>
        </Pressable>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : error ? (
        <Text style={styles.errorText}>
          Error loading orders. Please try again.
        </Text>
      ) : (
        <FlatList
          data={activeTab === "recent" ? recentOrders : queryResponse?.orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontFamily: "Poppins",
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: "PoppinsMedium",
  },
  listContent: {
    paddingHorizontal: 20,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
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
  orderTotal: {
    fontFamily: "PoppinsMedium",
    fontSize: 16,
    color: COLORS.primary,
  },
  pendingTag: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },
  pendingText: {
    fontFamily: "PoppinsMedium",
    fontSize: 12,
    color: COLORS.white,
  },
  errorText: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: COLORS.error,
    textAlign: "center",
    marginTop: 20,
  },
  iconwrap: {
    height: 45,
    backgroundColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
});

export default OrderHistory;
