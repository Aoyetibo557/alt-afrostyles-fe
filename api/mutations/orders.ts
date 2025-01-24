import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { useAlert } from "@/context/AlertContext";
import { IOrder, ICartItem } from "@/types/index";
import { createAnOrderApi, updateOrderApi } from "@/api/orders";

export const useCreateAnOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderDetails,
      orderItems,
    }: {
      orderDetails: {};
      orderItems: Partial<IProduct>[];
    }) => createAnOrderApi(orderDetails, orderItems),
    onSuccess: (data) => {
      queryClient.setQueryData(["userOrders"], ...data.order);
      return data;
    },
    onError: (error) => {},
  });
};

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: (updatedOrderInfo: any) => updateOrderApi(updatedOrderInfo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["designerOrders"] });
      return data;
    },
  });
};
