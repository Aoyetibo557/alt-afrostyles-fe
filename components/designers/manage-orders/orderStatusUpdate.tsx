import React, { useState, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { View, Text, StyleSheet } from "react-native";
import { Button, FormInput } from "../../common";
import { COLORS } from "@/styles/colors";
import { useAlert } from "@/context/AlertContext";
import {
  detectCarrier,
  validateTrackingNumber,
} from "@/api/services/afterShipService";

interface OrderStatusUpdateProps {
  initialStatus: string;
  onUpdateOrder: (data: {
    status: string;
    shippingCompany?: string;
    trackingNumber?: string;
    isInternational: boolean;
    cancellationReason?: string;
  }) => void;
  isUpdating?: boolean;
}

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

//TODO: estimated_delivery_date still needs to be set and created here.
//TODO: payment_method and payment_status will be handled after stripe implementation
export const OrderStatusUpdate: React.FC<OrderStatusUpdateProps> = ({
  initialStatus,
  onUpdateOrder,
  isUpdating,
}) => {
  const { showAlert } = useAlert();

  const [status, setStatus] = useState(initialStatus);
  const [shippingCompany, setShippingCompany] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isInternational, setIsInternational] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCustomShippingCompany, setIsCustomShippingCompany] = useState(false);

  useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus);
    }
  }, [initialStatus]);

  const handleTrackingNumberChange = async () => {
    if (trackingNumber.length > 0) {
      // Detect carrier when button is clicked
      const detectedCarriers = await detectCarrier(trackingNumber);
      if (detectedCarriers.length > 0) {
        setShippingCompany(detectedCarriers[0].name); // Automatically set the first detected carrier
        showAlert("info", `Detected carrier: ${detectedCarriers[0].name}`);
        setIsCustomShippingCompany(true); // Ensure custom input is hidden until
      } else {
        setShippingCompany(""); // Clear company if detection fails
        setIsCustomShippingCompany(true); // Show manual input for custom entry
        showAlert("error", "Could not detect carrier. Please enter manually.");
      }
    } else {
      showAlert("error", "Please enter a tracking number.");
    }
  };

  const handleUpdateOrder = async () => {
    if (status === "shipped" && (!shippingCompany || !trackingNumber)) {
      showAlert(
        "error",
        "Shipping company and tracking number are required for shipped orders."
      );
      return;
    }

    // Validate tracking number format using AfterShip API
    if (
      status === "shipped" &&
      shippingCompany &&
      shippingCompany !== "Other"
    ) {
      const validTracking = await validateTrackingNumber(
        trackingNumber,
        shippingCompany
      );
      if (!validTracking) {
        showAlert("error", "Invalid tracking number format.");
        return;
      }
    }

    if (status === "cancelled" && !cancellationReason) {
      showAlert("error", "Reason for cancellation is required.");
      return;
    }

    onUpdateOrder({
      status,
      shippingCompany: status === "shipped" ? shippingCompany : "",
      trackingNumber: status === "shipped" ? trackingNumber : "",
      isInternational,
      cancellationReason: status === "cancelled" ? cancellationReason : "",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Order Status</Text>

      <Dropdown
        mode="modal"
        data={statusOptions}
        labelField="label"
        valueField="value"
        placeholder="Select status"
        value={status}
        onChange={(item) => setStatus(item.value)}
        style={styles.dropdown}
        placeholderStyle={styles.dropdownPlaceholder}
        selectedTextStyle={styles.dropdownSelectedText}
        containerStyle={styles.dropdownContainer}
      />

      {status === "shipped" && (
        <>
          <FormInput
            label="Tracking Number"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChangeText={setTrackingNumber} // Only update the state, don't detect here
            iconName="barcode-outline"
            iconSize={24}
            iconColor={COLORS.textSecondary}
            secureTextEntry={false}
            autoCapitalize="none"
          />

          {/* Add button to trigger carrier detection */}
          {!isCustomShippingCompany && (
            <Button
              size="small"
              loading={isUpdating}
              label="Find Shipping Company"
              onPress={handleTrackingNumberChange}
              type="other"
              style={styles.findButton}
              disabled={isUpdating}
            />
          )}

          {isCustomShippingCompany && (
            <FormInput
              label="Shipping Company"
              placeholder="Enter shipping company"
              value={shippingCompany}
              onChangeText={setShippingCompany}
              iconName="boat-outline"
              iconSize={24}
              iconColor={COLORS.textSecondary}
              secureTextEntry={false}
              autoCapitalize="none"
            />
          )}

          <View style={styles.checkboxContainer}>
            <Text>International Shipping</Text>
            <Button
              size="small"
              label={isInternational ? "Yes" : "No"}
              onPress={() => setIsInternational(!isInternational)}
              type={isInternational ? "primary" : "secondary"}
              style={styles.checkboxButton}
            />
          </View>
        </>
      )}

      {status === "cancelled" && (
        <FormInput
          label="Reason for Cancellation"
          placeholder="Enter reason for cancellation"
          value={cancellationReason}
          onChangeText={setCancellationReason}
          iconName="close-circle-outline"
          iconSize={24}
          iconColor={COLORS.textSecondary}
          secureTextEntry={false}
          autoCapitalize="none"
          multiline={true}
          numberOfLines={3}
        />
      )}

      <Button
        label={isUpdating ? "Updating..." : "Update Order"}
        onPress={handleUpdateOrder}
        loading={isUpdating}
        type="secondary"
        style={styles.updateButton}
        disabled={isUpdating}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins_Semibold",
    marginBottom: 5,
  },
  dropdown: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dropdownPlaceholder: {
    color: COLORS.textSecondary,
    padding: 10,
  },
  dropdownSelectedText: {
    color: COLORS.textPrimary,
    fontFamily: "Poppins",
    padding: 10,
  },
  dropdownContainer: {
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  checkboxButton: {
    width: 80,
  },
  findButton: {
    marginVertical: 10,
  },
  updateButton: {
    marginTop: 20,
  },
});
