import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Checkbox } from "expo-checkbox";
import {
  accessoriesCategories,
  clothingCategories,
} from "../../../constants/categories";

interface Category {
  id: string;
  name: string;
  value: string;
}

interface SelectCategoriesProps {
  setProductData: React.Dispatch<React.SetStateAction<any>>;
  productData: {
    categories: string[];
    type: string;
    [key: string]: any;
  };
}

export const SelectCategories: React.FC<SelectCategoriesProps> = ({
  setProductData,
  productData,
}) => {
  const categories =
    productData?.type?.toLowerCase() === "accessories"
      ? accessoriesCategories
      : clothingCategories;

  const toggleCategory = (categoryName: string) => {
    setProductData((prevData) => {
      const updatedCategories = prevData.categories.includes(categoryName)
        ? prevData.categories.filter((cat) => cat !== categoryName)
        : [...prevData.categories, categoryName];

      return {
        ...prevData,
        categories: updatedCategories.slice(0, 5), // Limit to 5 categories
      };
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Categories (Up to 5)</Text>
      <ScrollView style={styles.scrollView}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.checkboxContainer}
            onPress={() => toggleCategory(category.value)}
            activeOpacity={0.7}>
            <Checkbox
              value={productData.categories.includes(category.value)}
              onValueChange={() => toggleCategory(category.value)}
              color={
                productData.categories.includes(category.value)
                  ? "#4630EB"
                  : undefined
              }
              style={styles.checkbox}
            />
            <Text style={styles.label}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.selectedCount}>
        Selected: {productData.categories.length}/5
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: 400,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 3,
  },
  checkbox: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  selectedCount: {
    marginTop: 16,
    fontSize: 14,
    fontStyle: "italic",
  },
});
