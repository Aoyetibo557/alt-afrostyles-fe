import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/styles/colors";
import { Text } from "../common";
import {
  accessoriesCategories,
  clothingCategories,
  getCategoryNameByValue,
  getCategoryValueByName,
} from "@/constants/categories";

export const EditCategoryChips = ({
  itemType,
  selectedCategories,
  handleCategoryChange,
}) => {
  // Determine the relevant categories based on itemType
  const categories =
    itemType?.toLowerCase() === "accessories"
      ? accessoriesCategories
      : clothingCategories;

  return (
    <View style={styles.container}>
      <Text variant="body" style={{ paddingBottom: 10 }}>
        Categories
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
        {categories.map((category) => (
          <Chip
            key={category.value}
            selected={selectedCategories.includes(category.value)}
            onPress={() => handleCategoryChange(category.name)}
            style={
              selectedCategories.includes(category.value)
                ? styles.selectedChip
                : styles.unSelectedChip
            }
            closeIcon={() =>
              selectedCategories.includes(category.value) && (
                <Ionicons name="close-outline" size={12} color="black" />
              )
            }>
            {category.name}
          </Chip>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  selectedChip: {
    backgroundColor: COLORS.green,
    fontFamily: "Poppins",
    textAlign: "center",
    margin: 2,
  },
  unSelectedChip: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border,
    margin: 2,
  },
});
