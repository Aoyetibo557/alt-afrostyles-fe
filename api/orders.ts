import AxiosClient from "./client";
import { IOrder, SimpleResponse } from "@/types/index";

export const createAnOrderApi = async (
  orderDetails: {},
  orderItems: Partial<IOrder>
) => {
  const response = await AxiosClient.post(`/orders/createorder`, {
    orderDetails,
    orderItems,
  });

  return response.data;
};

export const getOrderHistoryApi = async () => {
  const response = await AxiosClient.get<SimpleResponse>("/orders/userorders");
  return response.data;
};

export const getOrderDetailsApi = async (orderId: string) => {
  const response = await AxiosClient.get<SimpleResponse>(
    `/orders/getorderproducts/${orderId}`
  );
  return response.data;
};

export const getDesginerOrdersApi = async (designerId: string) => {
  const response = await AxiosClient.get<SimpleResponse>(
    `/orders/getdesignerorders/${designerId}`
  );
  return response.data;
};

export const updateOrderApi = async (updatedOrderInfo: Partial<IOrder>) => {
  const response = await AxiosClient.put<SimpleResponse>(
    "/orders/updateOrder",
    updatedOrderInfo
  );
  return response.data;
};
