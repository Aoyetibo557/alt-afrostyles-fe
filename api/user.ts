import AxiosClient from "./client";
import { getToken, decodeToken } from "../tokenStorage";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  IUser,
  IStore,
  IProduct,
  IShippingAdress,
  AuthResponse,
  SimpleResponse,
} from "@/types/index";
import * as FileSystem from "expo-file-system";

//update user
export const updateUserProfile = async (updatedUser: Partial<IUser>) => {
  const response = await AxiosClient.put(`/user/updateuser`, {
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
  });
  return response.data;
};

export const updateProfilePicture = async (
  fileName: string,
  image: { uri: string; file: File }
): Promise<string> => {
  try {
    //using mutltipart logic to send file to backend for upload
    const formData = new FormData();
    formData.append("fileName", fileName);
    formData.append("file", {
      uri: image.uri,
      name: fileName,
    });

    const response = await AxiosClient.put(
      "/user/updateprofilepicture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

// address api calls
export const addNewAddressApi = async (address: IShippingAdress) => {
  const response = await AxiosClient.post<SimpleResponse>(
    `/shippingaddress/newaddress`,
    {
      fullName: address.full_name,
      street: address.street_address,
      city: address.city,
      state: address.state,
      zip: address.postal_code,
      country: address.country,
    }
  );
  return response.data;
};

export const getUserAddressesApi = async () => {
  const response = await AxiosClient.get<SimpleResponse>(
    "/shippingaddress/getuseraddresses"
  );

  return response.data;
};

export const updateAddressApi = async (
  addressId: string,
  updatedAddress: IShippingAdress
) => {
  const response = await AxiosClient.put<SimpleResponse>(
    `/shippingaddress/updateaddress`,
    {
      addressId,
      updatedAddress,
    }
  );

  return response.data;
};

export const deleteAddressApi = async (addressId: string) => {
  const response = await AxiosClient.delete<SimpleResponse>(
    `/shippingaddress/deleteaddress/${addressId}`
  );

  return response.data;
};
