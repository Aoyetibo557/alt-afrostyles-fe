import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "@/styles/colors";
import { IProduct } from "../../types/index";
import { CustomImage, Error, ErrorType, Loading } from "../common";
import { useCart } from "../../context/CartContext";
import { useAlert } from "../../context/AlertContext";

const { width } = Dimensions.get("window");

interface CartItemProps {
  item: {
    product_id: string;
    quantity: number;
  };
  product: IProduct | undefined;
  updateQuantity: (quantity: number) => void;
  onPress: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  product,
  updateQuantity,
  onPress,
  isSelected,
  onSelect,
}) => {
  const { showAlert } = useAlert();
  const { removeFromCart, isPending } = useCart();

  const handleIncrease = () => {
    updateQuantity(item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.quantity - 1);
    }
  };

  if (!product) {
    return null;
  }

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
    if (!isPending) {
      showAlert("success", "Item removed from cart");
    }
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <TouchableOpacity style={styles.checkbox} onPress={onSelect}>
        <Ionicons
          name={isSelected ? "checkbox" : "square-outline"}
          size={24}
          color={COLORS.primary}
        />
      </TouchableOpacity>
      <View style={styles.leftSection}>
        {product?.images?.[0] && (
          <CustomImage
            source={{ uri: product.images[0] }}
            width={80}
            height={80}
            resizeMode="contain"
            borderRadius={8}
            onError={(error) => console.log("Image load error:", error)}
            placeholder={<Text>Failed to load image</Text>}
          />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          {product.type && (
            <Text style={styles.productType}>{product.type}</Text>
          )}
          <Text style={styles.productPrice}>
            ${(product.price * item.quantity).toFixed(2)}
          </Text>
          {item.quantity > 1 && (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecrease}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrease}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemoveFromCart(item.id)}>
          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
          <Text style={styles.deleteButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  checkbox: {
    marginRight: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoContainer: {
    flexDirection: "column",
    paddingHorizontal: 15,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: COLORS.textPrimary,
  },
  productType: {
    fontSize: 13,
    opacity: 0.7,
    fontFamily: "Poppins",
    color: COLORS.textSecondary,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: "Poppins_Semibold",
    color: COLORS.textPrimary,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: COLORS.green,
    width: 30,
    height: 30,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "Poppins",
  },
  quantityText: {
    marginHorizontal: 10,
    fontFamily: "Poppins_Semibold",
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  deleteButton: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 16,
    opacity: 0.7,
  },

  deleteButtonText: {
    fontFamily: "Poppins",
    fontSize: 14,
  },
});
