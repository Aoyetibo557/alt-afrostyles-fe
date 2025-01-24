import {
  KeyboardAvoidingView,
  ActionSheetIOS,
  Modal,
  Platform,
  ScrollView,
  Animated,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Modal as CustomModal } from "../../../../../components/common/modal";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { router } from "expo-router";
import { ProductCard } from "@/components/product/product-card/productCard";
import { StackScreenHeader } from "@/components/common/stackheader";
import { useDesigner } from "@/context/DesignerContext";
import { useInventoryActions } from "@/hooks/useInventoryActions";
import { COLORS } from "@/styles/colors";
import { InventoryItem } from "@/components/designers/inventoryitem";
import { EditProduct } from "@/components/designers/editproduct";

const ViewInventoryScreen = () => {
  const scrollY = new Animated.Value(0);
  const { designerProfile } = useDesigner();
  const { inventory, isPending, inventoryError, refetchInventory } =
    useDesigner();
  const [viewMode, setViewMode] = useState<string>("list");

  const {
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
    hideEditModal,
  } = useInventoryActions();

  const handleLongPress = (product: IProduct) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Edit", "Delete", "Cancel"],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
        title: `${product.name} - Options`,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          showEditModal(product);
        } else if (buttonIndex === 1) {
          showDeleteModal(product);
        }
      }
    );
  };

  const renderModals = () => {
    return (
      <>
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
          onRequestClose={hideEditModal}>
          {selectedProduct && (
            <EditProduct
              item={selectedProduct}
              isPending={isUpdating}
              onSubmit={handleEdit}
              onCancel={() => setEditModalVisible(false)}
            />
          )}
        </Modal>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        title="All Inventory"
        leftIcon={{ name: "arrow-back", type: "Ionicons" }}
        leftText={inventory.length > 0 ? "Manage" : ""}
        onLeftPress={() => router.back()}
        scrollY={scrollY}
        rightIcon={{
          name: viewMode === "list" ? "grid-outline" : "list-outline",
          type: "Ionicons",
        }}
        onRightPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}
      />

      {renderModals()}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.body}>
        {inventory.length > 0 ? (
          <>
            <View>
              <Text style={styles.cta}>
                {viewMode === "list"
                  ? "Swipe left to see action buttons for editing or deleting a product"
                  : "Tap on a product to view details. To edit or delete, long press the product for options"}
              </Text>
            </View>
            <FlatList
              key={viewMode}
              data={inventory}
              renderItem={({ item }) =>
                viewMode === "list" ? (
                  <InventoryItem item={item} />
                ) : (
                  <ProductCard product={item} onLongPress={handleLongPress} />
                )
              }
              keyExtractor={(item) => item.id}
              onRefresh={refetchInventory}
              refreshing={isPending}
              numColumns={viewMode === "list" ? 1 : 2}
              columnWrapperStyle={
                viewMode === "grid" ? styles.gridColumnWrapper : null
              }
            />
          </>
        ) : (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>
              No inventory added for this store yet.
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ViewInventoryScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    height: "120%",
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  cta: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.5,
    fontFamily: "Poppins",
    marginBottom: 15,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  screenTitle: {
    fontSize: 32,
    fontFamily: "PoppinsBold",
  },
  emptyView: {
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Poppins",
    textAlign: "center",
    opacity: 0.5,
  },
  gridColumnWrapper: {
    justifyContent: "space-between",
    padding: 10,
  },
});
