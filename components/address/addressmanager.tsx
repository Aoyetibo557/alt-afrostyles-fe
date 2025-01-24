import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { scrollY } from "@/constants/const";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useShippingAddress } from "@/hooks/useShippingAddress";
import { StackScreenHeader, Loading } from "@/components/common";
import { COLORS } from "@/styles/colors";
import { IShippingAddress } from "@/types";
import { isEmpty } from "lodash";

export const AddressManager = () => {
  const { user } = useAuth();
  const {
    addresses,
    getAddresses,
    saveAddress,
    updateAddress,
    deleteAddress,
    isLoading,
    error,
    selectedAddress,
    setSelectedAddress,
  } = useShippingAddress();

  const handleEditAddress = (addressToEdit: IShippingAddress) => {
    router.push({
      pathname: "(public)/editAddress",
      params: { addressToEdit: JSON.stringify(addressToEdit), isEditing: true },
    });
  };

  const handleAddAddress = () => {
    router.push({
      pathname: "(public)/editAddress",
      params: { isEditing: false },
    });
  };

  const handleRemoveAddress = (addressId: string) => {
    deleteAddress(addressId);
  };

  const handleSelectAddress = (address: IShippingAddress) => {
    setSelectedAddress(address);
    // router.push("./checkout");
  };

  const handleSetDefaultAddress = async (address: IShippingAddress) => {
    const updatedAddress = { ...address, is_default: true };
    await updateAddress(updatedAddress);
  };

  if (isLoading) {
    return <Loading loadingText="fetching address" isLoading={isLoading} />;
  }

  const renderAddresses = () => {
    return addresses.map((addr) => (
      <Pressable
        key={addr.id}
        style={[
          styles.addressCard,
          selectedAddress?.id === addr.id && styles.selectedAddressCard,
        ]}
        onPress={() => handleSelectAddress(addr)}>
        <View style={styles.radioButton}>
          {selectedAddress?.id === addr.id && (
            <View style={styles.radioButtonInner} />
          )}
        </View>
        <View style={styles.addressInfoContainer}>
          <View style={styles.addressInfo}>
            <Text style={styles.addressName}>{addr.full_name}</Text>
            <Text style={styles.addressText}>{addr.street_address}</Text>
            <Text style={styles.addressText}>
              {`${addr.city}, ${addr.state} ${addr.zip}`}
            </Text>
            <Text style={styles.addressText}>{addr.country}</Text>
          </View>
          <View style={styles.buttons}>
            <Pressable
              style={styles.editButton}
              onPress={() => handleEditAddress(addr)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.removeButton}
              onPress={() => handleRemoveAddress(addr.id)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>

            {/* Implement this logic later */}
            {/* {!addr.is_default && (
              <Pressable
                style={styles.defaultButton}
                onPress={() => handleSetDefaultAddress(addr)}>
                <Text style={styles.defaultButtonText}>Set as Default</Text>
              </Pressable>
            )} */}
          </View>
        </View>
      </Pressable>
    ));
  };

  return (
    <View>
      <KeyboardAwareScrollView style={styles.body}>
        <Text style={styles.sectionTitle}>Your Addresses</Text>
        {addresses.length > 0 ? (
          renderAddresses()
        ) : (
          <Text style={styles.noAddressText}>No addresses saved yet.</Text>
        )}
        <TouchableOpacity
          style={styles.addNewAddressButton}
          onPress={handleAddAddress}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
          <Text style={styles.addNewAddressText}>Add new address</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_Semibold",
    marginBottom: 15,
    color: COLORS.textPrimary,
  },
  addressCard: {
    flexDirection: "row",
    // alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  selectedAddressCard: {
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  addressInfoContainer: {
    width: "100%",
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontFamily: "Poppins",
    marginBottom: 5,
    color: COLORS.textPrimary,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  buttons: {
    marginTop: 10,
    flexDirection: "row",
  },
  editButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  editButtonText: {
    fontFamily: "Poppins",
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  removeButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 8,
  },
  removeButtonText: {
    fontFamily: "Poppins",
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  defaultButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 8,
    marginLeft: 4,
  },
  defaultButtonText: {
    fontFamily: "Poppins",
    color: COLORS.primary,
    fontSize: 15,
  },
  noAddressText: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: 20,
  },
  addNewAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  addNewAddressText: {
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "PoppinsMedium",
    color: COLORS.primary,
    fontWeight: "bold",
  },
});
