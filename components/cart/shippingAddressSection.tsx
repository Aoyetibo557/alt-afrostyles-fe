import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/styles/colors";
import { isEmpty } from "lodash";

export const ShippingAddress = ({
  addresses,
  selectedAddress,
  isLoading,
  onPress,
}) => (
  <TouchableOpacity style={styles.section} onPress={onPress}>
    <View style={styles.sectionHeader}>
      <Ionicons name="location-outline" size={24} color={COLORS.green} />
      <View>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        {isEmpty(addresses) ? (
          <Text style={styles.addAddressText}>Add shipping address</Text>
        ) : (
          <Text style={styles.addressText}>
            {`${selectedAddress?.street_address}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`}
          </Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    gap: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: COLORS.textPrimary,
  },
  addAddressText: {
    color: COLORS.textSecondary,
    fontFamily: "Poppins",
    fontSize: 13,
    flexWrap: "wrap",
  },
  addressText: {
    color: COLORS.textSecondary,
    fontFamily: "Poppins",
    fontSize: 13,
    flexWrap: "wrap",
  },
});
