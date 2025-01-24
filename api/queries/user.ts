import { queryClient } from "../../utils/queryClient";
import { useMutation, useQuery, QueryOptions } from "@tanstack/react-query";
import { IUser, IStore, IShippingAdress } from "@/types/index";
import { fetchUser } from "../authService";
import { getUserAddressesApi } from "../user";

//for caching purposes
const defaultQueryOptions: Partial<QueryOptions> = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 15 * 60 * 1000, // 15 minutes
};

export const useFetchUserQuery = (userId: string, options = {}) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
    retry: 1,
    ...defaultQueryOptions,
    ...options,
    placeholderData: () => {
      return queryClient.getQueryData(["user", userId]);
    },
  });
};

export const useGetUserAddressesQuery = (options = {}) => {
  return useQuery({
    queryKey: ["userAddresses"],
    queryFn: getUserAddressesApi,
    retry: 1,
    ...defaultQueryOptions,
    ...options,
    placeholderData: () => {
      return queryClient.getQueryData(["userAddresses"]);
    },
  });
};
