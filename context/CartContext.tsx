import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import {
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useSyncCartWithServerMutation,
} from "../api/mutations/cart";
import { useGetUserCartQuery } from "../api/queries/cart";
import { ICartItem } from "@/types/index";
import { useAlert } from "./AlertContext";
import { useNavigation } from "@react-navigation/native";

interface CartContextType {
  cart: ICartItem[];
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartItem: (cartItemId: string, newQuantity: number) => Promise<void>;
  calculateTotal: () => number;
  clearCart: () => Promise<void>;
  syncCartWithServer: () => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "@local_cart";

export const CartProvider: React.FC = ({ children }) => {
  const { showAlert } = useAlert();
  const { user } = useAuth();
  const navigation = useNavigation();

  const [localCart, setLocalCart] = useState<ICartItem[]>([]);
  const [serverCart, setServerCart] = useState<ICartItem[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const addToCartMutation = useAddToCartMutation();
  const removeFromCartMutation = useRemoveFromCartMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const syncCartMutation = useSyncCartWithServerMutation();

  const {
    data: serverCartData,
    error: serverCartError,
    refetch: refetchServerCart,
  } = useGetUserCartQuery(user);

  useEffect(() => {
    if (serverCartData) {
      setServerCart(serverCartData?.cart);
    }
  }, [serverCartData]);

  useEffect(() => {
    if (!user) {
      loadLocalCart();
    }
  }, [user]);

  const loadLocalCart = async () => {
    try {
      const cartString = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartString) {
        setLocalCart(JSON.parse(cartString));
      }
    } catch (error) {
      console.error("Error loading local cart:", error);
    }
  };

  const saveLocalCart = async (newCart: ICartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      setLocalCart(newCart);
    } catch (error) {
      console.error("Error saving local cart:", error);
    }
  };

  const handleError = (error: Error) => {
    setError(error);
    showAlert("error", error.message || "Something went wrong");
  };

  const handleSuccess = (message: string) => {
    showAlert("success", message);
  };

  const addToCart = async (productId: string, quantity: number) => {
    setIsPending(true);
    setError(null);

    try {
      await addToCartMutation.mutateAsync({ productId, quantity });
      handleSuccess("Item Added To Cart");
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsPending(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!user) return;

    setIsPending(true);
    setError(null);

    try {
      // Execute the mutation, which will handle updating the cache
      await removeFromCartMutation.mutateAsync({ cartItemId });

      handleSuccess("Item removed from cart");
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsPending(false);
    }
  };

  const updateCartItem = async (cartItemId: string, newQuantity: number) => {
    if (!user) return;

    setIsPending(true);
    setError(null);

    try {
      const updatedItem = await updateCartItemMutation.mutateAsync({
        cartItemId,
        newQuantity,
      });

      // Update the server cart with the new data
      setServerCart((prevCart) =>
        prevCart.map((item) =>
          item.id === updatedItem?.cartItem?.id
            ? { ...item, ...updatedItem?.cartItem }
            : item
        )
      );

      handleSuccess("Cart item updated");
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsPending(false);
    }
  };

  const calculateTotal = () => {
    const cartToUse = user ? serverCart : localCart;
    return cartToUse.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const clearCart = async () => {
    if (!user) return;

    setIsPending(true);
    setError(null);

    try {
      await saveLocalCart([]);
      setServerCart([]);
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsPending(false);
    }
  };

  const syncCartWithServer = async () => {
    if (user && localCart.length > 0) {
      try {
        setIsPending(true);
        await syncCartMutation.mutateAsync({ userId: user.id, localCart });
        saveLocalCart([]); // Clear local cart after syncing
      } catch (error) {
        handleError(error as Error);
      } finally {
        setIsPending(false);
      }
    }
  };

  const cart = user ? serverCart : localCart;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        calculateTotal,
        refetchServerCart,
        clearCart,
        syncCartWithServer,
        isPending,
        error: serverCartError || error,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
