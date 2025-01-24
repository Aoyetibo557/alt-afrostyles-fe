import { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetUserAddressesQuery } from "../api/queries/user";
import {
  useAddNewAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from "../api/mutations/user";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { IShippingAddress } from "../types/index";

const ASYNC_STORAGE_KEY = "@selected_shipping_address";

export const useShippingAddress = () => {
  const [addresses, setAddresses] = useState<IShippingAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAddressState, setSelectedAddressState] =
    useState<IShippingAddress | null>(null);

  const [error, setError] = useState("");
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const {
    data: userAddresses,
    isPending: addressLoading,
    refetch: refetchUserAddresses,
  } = useGetUserAddressesQuery();

  const addNewAddressMutation = useAddNewAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();
  const deleteAddressMutation = useDeleteAddressMutation();

  const getAddresses = useCallback(async () => {
    try {
      let addresses: IShippingAddress[] = [];

      if (user && userAddresses?.addresses) {
        addresses = userAddresses.addresses;
      }

      const defaultAddress =
        addresses.find((addr) => addr.is_default) || addresses[0] || null;
      setAddresses(addresses);
      setSelectedAddressState(defaultAddress);
      return addresses;
    } catch (error) {
      console.error("Error fetching shipping addresses:", error);
      setError(`Error fetching shipping addresses: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, userAddresses]);

  const setSelectedAddress = async (address: IShippingAddress) => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(address));
      setSelectedAddressState(address);
    } catch (error) {
      console.error("Error setting selected address:", error);
    }
  };

  const loadSelectedAddress = async () => {
    try {
      const storedSelectedAddress = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEY
      );
      if (storedSelectedAddress) {
        setSelectedAddressState(JSON.parse(storedSelectedAddress));
      }
    } catch (error) {
      console.error("Error loading selected address:", error);
    }
  };

  const saveAddress = async (newAddress: IShippingAddress) => {
    try {
      setLoading(true);
      let updatedAddresses: IShippingAddress[];

      if (addresses.length === 0) {
        newAddress.is_default = true;
      }

      if (user) {
        const savedAddress = await addNewAddressMutation.mutateAsync(
          {
            address: newAddress,
          },
          {
            onSuccess: () => {
              router.back();
              showAlert("success", "New address created");
            },
          }
        );
        updatedAddresses = [...addresses, savedAddress];
      } else {
        updatedAddresses = [
          ...addresses,
          { ...newAddress, id: Date.now().toString() },
        ];
      }

      setAddresses(updatedAddresses);
      setSelectedAddress(
        updatedAddresses.find((addr) => addr.is_default) || updatedAddresses[0]
      );
    } catch (error) {
      console.log("Error saving shipping address:", error);
      setError(`Error saving shipping address: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (updatedAddress: IShippingAddress) => {
    try {
      setLoading(true);
      let updatedAddresses = addresses.map((addr) =>
        addr.id === updatedAddress.id ? updatedAddress : addr
      );

      if (updatedAddress.is_default) {
        updatedAddresses = updatedAddresses.map((addr) =>
          addr.id === updatedAddress.id
            ? updatedAddress
            : { ...addr, is_default: false }
        );
      }

      if (user) {
        await updateAddressMutation.mutateAsync(
          {
            addressId: updatedAddress.id,
            updatedAddress: updatedAddress,
          },
          {
            onSuccess: () => {
              router.back();
              showAlert("success", "Address updated");
            },
          }
        );
      }

      setAddresses(updatedAddresses);
      setSelectedAddress(
        updatedAddresses.find((addr) => addr.is_default) || updatedAddresses[0]
      );
    } catch (error) {
      setError(`Error updating shipping address: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      setLoading(true);
      if (user) {
        await deleteAddressMutation.mutateAsync({ addressId });
      }

      const updatedAddresses = addresses.filter(
        (addr) => addr.id !== addressId
      );
      setAddresses(updatedAddresses);
      setSelectedAddress(
        updatedAddresses.find((addr) => addr.is_default) || updatedAddresses[0]
      );
    } catch (error) {
      setError(`Error deleting shipping address: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAddresses();
  }, [getAddresses]);

  useEffect(() => {
    loadSelectedAddress();
  }, []);

  return {
    addresses,
    getAddresses,
    saveAddress,
    updateAddress,
    deleteAddress,
    isLoading:
      loading ||
      addressLoading ||
      addNewAddressMutation.isPending ||
      updateAddressMutation.isPending ||
      deleteAddressMutation.isPending,
    error,
    selectedAddress: selectedAddressState,
    setSelectedAddress,
    loadSelectedAddress,
  };
};
