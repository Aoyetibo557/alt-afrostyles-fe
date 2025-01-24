import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "@/styles/colors";
import { IProduct } from "@/types/index";
import { getCategoryNameByValue } from "@/constants/categories";
import { truncate } from "lodash";

export const ProductDetails = ({ product }: { product: IProduct }) => {
  const [truncateLength, setTruncateLength] = useState<number>(145);

  const truncateOptions = {
    length: truncateLength,
  };

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.header}>
        <Text style={styles.price}>${product?.price?.toFixed(2)}</Text>
      </View>
      <Text style={styles.productName}>{product?.name}</Text>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          {truncate(product?.description, truncateOptions)}
        </Text>
        {product.description &&
        truncateLength === product?.description?.length ? (
          <TouchableOpacity onPress={() => setTruncateLength(120)}>
            <Text style={styles.descriptionButton}>Show less</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setTruncateLength(product?.description?.length)}>
            <Text style={styles.descriptionButton}>
              {truncateLength < product?.description?.length && "Read more"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoryContainer}>
        {product?.categories?.map((category, index) => (
          <View key={index} style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {getCategoryNameByValue(category)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  productName: {
    fontSize: 19,
    fontFamily: "Poppins_Semibold",
    color: COLORS.textPrimary,
  },
  price: {
    fontSize: 24,
    fontFamily: "PoppinsMedium",
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  descriptionContainer: {
    gap: 5,
  },
  description: {
    fontSize: 15,
    fontFamily: "Poppins",
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  descriptionButton: {
    fontFamily: "Poppins",
    fontSize: 15,
    color: COLORS.textPrimary,
    textDecorationLine: "underline",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  categoryBadge: {
    backgroundColor: COLORS.green,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: COLORS.textPrimary,
  },
});
