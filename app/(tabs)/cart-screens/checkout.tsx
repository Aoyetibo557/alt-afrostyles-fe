import React, { useState, useEffect, useCallback } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";
import { useShippingAddress } from "@/hooks/useShippingAddress";
import { scrollY } from "@/constants/const";
import { COLORS } from "@/styles/colors";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useAlert } from "@/context/AlertContext";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenHeader } from "../../../components/common";
import { isEmpty } from "lodash";
import { ShippingAddress } from "../../../components/cart/shippingAddressSection";
import { PaymentMethod } from "../../../components/cart/paymentMethod";
import { OrderSummary } from "../../../components/cart/orderSummary";
import { useCreateAnOrderMutation } from "../../../api/mutations/orders";

//move these to a const file later
const TAX_RATE = 0.07; // 7% tax rate
const SHIPPING_COST = 5.0; // Flat shipping cost -might change later on

const Checkout = () => {
  const { user } = useAuth();
  const { cart, removeFromCart } = useCart();
  const { showAlert } = useAlert();

  const params = useLocalSearchParams();

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  const {
    mutate: createAnOrder,
    isPending,
    error,
    data: createdOrder,
  } = useCreateAnOrderMutation();

  const {
    addresses,
    isLoading,
    selectedAddress,
    setSelectedAddress,
    loadSelectedAddress,
  } = useShippingAddress();

  useEffect(() => {
    if (params.items) {
      setCartItems(JSON.parse(params.items));
    }
  }, [params.items]);

  useFocusEffect(
    useCallback(() => {
      loadSelectedAddress();
    }, [])
  );

  // Calculate totals for the order
  const calculateTotal = (cartItems) => {
    const subtotal = cartItems.reduce((accumulator, item) => {
      return accumulator + item.price * item.quantity;
    }, 0);

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + SHIPPING_COST;

    return {
      subtotal,
      tax,
      shipping: SHIPPING_COST,
      total,
    };
  };

  const { subtotal, tax, shipping, total } = calculateTotal(cartItems);

  const handlePlaceOrder = async () => {
    if (isEmpty(selectedAddress)) {
      showAlert("error", "Invalid Address, Please fill in all address fields.");
      return;
    }

    const cleanedUpAddress = {
      name: selectedAddress.full_name,
      street: selectedAddress.street_address,
      state: selectedAddress.state,
      zip: selectedAddress.postal_code,
      country: selectedAddress.country,
    };

    const orderDetails = {
      userId: user.id,
      total: total,
      status: "pending",
      shippingAddress: JSON.stringify(cleanedUpAddress),
      billingAddress: JSON.stringify(cleanedUpAddress), //  might want to have a separate billing address. will need to create form
    };

    const orderItems = cartItems.map((item) => ({
      product_id: item.product_id,
      designer_id: item.designer_id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    try {
      await createAnOrder({ orderDetails, orderItems });
      // i'm using the cart item id to remove the item from the cart, right now
      await removeFromCart(cartItems?.map((item) => item.cart_item_id));
      router.replace({
        pathname: "./order-confirmation",
        params: {
          orderId: createdOrder?.order?.id,
          createdAt: createdOrder?.order?.created_at,
          total: total.toString(),
          items: JSON.stringify(cartItems), //these are the items ordered
        },
      });
    } catch (err) {
      console.error("Error placing order:", err);
      showAlert(
        "error",
        "There was a problem placing your order. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        title="Checkout"
        leftIcon={{
          name: "arrow-back",
          type: "Ionicons",
        }}
        leftText="Cart"
        onLeftPress={() => router.back()}
        scrollY={scrollY}
      />
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Checkout</Text>

        <ShippingAddress
          addresses={addresses}
          selectedAddress={selectedAddress}
          isLoading={isLoading}
          onPress={() => router.push("./shipping-address")}
        />

        <PaymentMethod
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />

        <OrderSummary
          cartItems={cartItems}
          subtotal={subtotal}
          tax={tax}
          shipping={shipping}
          total={total}
        />

        <Pressable style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </Pressable>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_Semibold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    gap: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: COLORS.cardBackground,
  },
  selectedPayment: {
    fontFamily: "Poppins",
    backgroundColor: COLORS.primaryLight,
  },
  paymentOptionText: {
    marginLeft: 10,
    fontFamily: "Poppins",
    color: COLORS.textPrimary,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  orderItemText: {
    color: COLORS.textPrimary,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontFamily: "Poppins_Semibold",
    color: COLORS.textPrimary,
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: "PoppinsMedium",
    color: COLORS.primary,
  },
  placeOrderButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  placeOrderButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsMedium",
  },
});

export default Checkout;
