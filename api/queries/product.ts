import AxiosClient from "../client";
import { queryClient } from "../../utils/queryClient";
import { useQuery, useQueries, QueryOptions } from "@tanstack/react-query";
import { IProduct } from "@/types/index";
import {
  getAllProductsApi,
  getFilteredProductsApi,
  getDesignerProductsApi,
  getProductApi,
} from "../product";

interface CombinedResult {
  data: (IProduct | null)[];
  isPending: boolean;
  error: boolean;
}

const defaultQueryOptions: Partial<QueryOptions> = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 15 * 60 * 1000, // 15 minutes
};

export const useGetAllProductsQuery = (options = {}) => {
  return useQuery({
    queryKey: ["getAllProducts"],
    queryFn: getAllProductsApi,
    retry: 2,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useGetProductQuery = (
  productId: string,
  options: QueryOptions = {}
) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductApi(productId),
    retry: 1,
    ...defaultQueryOptions,
    ...options,
    placeholderData: () => {
      return queryClient.getQueryData(["product", productId]);
    },
  });
};

export const useGetProductsQueries = (
  productIds: string[] | undefined,
  options: QueryOptions = {}
) => {
  const validProductIds = Array.isArray(productIds) ? productIds : [];

  const queryResults = useQueries({
    queries: validProductIds?.map((id) => ({
      queryKey: ["product", id],
      queryFn: () => getProductApi(id),
      retry: 1,
      enabled: !!productIds,
      ...options,
    })),
  });

  const combinedResult = {
    data: queryResults?.map((result) => result?.data?.product ?? null),
    isPending: queryResults.some((result) => result.isLoading),
    error: queryResults.some((result) => result.isError),
    refetch: () => Promise.all(queryResults.map((result) => result.refetch())),
  };

  return combinedResult;
};

export const useGetDesignerProductsQuery = (
  designerId: string,
  options = {}
) => {
  return useQuery({
    queryKey: ["designerProducts", designerId],
    queryFn: () => getDesignerProductsApi(designerId),
    retry: 1,
    ...defaultQueryOptions,
    ...options,
    placeholderData: () => {
      return queryClient.getQueryData(["designerProducts"], designerId);
    },
  });
};

export const useGetFilteredProductsQuery = (
  query: any,
  options: QueryOptions = {}
) => {
  return useQuery({
    queryKey: ["filteredProducts", query],
    queryFn: () => getFilteredProductsApi(query),
    retry: 1,
    ...defaultQueryOptions,
    ...options,
  });
};

/**
 * Update the cache manually when you have new data (e.g., after a mutation):
 * - queryClient.setQueryData(["product", productId], newProductData);
 * 
 * Invalidate the query when you know the data has changed:
 * queryClient.invalidateQueries(["product", productId]);
 * 
 * 
 * Use this hook consistently throughout your app for fetching product data.
Consider prefetching important data:
 * queryClient.prefetchQuery(["product", productId], () => getProductApi(productId));
 *  */
