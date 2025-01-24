import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formstyles } from "../../styles/formStyles";
import _ from "lodash";
import { COLORS } from "../../styles/colors";

type FormInputProps = {
  iconName: string;
  iconSize: number;
  iconColor: string;
  placeholder: string;
  value: any;
  onChangeText: (text: string) => void;
  secureTextEntry: boolean;
  autoCapitalize: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  clearable?: boolean;
  label?: string;
  style?: any;
  error?: string;
  onClear?: () => void;
};

const defaultFormInputProps: Partial<FormInputProps> = {
  iconSize: 30,
  iconColor: "#ccc",
  secureTextEntry: false,
  autoCapitalize: "none",
};

const truncateOptions = {
  length: 70,
};

export const FormInput: React.FC<FormInputProps> = ({
  iconName,
  iconSize = defaultFormInputProps.iconSize!,
  iconColor = defaultFormInputProps.iconColor!,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = defaultFormInputProps.secureTextEntry!,
  autoCapitalize = defaultFormInputProps.autoCapitalize!,
  multiline,
  numberOfLines,
  keyboardType,
  clearable = true,
  label,
  style,
  error,
  onClear,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText("");
    if (onClear) onClear();
  };

  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
        }}>
        {label && (
          <View>
            <Text style={styles.label}>{label}</Text>
          </View>
        )}
        {error && (
          <Text style={styles.errorText}>
            ({_.truncate(error, truncateOptions)})
          </Text>
        )}
      </View>
      <View style={[styles.container, style]}>
        <View
          style={[
            styles.inputContainer,
            error && styles.inputContainerError,
            isFocused && styles.inputContainerFocused,
          ]}>
          {iconName && (
            <Ionicons
              name={iconName}
              size={iconSize}
              color={isFocused ? COLORS.green : iconColor}
              style={styles.icon}
            />
          )}
          <TextInput
            style={[styles.input, formstyles.input_text]}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
            numberOfLines={numberOfLines}
            keyboardType={keyboardType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {clearable && value?.length > 0 && (
            <Pressable onPress={handleClear} style={styles.clearButton}>
              <Ionicons name="close-circle" size={24} color="black" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputContainerError: {
    borderColor: "red",
  },
  inputContainerFocused: {
    // borderColor: "#4630EB",
    borderColor: COLORS.green,
    borderWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 5,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  label: {
    fontSize: 15,
    fontFamily: "Poppins",
    marginBottom: 2,
  },
});
