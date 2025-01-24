import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Text } from "../common";
import { COLORS } from "@/styles/colors";

// Import images
const PENDING_IMAGE = require("../../assets/images/pendingIcon.png");
const PROCESSING_IMAGE = require("../../assets/images/processingIcon.png");
const FULFILLED_IMAGE = require("../../assets/images/fulfilledIcon.png");
const SHIPPED_IMAGE = require("../../assets/images/shippedIcon.png");
const DELIVERED_IMAGE = require("../../assets/images/deliveredIcon.png");

export const OrderStatusStepper = ({
  currentStatus,
}: {
  currentStatus: string;
}) => {
  // Define the order statuses in sequence
  const statuses = [
    "pending",
    "processing",
    "fulfilled",
    "shipped",
    "delivered",
  ];

  // Map statuses to images
  const statusImages = {
    pending: PENDING_IMAGE,
    processing: PROCESSING_IMAGE,
    fulfilled: FULFILLED_IMAGE,
    shipped: SHIPPED_IMAGE,
    delivered: DELIVERED_IMAGE,
  };

  // Determine the index of the current status
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <View style={styles.stepperContainer}>
      {statuses.map((status, index) => (
        <React.Fragment key={status}>
          <View style={styles.stepperItem}>
            {/* Display the correct image for each status */}
            <View
              style={[
                styles.imagePlaceholder,
                currentIndex >= index && styles.activeImagePlaceholder, // Highlight active step
              ]}>
              <Image
                source={statusImages[status]}
                style={
                  currentIndex >= index
                    ? styles.activeImageStyle
                    : styles.imageStyle
                }
                height={50}
                width={50}
              />
            </View>
            {/* Display status name */}
            <Text
              variant="caption"
              style={
                currentIndex >= index ? styles.activeText : styles.inactiveText
              }>
              {status}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  stepperItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  activeImagePlaceholder: {
    backgroundColor: COLORS.green,
  },
  imageStyle: {
    width: 45,
    height: 45,
  },
  activeImageStyle: {
    color: COLORS.green,
    width: 45,
    height: 45,
  },
  activeText: {
    opacity: 1,
    color: COLORS.textPrimary,
    fontFamily: "PoppinsMedium",
    marginTop: 5,
  },
  inactiveText: {
    color: COLORS.textSecondary,
    marginTop: 5,
  },
});
