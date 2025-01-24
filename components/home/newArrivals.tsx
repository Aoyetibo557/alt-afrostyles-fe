import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { ProductCard } from "../product/product-card/productCard";
import { COLORS } from "@/styles/colors";
import { IProduct } from "@/types/product";

interface NewArrivalsProps {
  products: IProduct[];
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ products }) => {
  const handleProductPress = (productId: string) => {
    router.push({
      pathname: "/product/[id]",
      params: { id: productId },
    });
  };

  return (
    products && (
      <View style={styles.container}>
        <Text style={styles.title}>New Arrivals</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {products?.map((product) => (
            <View key={product.id} style={styles.productContainer}>
              <ProductCard
                product={product}
                onPress={() => handleProductPress(product.id)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "PoppinsMedium",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  productContainer: {
    marginRight: 15,
  },
});
