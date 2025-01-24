import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useShippingAddress } from "../../hooks/useShippingAddress";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { FormInput, CollapsiblePicker, Button } from "@/components/common";
import { COLORS } from "@/styles/colors";
import { IShippingAddress } from "@/types/index";
import { states, countries } from "@/constants/locations";
import { isEmpty } from "lodash";

const EditAddress = () => {
  const { addressToEdit } = useLocalSearchParams();
  const isEditing = !isEmpty(addressToEdit);
  const [address, setAddress] = useState<IShippingAddress>(
    addressToEdit
      ? JSON.parse(addressToEdit)
      : {
          id: "",
          full_name: "",
          street_address: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
        }
  );
  const {
    addresses,
    getAddresses,
    saveAddress,
    updateAddress,
    deleteAddress,
    isLoading,
    error,
  } = useShippingAddress();

  const handleSaveAddress = () => {
    if (!isEmpty(address)) {
      saveAddress(address);
    }
  };

  const handleSaveEdit = () => {
    if (!isEmpty(address) && isEditing) {
      updateAddress(address);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView style={styles.body}>
        <FormInput
          iconName="person-outline"
          iconSize={24}
          value={address.full_name}
          autoCapitalize="words"
          onChangeText={(text) => setAddress({ ...address, full_name: text })}
          placeholder="Full Name"
          label="Full Name"
        />
        <FormInput
          iconName="home-outline"
          iconSize={24}
          value={address.street_address}
          onChangeText={(text) =>
            setAddress({ ...address, street_address: text })
          }
          placeholder="Street Address"
          label="Street"
        />
        <FormInput
          iconName="business-outline"
          iconSize={24}
          value={address.city}
          autoCapitalize="words"
          onChangeText={(text) => setAddress({ ...address, city: text })}
          placeholder="City"
          label="City"
        />
        <CollapsiblePicker
          title="Select State"
          label="State"
          data={states}
          selectedValue={address.state}
          onValueChange={(value) => setAddress({ ...address, state: value })}
        />
        <FormInput
          iconName="map-outline"
          iconSize={24}
          value={address.postal_code}
          keyboardType="phone-pad"
          onChangeText={(text) => setAddress({ ...address, postal_code: text })}
          placeholder="ex: 39023"
          label="ZIP Code"
        />
        <CollapsiblePicker
          title="Select Country"
          label="Country"
          data={countries}
          selectedValue={address.country}
          onValueChange={(value) => setAddress({ ...address, country: value })}
        />
        {isEditing ? (
          <Button
            label="Update Address"
            loading={isLoading}
            onPress={handleSaveEdit}
            type="primary"
          />
        ) : (
          <Button
            label="Save Address"
            loading={isLoading}
            onPress={handleSaveAddress}
            type="primary"
          />
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  selectButton: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  selectButtonText: {
    color: COLORS.darkGrey,
    fontSize: 16,
  },
});

export default EditAddress;
