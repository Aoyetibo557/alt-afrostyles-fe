import React from "react";
import {
  Text as RNText,
  TextProps,
  Platform,
  PixelRatio,
  Dimensions,
  TextStyle,
} from "react-native";

interface CustomTextProps extends TextProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | number;
  weight?: "normal" | "medium" | "semibold" | "bold";
  variant?: "body" | "heading" | "subheading" | "caption";
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
  font?: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Function to check if the device is a tablet
const isTablet = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;
  return (
    Math.sqrt(Math.pow(adjustedWidth, 2) + Math.pow(adjustedHeight, 2)) /
      pixelDensity >=
    1000
  );
};

// Use iPhone 8 as the base size (375x667)
const baseWidth = 375;
const baseHeight = 667;

const scale = SCREEN_WIDTH / baseWidth;
const verticalScale = SCREEN_HEIGHT / baseHeight;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale - 1) * factor * size;

const normalize = (size: number): number => {
  if (isTablet()) {
    // For tablets, don't scale the font size
    return size;
  }
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    // for Android, slightly reduce the size to look better
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 3;
  }
};

const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
};

const fontWeights: { [key: string]: TextStyle["fontWeight"] } = {
  normal: "normal",
  medium: "500",
  semibold: "600",
  bold: "bold",
};

export const Text: React.FC<CustomTextProps> = ({
  children,
  size = "md",
  weight = "normal",
  variant = "body",
  color,
  align,
  font,
  style,
  ...props
}) => {
  const getFontSize = () => {
    if (typeof size === "number") {
      return normalize(size);
    }
    return normalize(fontSizes[size] || fontSizes.lg);
  };

  const getFontWeight = (): TextStyle["fontWeight"] => {
    return fontWeights[weight] || "normal";
  };

  const getFontFamily = () => {
    return font || (Platform.OS === "ios" ? "Poppins" : "Poppins");
  };

  const getVariantStyles = (): TextStyle => {
    switch (variant) {
      case "heading":
        return {
          fontSize: normalize(24),
          fontWeight: "bold",
          marginBottom: moderateScale(8),
        };
      case "subheading":
        return {
          fontSize: normalize(18),
          fontWeight: "600",
          marginBottom: moderateScale(6),
        };
      case "caption":
        return { fontSize: normalize(12), color: "#666" };
      default:
        return {};
    }
  };

  return (
    <RNText
      style={[
        {
          fontSize: getFontSize(),
          fontWeight: getFontWeight(),
          fontFamily: getFontFamily(),
          color: color,
          textAlign: align,
        },
        getVariantStyles(),
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};
