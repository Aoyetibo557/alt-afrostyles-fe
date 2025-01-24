import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

interface SizeSelectionProps {
  sizes: { [key: string]: { quantity: number } };
  selectedSize: string | null;
  setSelectedSize: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SizeSelection: React.FC<SizeSelectionProps> = ({
  sizes,
  selectedSize,
  setSelectedSize,
}) => {
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sizesList}>
        {sizes &&
          Object.keys(sizes).map((size) => {
            const isDisabled = sizes[size].quantity === 0;
            return (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.selectedSizeButton,
                  isDisabled && styles.disabledSizeButton,
                ]}
                onPress={() => !isDisabled && handleSizeSelect(size)}
                disabled={isDisabled}>
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && styles.selectedSizeText,
                    isDisabled && styles.disabledSizeText,
                  ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  sizesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sizeButton: {
    width: 45,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    padding: 10,
    margin: 5,
  },
  selectedSizeButton: {
    borderWidth: 0,
    backgroundColor: COLORS.green,
  },
  disabledSizeButton: {
    borderColor: COLORS.gray,
    backgroundColor: COLORS.lightGray,
  },
  sizeText: {
    fontSize: 15,
    fontFamily: "Poppins",
    color: COLORS.primary,
    textAlign: "center",
  },
  selectedSizeText: {
    color: COLORS.textPrimary,
  },
  disabledSizeText: {
    color: COLORS.gray,
  },
});
