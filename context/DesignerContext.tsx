import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import {
  addNewProduct,
  getDesignerProfile,
  updateStoreProfileDetails,
  getStoreInventory,
  deleteProduct,
  updateSingleProduct,
} from "../api/designer";
import {
  useGetDesignerInventory,
  useGetDesignerProfileQuery,
} from "../api/queries/designer";
import { MESSAGE_TYPES } from "../constants/const";
import { IStore, DesignerContextProps, IProduct } from "../types/index";
import { useAlert } from "./AlertContext";
import { useAuth } from "./AuthContext";
import { router } from "expo-router";

const DesignerContext = createContext<DesignerContextProps | undefined>(
  undefined
);
const QUERY_RETRY_CAP = 2;
const MUTATION_RETRY_CAP = 2;

export const DesignerProvider: React.FC = ({ children }) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [designerProfile, setDesignerProfile] = useState<IStore>({});
  const [inventory, setInventory] = useState<IProduct[]>([]);

  const { user } = useAuth();

  const { showAlert, hideAlert } = useAlert();

  const {
    data: fetchedDesignerProfile,
    refetch: refetchDesignerProfile,
    error: designerProfileError,
  } = useGetDesignerProfileQuery(user);

  useEffect(() => {
    if (fetchedDesignerProfile) {
      setDesignerProfile(fetchedDesignerProfile?.store);
    }
  }, [fetchedDesignerProfile]);

  const {
    data: fetchedInventory,
    refetch: refetchInventory,
    error: inventoryError,
    isPending: isFetchingInventory,
  } = useGetDesignerInventory(designerProfile, user);

  useEffect(() => {
    if (fetchedInventory) {
      setInventory(fetchedInventory?.inventory);
    }
  }, [fetchedInventory]);

  const updateDesignerProfileMutation = useMutation({
    mutationFn: updateStoreProfileDetails,
    onSuccess: async (data) => {
      if (data.messageType === MESSAGE_TYPES.SUCCESS) {
        setDesignerProfile((prevDetails) => ({ ...prevDetails, ...data }));
        showAlert("success", "Store Profile Updated!");
        refetchDesignerProfile();
      }
    },
    onError: (error: Error) => {
      showAlert("error", error.message);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: updateSingleProduct,
    onSuccess: async (data) => {
      if (data.messageType === MESSAGE_TYPES.SUCCESS) {
        showAlert("success", `Inventory item '${data?.name}' Updated!`);
        refetchInventory();
      }
    },
    onError: (error: Error) => {
      showAlert(
        "error",
        "Oops, Can't seem to update the inventory right now. Try again later"
      );
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async (data) => {
      if (data.messageType === MESSAGE_TYPES.SUCCESS) {
        showAlert("success", "Product deleted!");
        refetchInventory();
      }
    },
    onError: (error: Error) => {
      showAlert(
        "error",
        "Oops, Can't seem to delete item from inventory right now. Try again later"
      );

      return error.message;
    },
  });

  const addProduct = (designer_id: string, product: IProduct) => {
    addProductMutation.mutate({ designer_id, product });
  };

  const contextValue: DesignerContextProps = {
    designerProfile,
    inventory,
    refetchDesignerProfile,
    refetchInventory,
    updateDesignerProfileMutation,
    updateProductMutation,
    deleteProductMutation,
    isPending,
    isFetchingInventory,
    designerProfileError,
    inventoryError,
  };

  return (
    <DesignerContext.Provider value={contextValue}>
      {children}
    </DesignerContext.Provider>
  );
};

export const useDesigner = () => {
  const context = useContext(DesignerContext);
  if (!context) {
    throw new Error("useDesigner must be used within a DesignerProvider");
  }
  return context;
};
