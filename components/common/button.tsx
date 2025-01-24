import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { COLORS } from "../../styles/colors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

type ButtonType = "primary" | "secondary" | "other";

interface ButtonProps {
  label: string;
  onPress: () => void;
  type?: ButtonType;
  size?: "small" | "medium" | "large";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  type = "primary",
  size = "medium",
  style,
  textStyle,
  loading = false,
}) => {
  const getButtonStyle = (): StyleProp<ViewStyle> => {
    let baseStyle = styles.mediumButton;

    switch (size) {
      case "small":
        baseStyle = styles.smallButton;
        break;
      case "large":
        baseStyle = styles.largeButton;
        break;
    }

    switch (type) {
      case "primary":
        return [baseStyle, styles.primaryButton, style];
      case "secondary":
        return [baseStyle, styles.secondaryButton, style];
      case "other":
        return [baseStyle, styles.otherButton, style];
      default:
        return [baseStyle, style];
    }
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    let baseTextStyle = styles.mediumText;

    switch (size) {
      case "small":
        baseTextStyle = styles.smallText;
        break;
      case "large":
        baseTextStyle = styles.largeText;
        break;
    }

    switch (type) {
      case "primary":
        return [baseTextStyle, styles.primaryText, textStyle];
      case "secondary":
        return [baseTextStyle, styles.secondaryText, textStyle];
      case "other":
        return [baseTextStyle, styles.otherText, textStyle];
      default:
        return [baseTextStyle, textStyle];
    }
  };

  // Shared values for the bouncing animation
  const ball1 = useSharedValue(0);
  const ball2 = useSharedValue(0);
  const ball3 = useSharedValue(0);

  // Bouncing animation for each ball
  React.useEffect(() => {
    ball1.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    ball2.value = withDelay(
      200,
      withRepeat(
        withSequence(
          withTiming(-15, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
    ball3.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(-15, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, []);

  const ball1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: ball1.value }],
  }));

  const ball2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: ball2.value }],
  }));

  const ball3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: ball3.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      style={getButtonStyle()}
      disabled={loading}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.ball, ball1Style]} />
          <Animated.View style={[styles.ball, ball2Style]} />
          <Animated.View style={[styles.ball, ball3Style]} />
        </View>
      ) : (
        <Text style={getTextStyle()}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  mediumButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  largeButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  smallText: {
    fontSize: 14,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  mediumText: {
    fontSize: 16,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  largeText: {
    fontSize: 18,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.green,
  },
  secondaryButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  otherButton: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.green,
  },
  primaryText: {
    color: COLORS.background,
  },
  secondaryText: {
    color: COLORS.background,
  },
  otherText: {
    color: COLORS.textPrimary,
  },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  ball: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.background,
    marginHorizontal: 3,
  },
});
