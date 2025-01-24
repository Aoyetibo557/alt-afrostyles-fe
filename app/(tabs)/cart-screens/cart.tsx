import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  Loading,
  Error,
  ErrorType,
  CustomImage,
} from "../../../components/common";
import { useQueries } from "@tanstack/react-query";
import { router } from "expo-router";
import { COLORS } from "@/styles/colors";
import { CartItem } from "@/components/cart/cartitem";
import { scrollY } from "@/constants/const";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { isEmpty } from "lodash";
import {
  useGetProductQuery,
  useGetProductsQueries,
} from "@/api/queries/product";

const EMPTY_CART_IMAGE = require("@/assets/images/emptycarticon.png");

const Cart = () => {
  const { user } = useAuth();
  const { cart, isPending, error, refetchServerCart, updateCartItem } =
    useCart();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const productIds = Array.isArray(cart)
    ? cart.map((item) => item.product_id)
    : [];
  const {
    data: allCartProducts,
    isPending: productsIsPending,
    error: productsError,
    refetch: refetchProducts,
  } = useGetProductsQueries(productIds);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchServerCart(), refetchProducts()]);
    } catch (error) {
      console.error("Error refreshing cart:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchServerCart, refetchProducts]);

  const handleItemSelect = (id: string) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
  };

  const getProductById = (id) => {
    return allCartProducts.find((product) => product?.id === id) ?? null;
  };

  const handleProceedToCheckout = () => {
    const itemsToPurchase = cart
      .filter((item) => selectedItems.has(item.product_id))
      .map((item) => {
        const product = getProductById(item.product_id);
        return {
          cart_item_id: item.id,
          product_id: item.product_id,
          designer_id: product?.designer_id,
          name: product?.name,
          price: product?.price,
          quantity: item.quantity,
        };
      });
    if (user) {
      router.push({
        pathname: "./checkout",
        params: { items: JSON.stringify(itemsToPurchase) },
      });
    } else {
      router.push("../../(public)/login");
    }
  };

  const handleEditAddress = () => {
    router.push("./edit-address");
  };

  const isProccedButtonDisabled = selectedItems.size === 0;

  if (isPending || productsIsPending) {
    <Loading
      loadingText="fetching cart..."
      isLoading={isPending || productsIsPending}
    />;
  }

  if (productsError) {
    return <Error type={ErrorType.SERVER} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        {!isEmpty(cart) && (
          <Pressable
            style={[
              styles.checkoutButton,
              isProccedButtonDisabled && styles.disabledButton,
            ]}
            onPress={handleProceedToCheckout}
            disabled={isProccedButtonDisabled}>
            <Text style={styles.checkoutButtonText}>
              Proceed to Checkout ({selectedItems.size})
            </Text>
          </Pressable>
        )}
      </View>
      {isEmpty(cart) && (
        <View style={styles.emptyCartView}>
          <CustomImage
            source={EMPTY_CART_IMAGE}
            width={80}
            height={90}
            resizeMode="contain"
            borderRadius={8}
            placeholder={<Text>Failed to load image</Text>}
          />
          <Text style={styles.emptycartText}>No items in cart</Text>
        </View>
      )}
      <View style={styles.cartBody}>
        <FlatList
          data={cart}
          renderItem={({ item }) => {
            const product = getProductById(item.product_id);
            return (
              <CartItem
                item={item}
                product={product}
                updateQuantity={(quantity) => updateCartItem(item.id, quantity)}
                onPress={() =>
                  router.push({ pathname: `/product/${item.product_id}` })
                }
                isSelected={selectedItems.has(item.product_id)}
                onSelect={() => handleItemSelect(item.product_id)}
              />
            );
          }}
          keyExtractor={(item) => item?.product_id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Poppins_Semibold",
    color: COLORS.textPrimary,
  },
  checkoutButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  checkoutButtonText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontFamily: "Poppins",
  },
  cartBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
  },
  addressText: {
    flex: 1,
    color: COLORS.textPrimary,
  },
  addAddressButton: {
    padding: 15,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    alignItems: "center",
  },
  addAddressButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },

  disabledButton: {
    opacity: 0.4,
    backgroundColor: COLORS.primary,
  },

  emptyCartView: {
    height: "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  emptycartText: {
    paddingVertical: 20,
    fontFamily: "PoppinsMedium",
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default Cart;
