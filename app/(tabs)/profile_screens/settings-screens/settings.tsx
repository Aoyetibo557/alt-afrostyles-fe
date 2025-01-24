import {
  StyleSheet,
  View,
  Animated,
  SectionList,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { StackScreenHeader } from "@/components/common/stackheader";
import { useAuth } from "@/context/AuthContext";
import { Link, router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Divider } from "@/components/common/divider";
import { COLORS } from "@/styles/colors";
import { ACCOUNT_TYPES } from "@/constants/const";

const Settings = () => {
  const { user, logout } = useAuth();
  const scrollY = new Animated.Value(0);

  const sections = [
    {
      title: "Account settings",
      data: [
        {
          key: "personalinfo",
          title: "Personal Information",
          onPress: () => router.push("./personalinfo"),
          showIcon: true,
          visible: user,
        },
        {
          key: "security",
          title: "Sign in and security",
          onPress: () => router.push("../../../(public)/auth/login"),
          showIcon: true,
          visible: true,
        },
        {
          key: "shipping-address",
          title: "Shipping Address",
          // subtitle: //shipping Address,
          onPress: () => router.push("./shipping-address"),
          showIcon: true,
          visible: user,
        },
        {
          key: "subscription",
          title: "Manage Subscription",
          onPress: () => router.push("./privacy"),
          showIcon: true,
          visible: user?.user_type === ACCOUNT_TYPES.DESIGNER,
        },

        {
          key: "prefrences",
          title: "Notification Preferences",
          subtitle: "Emails, recommendations, new releases",
          onPress: () =>
            router.push("/(public)/settings/notificationprefrences"),
          showIcon: true,
          visible: user,
        },
      ],
    },
    {
      title: "About",
      data: [
        {
          key: "user-agreement",
          title: "User Agreement",
          onPress: () => router.push("/"),
          showIcon: true,
          visible: true,
        },
        {
          key: "privacy",
          title: "Privacy",
          onPress: () => router.push("./privacy"),
          showIcon: true,
          visible: true,
        },
        {
          key: "legal",
          title: "Legal",
          onPress: () => router.push("/"),
          showIcon: true,
          visible: true,
        },
        {
          key: "version",
          title: "Version",
          subtitle: "1.0.1",
          showIcon: false,
          visible: true,
        },
        {
          key: "signout",
          title: "Sign Out",
          onPress: logout,
          showIcon: false,
          visible: user,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        title="Settings"
        leftIcon={{
          name: "arrow-back",
          type: "Ionicons",
        }}
        leftIconType="Ionicons"
        leftText=""
        onLeftPress={() => router.back()}
        scrollY={scrollY}
      />
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.key + index}
        renderItem={({ item }) =>
          item.visible && (
            <TouchableOpacity style={styles.nav_view} onPress={item.onPress}>
              <View>
                <Text style={styles.title}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                )}
              </View>
              {item.showIcon && (
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="black"
                />
              )}
            </TouchableOpacity>
          )
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sub_header}>{title}</Text>
        )}
        contentContainerStyle={styles.container_body}
      />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container_body: {
    paddingBottom: 20,
  },
  header_text: {
    fontSize: 32,
    fontFamily: "Poppins_Semibold",
    backgroundColor: COLORS.background,
  },
  sub_header: {
    fontSize: 19,
    fontFamily: "Poppins_Semibold",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
  },
  nav_view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 1.8,
    backgroundColor: "white",
  },
  title: {
    fontSize: 15,
    fontFamily: "Poppins",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins",
    opacity: 0.6,
  },
});
