import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Modal as CustomModal } from "../common";
import { Swipeable } from "react-native-gesture-handler";
import { EditProduct } from "./editproduct";
import { useDesigner } from "@/context/DesignerContext";
import { useInventoryActions } from "@/hooks/useInventoryActions";
import { COLORS } from "../../styles/colors";
import { Loading } from "../common/loading";
import { IProduct } from "../../types/index";

interface InventoryItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
    is_draft: boolean;
    is_published: boolean;
  };
}

export const InventoryItem: React.FC<InventoryItemProps> = ({ item }) => {
  const {
    designerProfile,
    updateProductMutation,
    deleteProductMutation,
    isProductUpdating,
  } = useDesigner();
  const { mutate: updateProduct, isPending, error } = updateProductMutation;
  const {
    mutate: deleteProduct,
    isPending: isDeletingProduct,
    error: deleteError,
  } = deleteProductMutation;

  const handleRequestClose = () => {
    if (!isUpdating) {
      setEditModalVisible(false);
    }
  };

  const {
    isEditModalVisible,
    isDeleteModalVisible,
    isUpdating,
    isDeleting,
    handleEdit,
    handleDelete,
    showEditModal,
    showDeleteModal,
    setEditModalVisible,
    setDeleteModalVisible,
  } = useInventoryActions();

  const renderRightActions = () => (
    <View style={styles.rightActions}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => setEditModalVisible(true)}>
        <Text style={styles.actionButtonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => setDeleteModalVisible(true)}>
        <Text style={styles.actionButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.container}>
        <View style={styles.mainInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.quantity}>Qty: {item.quantity}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      <CustomModal
        isVisible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item? This action cannot be undone."
        primaryButtonText={isDeleting ? "Deleting..." : "Delete"}
        onPrimaryButtonPress={handleDelete}
        secondaryButtonText="Cancel"
        onSecondaryButtonPress={() => setDeleteModalVisible(false)}
        isPrimaryDestructive={true}
        isPrimaryLoading={isDeleting}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(false)}>
        <EditProduct
          item={item}
          isPending={isUpdating}
          onSubmit={handleEdit}
          onCancel={() => setEditModalVisible(false)}
        />
      </Modal>
    </Swipeable>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: COLORS.background,
  },
  mainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
  },
  price: {
    fontSize: 16,
    fontFamily: "Poppins",
  },
  quantity: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#666",
  },
  rightActions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  actionButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: 40,
  },
  editButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.green,
  },
  deleteButton: {
    backgroundColor: COLORS.green,
    borderRadius: 8,
    borderWidth: 0,
  },
  actionButtonText: {
    fontFamily: "Poppins",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins_Semibold",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 15,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 15,
    marginTop: 20,
  },
  modalButton: {
    width: 110,
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  deleteButtonText: {
    color: "white",
  },
  viewButton: {
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
  },
  whiteText: {
    color: "white",
    fontFamily: "Poppins",
    fontSize: 15,
  },
});
