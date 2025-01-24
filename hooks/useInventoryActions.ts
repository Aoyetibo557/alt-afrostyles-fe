import { useState } from "react";
import { useDesigner } from "@/context/DesignerContext";
import { IProduct } from "@/types/index";

export const useInventoryActions = () => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const { updateProductMutation, deleteProductMutation } = useDesigner();

  const { mutate: updateProduct, isPending: isUpdating } =
    updateProductMutation;
  const { mutate: deleteProduct, isPending: isDeleting } =
    deleteProductMutation;

  const handleEdit = (updatedItem: IProduct) => {
    updateProduct(updatedItem);
    if (!isUpdating) {
      setEditModalVisible(false);
    }
  };

  const handleDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      if (!isDeleting) {
        setDeleteModalVisible(false);
      }
    }
  };

  const showEditModal = (product: IProduct) => {
    setSelectedProduct(product);
    setEditModalVisible(true);
  };

  const showDeleteModal = (product: IProduct) => {
    setSelectedProduct(product);
    setDeleteModalVisible(true);
  };

  return {
    isEditModalVisible,
    isDeleteModalVisible,
    selectedProduct,
    isUpdating,
    isDeleting,
    handleEdit,
    handleDelete,
    showEditModal,
    showDeleteModal,
    setEditModalVisible,
    setDeleteModalVisible,
  };
};
