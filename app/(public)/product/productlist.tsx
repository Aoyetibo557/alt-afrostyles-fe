import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text as RNText,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FadeInDown } from "react-native-reanimated";
import { scrollY, CATEGORY_FILTERS } from "@/constants/const";
import { ProductCard } from "@/components/product/product-card/productCard";
import { useGetFilteredProductsQuery } from "@/api/queries/product";
import { COLORS } from "@/styles/colors";
import { IProduct } from "@/types/index";
import {
  StackScreenHeader,
  Loading,
  Error,
  Text,
  ErrorType,
  CustomImage,
} from "@/components/common";
import { queryClient } from "../../../utils/queryClient";
import { getErrorType } from "../../../utils/util";
import { isEmpty } from "lodash";

const ProductListScreen: React.FC = () => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [productCount, setProductCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const {
    data: queryResult,
    isLoading,
    error,
    refetch,
  } = useGetFilteredProductsQuery(
    { category, filters: activeFilters },
    {
      placeholderData: () => {
        return queryClient.getQueryData([
          "filteredProducts",
          { category, filters: [] },
        ]);
      },
    }
  );

  useEffect(() => {
    if (queryResult?.products) {
      setProductCount(queryResult?.products?.length);
    }
  }, [queryResult]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleRetry = useCallback(() => {
    setRetryCount((prevCount) => prevCount + 1);
    refetch();
  }, [refetch]);

  const renderFilterChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterList}>
      {CATEGORY_FILTERS[category]?.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterChip,
            activeFilters.includes(filter) && styles.activeFilterChip,
          ]}
          onPress={() => toggleFilter(filter)}>
          <Text
            style={[
              styles.filterChipText,
              activeFilters.includes(filter) && styles.activeFilterChipText,
            ]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderProductItem = (item: IProduct) => (
    <View style={styles.productItemContainer} key={item.id}>
      <ProductCard
        product={item}
        onPress={() =>
          router.push({
            pathname: `/product/${item?.id}`,
            params: { productId: item.id },
          })
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        title={category?.toUpperCase()}
        leftIcon="arrow-back"
        leftIconStyle={styles.topiconstyles}
        leftIconType="Ionicons"
        rightIcon="cart-outline"
        rightIconType="Ionicons"
        onLeftPress={() => router.back()}
        scrollY={scrollY}
        backgroundStyle={styles.stackheader}
      />
      <ScrollView
        style={styles.body}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.header}>
          <Text font="Poppins">{productCount} Apparel(s)</Text>
          <TouchableOpacity
            onPress={() => {
              /* Implement sort functionality */
            }}>
            <Text style={styles.sortButton}>Sort</Text>
          </TouchableOpacity>
        </View>

        {renderFilterChips()}

        {isLoading ? (
          <View style={styles.loading}>
            <Loading loadingText="Fetching products..." isLoading={isLoading} />
          </View>
        ) : error ? (
          <Error
            type={getErrorType(error)}
            message={(error as Error).message}
            onRetry={handleRetry}
            retryCount={retryCount}
          />
        ) : (
          <View style={styles.productGrid}>
            {queryResult?.products?.map(renderProductItem)}
          </View>
        )}

        {!isLoading && !error && isEmpty(queryResult?.products) && (
          <View style={{ alignItems: "center", marginTop: 30 }}>
            <CustomImage
              source={require("../../../assets/images/logo-icon.png")}
              height={60}
              resizeMode="contain"
            />
            <Text font="Poppins">No apparels found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 12,
  },

  sortButton: {
    fontSize: 17,
    fontFamily: "Poppins",
    color: "blue",
  },
  filterList: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: COLORS.green,
    borderWidth: 0,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
  activeFilterChipText: {
    color: "#fff",
  },
  productRow: {
    justifyContent: "space-between",
  },
  loading: {
    height: 500,
    backgroundColor: "red",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8, // Add some horizontal padding
  },
  productItemContainer: {
    width: "48%", // Adjust this value to control the width of each item
    marginBottom: 16, // Add some vertical spacing between items
  },
});

export default ProductListScreen;
