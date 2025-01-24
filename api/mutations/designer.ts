import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../utils/queryClient";
import { IStore, IProduct, AuthResponse, SimpleResponse } from "@/types/index";
import { createstore, addNewProduct, updateStoreImage } from "@/api/designer";

//for caching purposes
const defaultQueryOptions: Partial<QueryOptions> = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 15 * 60 * 1000, // 15 minutes
};

export const useCreateStoreMutation = () =>
  useMutation({
    mutationFn: createstore,
  });

export const useAddProductMutation = () =>
  useMutation({
    mutationFn: ({
      designer_id,
      product,
      images,
    }: {
      designer_id: string;
      product: IProduct;
      images: { file: File; uri: string }[];
    }) => addNewProduct(designer_id, product, images),
  });

export const useUpdateStoreImageMutation = (options: {}) => {
  return useMutation({
    mutationFn: ({
      fileName,
      image,
    }: {
      fileName: string;
      image: { uri: string; file: File };
    }) => updateStoreImage(fileName, image),
    onSuccess: (data) => {
      // Invalidate the featuredDesigners query to refetch the most up to date data
      queryClient.invalidateQueries({ queryKey: ["featuredDesigners"] });
      return data;
    },
    ...defaultQueryOptions,
    ...options,
  });
};
