import { StyleSheet, View, Text, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FormInput } from "./forminput";
import { COLORS } from "../../styles/colors";

interface SearchBarProps {
  onSearch: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  clearable?: boolean;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search...",
  style,
  inputStyle,
  clearable = true,
  onClear,
}) => {
  const [searchText, setSearchText] = useState("");

  const handleChangeText = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  return (
    <View style={[styles.container, style]}>
      <FormInput
        iconName="search-outline"
        iconSize={24}
        placeholder={placeholder}
        value={searchText}
        onChangeText={handleChangeText}
        autoCapitalize="none"
        clearable="true"
        onClear={onClear}
        style={[styles.input, inputStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  input: {},
  clearButton: {
    padding: 5,
  },
});
