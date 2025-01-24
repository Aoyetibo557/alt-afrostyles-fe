import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  Text,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/styles/colors";
import { useDesigner } from "@/context/DesignerContext";
import { useAuth } from "@/context/AuthContext";
import { Link, router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { ACCOUNT_TYPES } from "@/constants/const";
import { EnhancedAvatar } from "@/components/avatar/enhancedAvatar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { updateProfilePicture } from "@/api/user";

const ORDER_ICON = require("../../../../assets/images/order.png");

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { designerProfile } = useDesigner();
  const navigation = useNavigation();

  const handleViewDesignerProfile = () => {
    router.push({
      pathname: "../../../(public)/designer/[id]",
      params: { id: designerProfile?.id },
    });
  };

  const getSections = () => {
    const sections = [];

    if (user) {
      sections.push({
        title: "Shopping",
        data: [
          {
            key: "purchased",
            icon: <Ionicons name="gift-outline" size={24} color="black" />,
            title: "Purchased",
            subtitle: "Your order history",
            onPress: () => router.push("../orders/order-history"),
            disabled: false,
          },
          {
            key: "saved",
            icon: <Ionicons name="heart-outline" size={24} color="black" />,
            title: "Saved",
            subtitle: "Keep tabs on items you love",
            onPress: () => navigation.navigate("Saved"),
            disabled: true,
          },
        ],
      });
    }

    if (user?.user_type === ACCOUNT_TYPES.DESIGNER) {
      const designerData = [
        {
          key: "store-details",
          icon: <Ionicons name="storefront-outline" size={24} color="black" />,
          title: "Store Details",
          subtitle: "Manage store name, description and status",
          onPress: handleViewDesignerProfile,
        },
        {
          key: "manage-inventory",
          icon: <Ionicons name="apps-outline" size={24} color="black" />,
          title: "Manage Inventory",
          subtitle: "Update stock count and product details",
          onPress: () => router.push("./designer/manageinventory"),
          disabled: !designerProfile && true,
        },
        {
          key: "manage-orders",
          icon: <Image source={ORDER_ICON} width={24} height={24} />,
          title: "Manage Orders",
          subtitle: "Update and track incoming orders to store",
          onPress: () => router.push("./designer/manageOrders"),
          disabled: !designerProfile && true,
        },
      ];

      //designerProfile == store details
      if (designerProfile) {
        designerData.push({
          key: "add-new-product",
          icon: <Ionicons name="bag-add-outline" size={24} color="black" />,
          title: "Add New Product",
          onPress: () => router.push("./designer/addproduct"),
        });
      }

      sections.push({
        title: "Dashboard",
        data: designerData,
      });
    }

    sections.push({
      title: "Account",
      data: [
        ...(user
          ? [
              {
                key: "help",
                icon: (
                  <Ionicons
                    name="help-circle-outline"
                    size={24}
                    color="black"
                  />
                ),
                title: "Help",
                onPress: () => navigation.navigate("Help"),
                disabled: true,
              },
            ]
          : []),
        {
          key: "settings",
          icon: <Ionicons name="settings-outline" size={24} color="black" />,
          title: "Settings",
          onPress: () => router.push("../settings-screens/settings"),
        },
        ...(!user
          ? [
              {
                key: "login",
                icon: <FontAwesome name="sign-in" size={24} color="black" />,
                title: "Login",
                onPress: () => router.push("/(public)/auth/login"),
              },
            ]
          : []),
      ],
    });

    return sections;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.nav_view, item.disabled && styles.disabled]}
      onPress={item.onPress}
      disabled={item.disabled}>
      <View style={styles.iconwrap}>{item.icon}</View>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sub_header}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BottomSheetModalProvider>
        {user && (
          <View style={styles.profileContainer}>
            <View style={styles.profile}>
              <EnhancedAvatar
                id={user.id}
                initialImageUrl={user.profile_picture}
                uploadImage={updateProfilePicture}
                origin="PROFILE_PICTURE"
                size={80}
              />
              <View style={styles.infocontainer}>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
              </View>
            </View>
          </View>
        )}
        <SectionList
          sections={getSections()}
          keyExtractor={(item, index) => item.key + index}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.container_body}
        />
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  container_body: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header_text: {
    fontSize: 24,
    display: "none",
    fontFamily: "Poppins_Semibold",
  },
  infocontainer: {
    marginTop: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: "Poppins_Semibold",
  },
  email: {
    fontSize: 15,
    fontFamily: "Poppins",
  },
  sub_header: {
    fontSize: 19,
    fontFamily: "Poppins_Semibold",
    paddingVertical: 10,
    backgroundColor: COLORS.background,
  },
  iconwrap: {
    backgroundColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  nav_view: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
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
  disabled: {
    opacity: 0.5,
  },
});
