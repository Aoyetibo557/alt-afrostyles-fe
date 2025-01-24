import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../styles/colors";

interface CollapsiblePickerProps {
  title: string;
  label: string;
  data: string[];
  selectedValue: string | string[]; // Can be a string or an array of strings
  onValueChange: (value: string | string[]) => void;
  multiSelect?: boolean; // New prop to enable multi-select
}

export const CollapsiblePicker: React.FC<CollapsiblePickerProps> = ({
  title,
  label,
  data,
  selectedValue,
  onValueChange,
  multiSelect = false, // Default to false for single select
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleValueSelect = (value: string) => {
    if (multiSelect) {
      // Handle multi-select logic
      const selectedArray = Array.isArray(selectedValue)
        ? [...selectedValue]
        : [];
      if (selectedArray.includes(value)) {
        // Remove the item if it's already selected
        onValueChange(selectedArray.filter((item) => item !== value));
      } else {
        // Add the item if it's not selected
        onValueChange([...selectedArray, value]);
      }
    } else {
      // Handle single-select logic
      onValueChange(value);
      setModalVisible(false);
    }
  };

  const renderSelectedValue = () => {
    if (multiSelect) {
      return Array.isArray(selectedValue) && selectedValue.length > 0
        ? selectedValue.join(", ")
        : title;
    }
    return selectedValue || title;
  };

  // const isSelected = (value: string) => {
  //   return multiSelect && Array.isArray(selectedValue)
  //     ? selectedValue.includes(value)
  //     : selectedValue === value;
  // };

  // const isSelected = (value: string) => {
  //   const selectedNames = Array.isArray(selectedValue) ? selectedValue : [];
  //   const correspondingCategory = data.find((name) =>
  //     selectedNames.includes(name)
  //   );
  //   return correspondingCategory === value;
  // };

  const isSelected = (value: string) => {
    if (multiSelect && Array.isArray(selectedValue)) {
      return selectedValue.includes(value);
    } else {
      return selectedValue === value;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.selectButtonText}>{renderSelectedValue()}</Text>
          <Ionicons name="chevron-down" size={24} color={COLORS.green} />
        </TouchableOpacity>
        <Modal visible={modalVisible} transparent={true}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <FlatList
                data={data}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      isSelected(item) && styles.selectedItem, // Highlight selected item
                    ]}
                    onPress={() => handleValueSelect(item)}>
                    <Text
                      style={[
                        styles.itemText,
                        isSelected(item) && styles.selectedItemText,
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  body: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  label: {
    fontSize: 15,
    fontFamily: "Poppins",
  },
  selectButton: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectButtonText: {
    color: COLORS.darkGrey,
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "70%",
    height: 600,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: COLORS.background,
    padding: 5,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#fefefe",
  },
  itemText: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: COLORS.textSecondary,
  },
  selectedItem: {
    backgroundColor: COLORS.green,
  },
  selectedItemText: {
    color: COLORS.textPrimary,
  },
  closeButton: {
    backgroundColor: COLORS.green,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: "PoppinsMedium",
  },
});
