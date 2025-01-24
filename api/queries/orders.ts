import { getToken, decodeToken } from "../tokenStorage";
import { queryClient } from "@/utils/queryClient";
import { useQuery, QueryOptions } from "@tanstack/react-query";
import { IOrder, SimpleResponse } from "@/types/index";
import {
  getOrderHistoryApi,
  getOrderDetailsApi,
  getDesginerOrdersApi,
} from "../orders";

//for caching purposes
const defaultQueryOptions: Partial<QueryOptions> = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 15 * 60 * 1000, // 15 minutes
};

export const useGetOrderHistoryQuery = (options = {}) => {
  return useQuery({
    queryKey: ["userOrders"],
    queryFn: getOrderHistoryApi,
    retry: 1,
    ...defaultQueryOptions,
    ...options,
    placeholderData: () => {
      return queryClient.getQueryData(["userOrders"]);
    },
  });
};

export const useGetOrderDetailsQuery = (orderId: string, options = {}) => {
  return useQuery({
    queryKey: ["orderDetails", orderId],
    queryFn: () => getOrderDetailsApi(orderId),
    retry: 1,
    ...defaultQueryOptions,
    ...options,
    placeholderData: () => {
      return queryClient.getQueryData(["orderDetails", orderId]);
    },
  });
};

export const useGetDesignerOrdersQuery = (designerId: string, options = {}) => {
  return useQuery({
    queryKey: ["designerOrders", designerId],
    queryFn: () => getDesginerOrdersApi(designerId),
    retry: 1,
    ...defaultQueryOptions,
    ...options,
    placeholderData: () => {
      return queryClient.getQueryData(["designerOrders", designerId]);
    },
  });
};
