import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FormInput } from "@/components/common";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/styles/colors";
import { useAlert } from "../../context/AlertContext";

interface SizeData {
  quantity: number;
}

interface SizeManagerProps {
  initialSizes: Record<string, SizeData> | null;
  onSizesChange: (sizes: Record<string, SizeData> | null) => void;
}

const VALID_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export const SizeManager: React.FC<SizeManagerProps> = ({
  initialSizes,
  onSizesChange,
}) => {
  const [sizes, setSizes] = useState<Record<string, SizeData> | null>(
    initialSizes
  );
  const [error, setError] = useState<string>("");
  const { showAlert } = useAlert();

  useEffect(() => {
    if (sizes === null || Object.keys(sizes).length === 0) {
      setSizes(null);
      onSizesChange(null);
    }
  }, [sizes]);

  const handleSizeChange = (
    oldSize: string,
    field: "size" | "quantity",
    value: string
  ) => {
    if (!sizes) return;

    if (field === "size") {
      const newSize = value.toUpperCase().trim();
      if (newSize === oldSize) return; // No change
      if (!VALID_SIZES.includes(newSize)) {
        showAlert(
          "error",
          "Invalid size. Please use XS, S, M, L, XL, XXL, or XXXL."
        );
        setError("Invalid size. Please use XS, S, M, L, XL, XXL, or XXXL.");
        return;
      }
      if (newSize in sizes) {
        showAlert("error", "This size already exists.");
        setError("This size already exists.");
        return;
      }
      const { [oldSize]: sizeData, ...rest } = sizes;
      const updatedSizes = { ...rest, [newSize]: sizeData };
      setSizes(updatedSizes);
      onSizesChange(updatedSizes);
    } else {
      const quantity = parseInt(value, 10) || 0;
      const updatedSizes = {
        ...sizes,
        [oldSize]: { ...sizes[oldSize], quantity },
      };
      setSizes(updatedSizes);
      onSizesChange(updatedSizes);
    }
  };

  const addSize = () => {
    const currentSizes = sizes || {};
    const availableSizes = VALID_SIZES.filter(
      (size) => !(size in currentSizes)
    );
    if (availableSizes.length === 0) {
      showAlert("error", "All valid sizes have been added.");
      setError("All valid sizes have been added");
      return;
    }
    const newSize = availableSizes[0];
    const updatedSizes = { ...currentSizes, [newSize]: { quantity: 0 } };
    setSizes(updatedSizes);
    onSizesChange(updatedSizes);
  };

  const removeSize = (sizeToRemove: string) => {
    if (!sizes) return;
    const { [sizeToRemove]: _, ...updatedSizes } = sizes;
    if (Object.keys(updatedSizes).length === 0) {
      setSizes(null);
      onSizesChange(null);
    } else {
      setSizes(updatedSizes);
      onSizesChange(updatedSizes);
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Sizes and Quantities</Text>
      <TouchableOpacity onPress={addSize} style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
        <Text style={styles.addButtonText}>Add Size</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {sizes &&
        Object.entries(sizes).map(([size, sizeData]) => (
          <View key={size} style={styles.sizeRow}>
            <FormInput
              iconName="resize-outline"
              iconSize={20}
              iconColor={COLORS.textSecondary}
              placeholder="Size"
              value={size}
              onChangeText={(text) => handleSizeChange(size, "size", text)}
              label="Size"
              keyboardType="default"
              style={styles.sizeInput}
              editable={false} // Make size input non-editable
            />
            <FormInput
              iconName="list-outline"
              iconSize={20}
              iconColor={COLORS.textSecondary}
              placeholder="Quantity"
              value={sizeData.quantity.toString()}
              onChangeText={(text) => handleSizeChange(size, "quantity", text)}
              keyboardType="numeric"
              label="Quantity"
              style={styles.quantityInput}
            />
            <TouchableOpacity
              onPress={() => removeSize(size)}
              style={styles.removeButton}>
              <Ionicons
                name="close-circle-outline"
                size={24}
                color={COLORS.error}
              />
            </TouchableOpacity>
          </View>
        ))}
    </View>
  );
};
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PoppinsMedium",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
  },
  sizeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sizeInput: {
    flex: 1,
    width: 150,
    marginRight: 10,
  },
  quantityInput: {
    flex: 1,
    width: 150,
    marginRight: 10,
  },
  removeButton: {
    padding: 5,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    marginLeft: 5,
    color: COLORS.primary,
    fontFamily: "PoppinsMedium",
  },
  errorText: {
    color: "red",
    fontFamily: "Poppins",
    fontSize: 14,
  },
});
