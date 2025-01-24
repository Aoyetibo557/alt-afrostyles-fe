// components/common/CustomModal.tsx

import React from "react";
import {
  Modal as ExpoModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { COLORS } from "@/styles/colors";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  primaryButtonText: string;
  onPrimaryButtonPress: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
  isPrimaryDestructive?: boolean;
  isPrimaryLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  title,
  message,
  primaryButtonText,
  onPrimaryButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
  isPrimaryDestructive = false,
  isPrimaryLoading = false,
}) => {
  return (
    <ExpoModal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.modalButtons}>
            {secondaryButtonText && (
              <TouchableOpacity
                onPress={onSecondaryButtonPress || onClose}
                style={styles.modalButton}>
                <Text style={styles.buttonText}>{secondaryButtonText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onPrimaryButtonPress}
              style={[
                styles.modalButton,
                isPrimaryDestructive && styles.destructiveButton,
              ]}
              disabled={isPrimaryLoading}>
              <Text
                style={[
                  styles.buttonText,
                  isPrimaryDestructive && styles.destructiveButtonText,
                ]}>
                {isPrimaryLoading ? "Loading..." : primaryButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ExpoModal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins_Semibold",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 15,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 15,
    marginTop: 20,
  },
  modalButton: {
    width: 110,
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.green,
  },
  destructiveButton: {
    backgroundColor: COLORS.green,
    borderWidth: 0,
  },
  buttonText: {
    fontFamily: "Poppins",
    color: COLORS.green,
  },
  destructiveButtonText: {
    color: "white",
  },
});
