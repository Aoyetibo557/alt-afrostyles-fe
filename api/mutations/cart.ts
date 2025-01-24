import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../utils/queryClient";
import { ICartItem } from "@/types/index";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  syncCartWithServer,
} from "@/api/cart";

export const useAddToCartMutation = () => {
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => addToCart(productId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData<ICartItem[]>(["usercartitems"], data);
      return data;
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
    },
  });
};

export const useRemoveFromCartMutation = () => {
  return useMutation({
    mutationFn: ({ cartItemId }: { cartItemId: string }) =>
      removeFromCart(cartItemId),
    onSuccess: (data, variables) => {
      const { cartItemId } = variables; // Extract cartItemId from the mutation variables

      queryClient.setQueryData(["usercartitems"], (oldCartData: any) => {
        if (oldCartData && oldCartData.cart) {
          // Filter out the removed item from the cart
          const updatedCart = oldCartData.cart.filter(
            (item: ICartItem) => item.id !== cartItemId
          );
          // Return the updated cart within the response object
          return {
            ...oldCartData,
            cart: updatedCart,
          };
        }
        return oldCartData;
      });
    },
    onError: (error) => {
      console.error("Error removing from cart:", error);
    },
  });
};

export const useUpdateCartItemMutation = () => {
  return useMutation({
    mutationFn: ({
      cartItemId,
      newQuantity,
    }: {
      cartItemId: string;
      newQuantity: number;
    }) => updateCartItem(cartItemId, newQuantity),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(["usercartitems"], (oldCartData) => {
        if (oldCartData) {
          const updatedCart = oldCartData.cart.map((item) =>
            item.id === updatedItem.id ? { ...item, ...updatedItem } : item
          );
          return {
            ...oldCartData,
            cart: updatedCart,
          };
        }
        return oldCartData;
      });
    },
    onError: (error) => {
      console.error("Error updating cart item:", error);
    },
  });
};

export const useSyncCartWithServerMutation = () => {
  return useMutation({
    mutationFn: ({
      userId,
      localCart,
    }: {
      userId: string;
      localCart: ICartItem[];
    }) => syncCartWithServer(userId, localCart),
    onError: (error) => {
      console.error("Error syncing cart with server:", error);
    },
  });
};
