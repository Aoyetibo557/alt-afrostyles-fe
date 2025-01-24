import AxiosClient from "./client";
import { getToken, decodeToken } from "./tokenStorage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IStore, IProduct, AuthResponse, SimpleResponse } from "@/types/index";

//When the user is not logged in my has item in cart and then logs in we can then sync and send the items to server
export async function syncCartWithServer(userId: string, localCart: any[]) {
  for (const item of localCart) {
    await addToCart(item.product_id, item.quantity);
  }
}

//add to cart (Server)
export const addToCart = async (productId: string, quantity: number) => {
  const response = await AxiosClient.post<SimpleResponse>(`/cart/addtocart`, {
    productId,
    quantity,
  });

  return response.data;
};

export const removeFromCart = async (cartItemId: string) => {
  const response = await AxiosClient.delete<SimpleResponse>(
    `/cart/removefromcart/${cartItemId}`
  );

  return response.data;
};

export const updateCartItem = async (
  cartItemId: string,
  newQuantity: number
) => {
  const response = await AxiosClient.put<SimpleResponse>(
    `/cart/updatecartitem`,
    {
      cartItemId: cartItemId,
      newQuantity: newQuantity,
    }
  );

  return response.data;
};

export const getUserCartItems = async () => {
  const response = await AxiosClient.get<SimpleResponse>(
    `/cart/getusercartitems`
  );

  return response.data;
};
