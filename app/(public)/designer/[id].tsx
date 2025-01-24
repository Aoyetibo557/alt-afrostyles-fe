import React from "react";
import { View, StyleSheet, Text, FlatList, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useGetDesignerInfoQuery } from "@/api/queries/designer";
import { useAuth } from "@/context/AuthContext";
import { useGetDesignerProductsQuery } from "@/api/queries/product";
import { useDesigner } from "@/context/DesignerContext";
import { Avatar } from "@/components/avatar/avatar";
import { StackScreenHeader } from "@/components/common/stackheader";
import { Loading, Error, Button } from "@/components/common";
import { COLORS } from "@/styles/colors";
import { ProductCard } from "@/components/product/product-card/productCard";
import { isEmpty } from "lodash";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth > 768;

const StoreProfile = () => {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const { data: designerInfo, isPending: isFetchingDesignerInfo } =
    useGetDesignerInfoQuery(id);
  const { designerProfile, isPending: isFetchingStore } = useDesigner();

  const { data: productsData, isPending: isFetchingProducts } =
    useGetDesignerProductsQuery(id);

  const storeData = designerInfo?.designer || designerProfile;
  const isOwner = storeData?.user_id === user?.id;

  if (isFetchingDesignerInfo || isFetchingStore) {
    return <Loading loadingText="Fetching store profile..." isLoading={true} />;
  }

  if (!storeData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Store not found!</Text>
      </View>
    );
  }

  const handleEditStore = () => {
    router.push("../../(tabs)/profile_screens/profile/designer/storedetails");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        leftIcon={{
          name: "arrow-back",
          type: "Ionicons",
        }}
        leftText=""
        onLeftPress={() => router.back()}
      />
      <View style={styles.profileHeader}>
        <Avatar
          id={storeData.id}
          source={storeData.store_image}
          size={120}
          style={styles.enhancedAvatar}
        />
        <Text style={styles.storeName}>{storeData.store_name}</Text>
        <Text style={styles.storeDescription}>
          {storeData.store_description}
        </Text>
        <View style={styles.actionsContainer}>
          {!isEmpty(productsData?.products) && (
            <View style={styles.gridCount}>
              <Text style={styles.gridCountText}>
                {productsData?.products?.length}
              </Text>
              <Ionicons name="grid-outline" size={24} color="black" />
            </View>
          )}

          {isOwner && user && (
            <Button
              label="Edit Profile"
              onPress={handleEditStore}
              size="small"
              type="other"
            />
          )}
        </View>
      </View>

      {isEmpty(productsData?.products) ? (
        <Text style={styles.emptyText}>No products found for this store</Text>
      ) : (
        <View style={styles.productListContainer}>
          {isFetchingProducts ? (
            <Loading
              loadingText="Fetching products..."
              isLoading={isFetchingProducts}
            />
          ) : (
            <FlatList
              data={productsData?.products}
              renderItem={({ item }) => <ProductCard product={item} />}
              keyExtractor={(item) => item.id}
              numColumns={isTablet ? 3 : 2}
              columnWrapperStyle={styles.productRow}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default StoreProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 15,
  },
  storeName: {
    fontSize: 24,
    fontFamily: "Poppins_Semibold",
    marginTop: 10,
  },
  storeDescription: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: COLORS.textSecondary,
    textAlign: "center",
    marginVertical: 10,
  },
  productListContainer: {
    flex: 1,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  productRow: {
    justifyContent: "space-between",
    gap: 8,
    paddingBottom: 20,
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: 15,
    paddingVertical: 15,
  },
  gridCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  gridCountText: {
    fontFamily: "Poppins_Semibold",
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
