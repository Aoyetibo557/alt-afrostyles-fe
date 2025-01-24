import React from "react";
import {
  View,
  Text as RnText,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";
import { buttonStyles, contentStyles } from "@/styles/welcomeStyles";
import { containerStyles } from "@/styles/general";
import { COLORS } from "@/styles/colors";
import { Text, Button } from "../components/common";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const scale = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 375;
const isTablet = SCREEN_WIDTH > 768;

const WelcomeScreen = () => {
  return (
    <SafeAreaView style={containerStyles.container}>
      <BackgroundSlideshow />
      <View style={contentStyles.content}>
        <View style={[contentStyles.topcontent]}>
          <Text size={32} align="center" color={COLORS.green} font="Limelight">
            AfroStyles
          </Text>
          <Text
            size="lg"
            variant="body"
            align="center"
            color={COLORS.white}
            font="IBM">
            Redefining Fashion, One African Design at a Time
          </Text>
        </View>
        <Button
          onPress={() => router.replace("./(public)/auth/signup")}
          label="Get Started"
          textStyle={{ color: COLORS.textPrimary }}
          style={buttonStyles.getStartedButton}
        />
        <View style={styles.loginContainer}>
          <Text variant="body" font="IBM" color={COLORS.white} align="center">
            Already have an account?
          </Text>
          <Pressable onPress={() => router.replace("./(public)/auth/login")}>
            <Text
              variant="body"
              align="center"
              color={COLORS.green}
              font="PoppinsMedium">
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  loginContainer: {
    display: "flex",
    flexDirection: "row",
  },
});
