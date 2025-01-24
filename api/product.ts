import AxiosClient from "./client";
import { IProduct, SimpleResponse } from "@/types/index";

export const getAllProductsApi = async () => {
  const response = await AxiosClient.get<SimpleResponse>(
    `/product/getallproducts`
  );

  return response.data;
};

export const getFilteredProductsApi = async (query: any) => {
  const response = await AxiosClient.get<SimpleResponse>(
    `/product/getfiltered`,
    {
      params: query,
    }
  );

  return response.data;
};

export const getDesignerProductsApi = async (designerId: string) => {
  const response = await AxiosClient.get<SimpleResponse>(
    `/product/designer/${designerId}`
  );
  return response.data;
};

export const getProductApi = async (productId: string) => {
  const response = await AxiosClient.get<SimpleResponse>(
    `/product/getproduct/${productId}`
  );

  return response.data;
};
