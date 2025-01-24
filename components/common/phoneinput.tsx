import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { FormInput } from "./forminput";
import { Collapsible } from "@/components/Collapsible";
import { areaCodes } from "@/constants/const";
import { COLORS } from "@/styles/colors";

interface PhoneInputProps {
  value: string;
  onChangeText: (phoneNumber: string) => void;
  label?: string;
}

export function PhoneInput({ value, onChangeText, label }: PhoneInputProps) {
  const [areaCode, setAreaCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState(
    value.replace(/^\+\d+\s*/, "")
  );
  const [areaCodeSearch, setAreaCodeSearch] = useState("");
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  const handleAreaCodeChange = useCallback(
    (newAreaCode: string) => {
      setAreaCode(newAreaCode);
      setAreaCodeSearch("");
      onChangeText(`${newAreaCode} ${phoneNumber}`);
      setIsCollapsibleOpen(false);
    },
    [phoneNumber, onChangeText]
  );

  const handlePhoneNumberChange = useCallback(
    (newPhoneNumber: string) => {
      setPhoneNumber(newPhoneNumber);
      onChangeText(`${areaCode} ${newPhoneNumber}`);
    },
    [areaCode, onChangeText]
  );

  const filteredAreaCodes = areaCodes.filter(
    (code) =>
      code.code.includes(areaCodeSearch) ||
      code.country.toLowerCase().includes(areaCodeSearch.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Collapsible
        bodyStyle={styles.collapsible}
        title={`${areaCode}`}
        label={label || "Phone"}
        isPanelOpen={isCollapsibleOpen}
        bodyStyle={styles.areaCodeCollapsible}
        onSelect={() => setIsCollapsibleOpen(false)}>
        {/* <TextInput
          style={styles.areaCodeSearch}
          placeholder="Search area code"
          value={areaCodeSearch}
          onChangeText={setAreaCodeSearch}
        /> */}
        {filteredAreaCodes.map((code) => (
          <TouchableOpacity
            key={code.code}
            style={styles.areaCodeOption}
            onPress={() => handleAreaCodeChange(code.code)}>
            <Text style={styles.areaCodeText}>
              {code.code} - {code.country}
            </Text>
          </TouchableOpacity>
        ))}
      </Collapsible>
      <FormInput
        style={styles.phoneInput}
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
        placeholder="(998) 390-6817"
        keyboardType="phone-pad"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  collapsible: {
    backgroundColor: COLORS.background,
    // position: "fixed",
  },
  areaCodeCollapsible: {
    paddingRight: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  areaCodeSearch: {
    borderWidth: 1,
    borderColor: COLORS.background,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  areaCodeOption: {
    paddingVertical: 5,
  },
  areaCodeText: {
    fontSize: 16,
    fontFamily: "Poppins",
  },
  phoneInput: {
    marginTop: 30,
    width: 500,
  },
});
