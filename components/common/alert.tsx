import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../styles/colors";

type AlertType = "info" | "warning" | "error" | "success" | "loading" | "other";

interface AlertProps {
  type: AlertType;
  message: string;
}

const { width } = Dimensions.get("window");
const ALERT_WIDTH = width * 0.9; // 90% of screen width

export const CustomAlert: React.FC<AlertProps> = ({ type, message }) => {
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000), // Stay visible for 3 seconds
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getAlertStyle = () => {
    switch (type) {
      case "info":
        return styles.info;
      case "warning":
        return styles.warning;
      case "error":
        return styles.error;
      case "success":
        return styles.success;
      case "loading":
        return styles.loading;
      default:
        return styles.other;
    }
  };

  const getIconName = () => {
    switch (type) {
      case "info":
        return "information-circle";
      case "warning":
        return "warning";
      case "error":
        return "alert-circle";
      case "success":
        return "checkmark-circle";
      case "loading":
        return "reload";
      default:
        return "help-circle";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "info":
        return COLORS.secondary;
      case "warning":
        return "#f39c12";
      case "error":
        return "red";
      case "success":
        return COLORS.green;
      case "loading":
        return COLORS.primary;
      default:
        return "COLORS.green";
    }
  };

  return (
    <View style={styles.centerContainer}>
      <Animated.View
        style={[
          styles.container,
          getAlertStyle(),
          { transform: [{ translateY }] },
        ]}>
        <View style={styles.content}>
          <Ionicons
            name={getIconName()}
            size={24}
            color={getIconColor()}
            style={styles.icon}
          />
          <Text style={styles.message}>{message}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    position: "absolute",
    bottom: 20, // 20 units from the bottom
    left: 0,
    right: 0,
    alignItems: "center",
  },
  container: {
    width: ALERT_WIDTH,
    padding: 15,
    borderRadius: 8, // Rounded corners
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "flex-start",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 8,
  },
  message: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: "Poppins",
    flex: 1,
  },
  info: {
    backgroundColor: COLORS.background,
  },
  warning: {
    backgroundColor: "#f39c12",
  },
  error: {
    backgroundColor: COLORS.background,
  },
  success: {
    // backgroundColor: "#2ecc71",
    backgroundColor: COLORS.background,
  },
  loading: {
    backgroundColor: "#9b59b6",
  },
  other: {
    backgroundColor: "#95a5a6",
  },
});
