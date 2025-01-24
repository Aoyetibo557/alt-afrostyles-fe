import AxiosClient from "../client";
import { getToken, decodeToken } from "../tokenStorage";
import { queryClient } from "../../utils/queryClient";
import { useMutation, useQuery, QueryOptions } from "@tanstack/react-query";
import {
  IUser,
  IStore,
  IProduct,
  AuthResponse,
  SimpleResponse,
} from "@/types/index";
import { getUserCartItems } from "../cart";

//for caching purposes
const defaultQueryOptions: Partial<QueryOptions> = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 15 * 60 * 1000, // 15 minutes
};

export const useGetUserCartQuery = (user: IUser, options = {}) => {
  return useQuery({
    queryKey: ["usercartitems"],
    queryFn: getUserCartItems,
    enabled: !!user,
    retry: 1,
    ...defaultQueryOptions,
    ...options,
    placeholderData: () => {
      return queryClient.getQueryData(["usercartitems"]);
    },
  });
};
