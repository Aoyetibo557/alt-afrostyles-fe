import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCart } from "../../context/CartContext";

const TopBar = () => {
  const { cart } = useCart();
  const cartItemCount = cart?.length || 0;

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/afrostyles-text-nobg.png")}
        style={styles.logoImage}
      />
      <View style={styles.rightIcons}>
        <TouchableOpacity
          onPress={() => router.replace("search-screens/searchscreen")}>
          <Ionicons name="search-outline" size={30} color="#4A3E2F" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/cart-screens/cart")}>
          <View style={styles.cartIconContainer}>
            <Ionicons name="cart-outline" size={30} color="#4A3E2F" />
            {cartItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItemCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  logoImage: {
    width: "40%",
    height: "100%",
    aspectRatio: 5,
    objectFit: "contain",
  },
  rightIcons: {
    gap: 10,
    flexDirection: "row",
  },
  cartIconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -10,
    top: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
