import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { COLORS } from "../../styles/colors";
type Option = {
  label: string;
  value: string;
};

type CustomPickerProps = {
  label: string;
  options: Option[];
  selectedValue: string | string[];
  onValueChange: (value: string | string[]) => void;
  multiple?: boolean;
};

export const CustomPicker: React.FC<CustomPickerProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
  multiple = false,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSelect = (value: string) => {
    if (multiple) {
      const selectedArray = Array.isArray(selectedValue) ? selectedValue : [];
      if (selectedArray.includes(value)) {
        onValueChange(selectedArray.filter((item) => item !== value));
      } else {
        onValueChange([...selectedArray, value]);
      }
    } else {
      onValueChange(value);
      setIsDropdownVisible(false);
    }
  };

  const renderSelectedValue = () => {
    if (multiple && Array.isArray(selectedValue)) {
      return selectedValue.join(", ");
    }
    return typeof selectedValue === "string" ? selectedValue : "";
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <View style={styles.container}>
        <Text>{label}</Text>
        <TouchableOpacity
          onPress={() => setIsDropdownVisible(!isDropdownVisible)}
          style={styles.selector}>
          <Text>{renderSelectedValue() || "Select an option"}</Text>
        </TouchableOpacity>
        {isDropdownVisible && (
          <View style={styles.dropdown}>
            <ScrollView>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={[
                    styles.option,
                    (multiple &&
                      Array.isArray(selectedValue) &&
                      selectedValue.includes(option.value)) ||
                    selectedValue === option.value
                      ? styles.selectedOption
                      : null,
                  ]}>
                  <Text>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  selector: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 5,
    maxHeight: 150,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedOption: {
    backgroundColor: "#ddd",
  },
});
