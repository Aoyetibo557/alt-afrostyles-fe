import { queryClient } from "../../utils/queryClient";
import { useMutation, useQuery, QueryOptions } from "@tanstack/react-query";
import { IUser, IStore, IProduct } from "@/types/index";
import {
  getFeaturedDesigners,
  getDesignerProfile,
  getStoreInventory,
  updateStoreImage,
  getDesignerInfo,
} from "../designer";

//for caching purposes
const defaultQueryOptions: Partial<QueryOptions> = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 15 * 60 * 1000, // 15 minutes
};

export const useGetDesignerProfileQuery = (user: IUser, options = {}) => {
  return useQuery({
    queryKey: ["designerProfile"],
    queryFn: getDesignerProfile,
    enabled: !!user,
    retry: 2,
    ...defaultQueryOptions,
    ...options,
    placeholderData: () => {
      return queryClient.getQueryData(["designerProfile"], user);
    },
  });
};

export const useGetFeaturedDesigners = (options = {}) => {
  return useQuery({
    queryKey: ["featuredDesigners"],
    queryFn: getFeaturedDesigners,
    retry: 1,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useGetDesignerInventory = (
  designerProfile,
  user,
  options = {}
) => {
  return useQuery({
    queryKey: ["designerInventory", designerProfile?.id],
    queryFn: () => getStoreInventory(designerProfile?.id),
    enabled: !!designerProfile?.id || !!user,
    retry: 2,
    ...defaultQueryOptions,
    ...options,
    placeholderData: () => {
      return queryClient.getQueryData(["designerInventory"]);
    },
  });
};

export const useGetDesignerInfoQuery = (designerId, options = {}) => {
  return useQuery({
    queryKey: ["designerInfo", designerId],
    queryFn: () => getDesignerInfo(designerId),
    retry: 1,
    ...defaultQueryOptions,
    ...options,
    placeholderData: () => {
      return queryClient.getQueryData(["designerInfo", designerId]);
    },
  });
};
