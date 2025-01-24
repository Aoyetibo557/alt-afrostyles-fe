import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { COLORS } from "@/styles/colors";

export enum ErrorType {
  NETWORK = "NETWORK",
  NOT_FOUND = "NOT_FOUND",
  SERVER = "SERVER",
  UNKNOWN = "UNKNOWN",
}

interface ErrorProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
  retryCount?: number;
}

export const Error: React.FC<ErrorProps> = ({
  type,
  message,
  onRetry,
  retryCount = 0,
}) => {
  const router = useRouter();

  const getErrorMessage = () => {
    switch (type) {
      case ErrorType.NETWORK:
        return (
          message ||
          "Encountered a network error. Please check your connection and try again."
        );
      case ErrorType.NOT_FOUND:
        return message || "The requested resource was not found.";
      case ErrorType.SERVER:
        return (
          message || "Oops! Something went wrong on our end. Try again later"
        );
      case ErrorType.UNKNOWN:
        return "Oops! Something happend on the server";
      default:
        return message || "An unexpected error occurred.";
    }
  };

  const getErrorImage = () => {
    switch (type) {
      case ErrorType.NETWORK:
        return require("@/assets/images/network-error.png");
      case ErrorType.NOT_FOUND:
        return require("@/assets/images/404-not-found.png");
      case ErrorType.SERVER:
        return require("@/assets/images/server-error.png");
      case ErrorType.UNKNOWN:
      default:
        return require("@/assets/images/network-error.png");
    }
  };

  const handleRetry = () => {
    if (retryCount < 3 && onRetry) {
      onRetry();
    } else {
      router.back();
    }
  };

  const handleAction = () => {
    if (type === ErrorType.NETWORK) {
      // Open device settings for network
      // might need to use a library like react-native-open-settings for this
      console.log("Open network settings");
    } else {
      handleRetry();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={getErrorImage()} style={styles.image} />
      <Text style={styles.errorText}>{getErrorMessage()}</Text>
      {onRetry ||
        (type === ErrorType.NETWORK && (
          <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
            <Text style={styles.actionButtonText}>
              {type === ErrorType.NETWORK ? "Check Settings" : "Try Again"}
            </Text>
          </TouchableOpacity>
        ))}

      {retryCount > 0 && retryCount < 3 && onRetry && (
        <Text style={styles.retryCount}>Retry attempts: {retryCount}/3</Text>
      )}
      {retryCount >= 3 && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 15,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    opacity: 0.8,
  },
  errorText: {
    width: "70%",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins",
    color: COLORS.textPrimary,
  },
  actionButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  actionButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontFamily: "PoppinsMedium",
  },
  backButton: {
    marginTop: 10,
    backgroundColor: COLORS.gray,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsMedium",
  },
  retryCount: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textLight,
    fontFamily: "Poppins",
  },
});
