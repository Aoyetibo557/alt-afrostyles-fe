import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../utils/queryClient";
import { IStore, IProduct, IShippingAddress } from "@/types/index";
import {
  updateUserProfile,
  addNewAddressApi,
  updateAddressApi,
  deleteAddressApi,
} from "../user";

export const useUpdateUserMutation = () =>
  useMutation({
    mutationFn: updateUserProfile,
  });

export const useAddNewAddressMutation = () => {
  return useMutation({
    mutationFn: ({ address }: { address: IShippingAddress }) =>
      addNewAddressApi(address),
    onSuccess: (data) => {
      // Invalidate the userAddresses query to refetch the most up to date addresses
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      return data;
    },
  });
};

export const useUpdateAddressMutation = () => {
  return useMutation({
    mutationFn: ({
      addressId,
      updatedAddress,
    }: {
      addressId: string;
      updatedAddre: IShippingAddress;
    }) => updateAddressApi(addressId, updatedAddress),
    onSuccess: () => {
      // Invalidate the userAddresses query to refetch the most up to date addresses
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
    },
  });
};

export const useDeleteAddressMutation = () => {
  return useMutation({
    mutationFn: ({ addressId }: { addressId: string }) =>
      deleteAddressApi(addressId),
  });
};
