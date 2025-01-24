import React, { useState, useEffect, ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ViewStyle,
  Pressable,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

type IconType = "Ionicons" | "FontAwesome";

type IconProps = {
  name: string;
  type: IconType;
  size?: number;
  color?: string;
  style?: string;
  onPress?: () => void;
  badgeCount?: number;
};

type HeaderProps = {
  title?: string;
  leftIcon?: IconProps;
  leftText?: string;
  rightIcon?: IconProps;
  rightText?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  scrollY?: Animated.Value;
  backgroundStyle?: ViewStyle;
  children?: ReactNode;
};

const Icon: React.FC<IconProps> = ({
  name,
  type,
  size = 24,
  color = "black",
  style,
  onPress,
  badgeCount,
}) => {
  const IconComponent = type === "Ionicons" ? Ionicons : FontAwesome;

  return (
    <Pressable onPress={onPress} style={[styles.iconContainer, style]}>
      <IconComponent name={name} size={size} color={color} />
      {badgeCount !== undefined && badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
    </Pressable>
  );
};

export const StackScreenHeader: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  leftText,
  rightIcon,
  rightText,
  onLeftPress,
  onRightPress,
  scrollY,
  backgroundStyle,
  children,
}) => {
  const [titleOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const headerOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: "clamp",
      })
    : 1;

  return (
    <Animated.View style={[styles.headerContainer, backgroundStyle]}>
      <View style={styles.leftContainer}>
        {leftIcon && <Icon {...leftIcon} onPress={onLeftPress} />}
        {leftText && (
          <Pressable onPress={onLeftPress}>
            <Text style={styles.sideText}>{leftText}</Text>
          </Pressable>
        )}
      </View>
      {title && (
        <Animated.Text style={[styles.title, { opacity: headerOpacity }]}>
          {title}
        </Animated.Text>
      )}
      <View style={styles.rightContainer}>
        {rightText && (
          <Pressable onPress={onRightPress}>
            <Text style={styles.sideText}>{rightText}</Text>
          </Pressable>
        )}
        {rightIcon && <Icon {...rightIcon} onPress={onRightPress} />}
      </View>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 60,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_Semibold",
    color: "#000",
  },
  sideText: {
    fontSize: 16,
    marginHorizontal: 8,
    color: "#000",
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -6,
    backgroundColor: "red",
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
