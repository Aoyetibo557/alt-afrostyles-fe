import { View, Text, Pressable, StyleSheet } from "react-native";
import { Tabs, useSegments, Stack, Slot } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useIsFocused } from "@react-navigation/native";
import { COLORS } from "@/styles/colors";
import { useCart } from "../../context/CartContext";

type TabBarIconProps = {
  name: string;
  size: number;
  focused: boolean;
};

const TabBarIcon = ({ name, size, focused }: TabBarIconProps) => {
  return (
    <View
      style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
      <Ionicons
        name={name}
        color={!focused ? COLORS.primary : "white"}
        size={size || 25}
      />
    </View>
  );
};

const TabBarIconWithBadge = ({ name, focused, badgeCount }) => {
  return (
    <View
      style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
      <Ionicons
        name={name}
        size={24}
        color={!focused ? COLORS.primary : "white"}
      />
      {badgeCount > 0 && (
        <View
          style={{
            position: "absolute",
            right: -6,
            top: -3,
            backgroundColor: "red",
            borderRadius: 7,
            width: 14,
            height: 14,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
            {badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const TabLayout = () => {
  const { user } = useAuth();
  const { cart } = useCart();
  const isFocused = useIsFocused();

  // const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartItemCount = cart?.length;

  const shouldHideTabBar = () => {
    const segments = useSegments();
    const routeName = segments.join("/");
    const routesToHideTabBar = [
      //designer screens
      "designer/addproduct",
      "designer/viewinventory",
      "designer/storedetails",
      "designer/orderDetails",
      //settings screens
      "settings-screens/personalinfo",
      "settings-screens/shipping-address",
      "profile_screens/orders/[id]",

      //cart screen
      "cart-screens/checkout",
    ];
    return routesToHideTabBar.some((route) => routeName.includes(route));
  };

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          { display: shouldHideTabBar() ? "none" : "flex" },
        ],
      }}>
      <Tabs.Screen
        name="home-screens"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search-screens/searchscreen"
        options={{
          title: "SearchScreen",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="search-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart-screens"
        options={{
          title: "Cart",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIconWithBadge
              name="cart-outline"
              focused={focused}
              badgeCount={cartItemCount}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile_screens"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="person-outline" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.green,
    borderTopColor: "transparent",
  },
  iconContainer: {},
  focusedIconContainer: {
    // backgroundColor: COLORS.secondary,
  },
});

export default TabLayout;
