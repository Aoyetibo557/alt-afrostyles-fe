import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Checkbox } from "expo-checkbox";
import { COLORS } from "@/styles/colors";

interface AddSizesProps {
  setProductData: React.Dispatch<React.SetStateAction<any>>;
  productData: {
    sizes: Record<string, { quantity: number }>;
    fitPreference?: string;
    [key: string]: any;
  };
}

const regularSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const fitPreferences = ["Tight", "Fitted", "Regular", "Loose"];

export const AddSizes: React.FC<AddSizesProps> = ({
  setProductData,
  productData,
}) => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sizes, setSizes] = useState<Record<string, { quantity: number }>>(
    productData.sizes || {}
  );
  const [fitPreference, setFitPreference] = useState<string>(
    productData.fitPreference || "Regular"
  );

  const handleSizeSelection = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSizeQuantityChange = (size: string, quantity: string) => {
    setSizes((prev) => ({
      ...prev,
      [size]: { quantity: parseInt(quantity) || 0 },
    }));
  };

  const saveData = () => {
    setProductData((prevData) => ({
      ...prevData,
      sizes: selectedSizes.reduce((acc, size) => {
        acc[size] = sizes[size] || { quantity: 0 };
        return acc;
      }, {} as Record<string, { quantity: number }>),
      fitPreference: fitPreference,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Size Information</Text>

      {regularSizes.map((size) => (
        <View key={size} style={styles.sizeRow}>
          <Checkbox
            value={selectedSizes.includes(size)}
            onValueChange={() => handleSizeSelection(size)}
            color={selectedSizes.includes(size) ? "#4630EB" : undefined}
          />

          <Text style={styles.sizeText}>{size}</Text>
          {selectedSizes.includes(size) && (
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={sizes[size]?.quantity.toString() || "0"}
              onChangeText={(value) => handleSizeQuantityChange(size, value)}
              placeholder="Quantity"
            />
          )}
        </View>
      ))}

      <Text style={styles.title}>Fit Preference</Text>
      {fitPreferences.map((fit) => (
        <TouchableOpacity
          key={fit}
          style={[
            styles.fitOption,
            fitPreference === fit && styles.selectedFitOption,
          ]}
          onPress={() => setFitPreference(fit)}>
          <Text
            style={[
              styles.fitText,
              fitPreference === fit && styles.selectedFitText,
            ]}>
            {fit}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={saveData}>
        <Text style={styles.buttonText}>Save Size Information</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "PoppinsMedium",
    paddingBottom: 10,
    paddingTop: 20,
  },
  sizeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sizeText: {
    fontSize: 16,
    fontFamily: "Poppins",
    flex: 1,
    paddingHorizontal: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    width: 100,
    textAlign: "right",
  },
  fitOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 8,
    alignItems: "center",
  },
  selectedFitOption: {
    borderColor: COLORS.green,
  },
  fitText: {
    fontSize: 16,
    fontFamily: "Poppins",
  },
  selectedFitText: {
    color: COLORS.green,
  },
  saveButton: {
    backgroundColor: COLORS.green,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: "PoppinsMedium",
  },
});
