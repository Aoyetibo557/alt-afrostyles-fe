import React from "react";
import { StyleSheet, View, ViewStyle, ImageStyle } from "react-native";
import { Image } from "expo-image";

interface AvatarProps {
  source: string | { uri: string };
  size?: number;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  borderRadius?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 50,
  style,
  imageStyle,
  borderRadius,
}) => {
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: borderRadius ?? size / 2,
    overflow: "hidden",
    ...style,
  };

  const imageStyles: ImageStyle = {
    width: "100%",
    height: "100%",
    ...imageStyle,
  };

  return (
    <View style={containerStyle}>
      <Image
        source={typeof source === "string" ? { uri: source } : source}
        style={imageStyles}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // You can add additional styles here if needed
});
