import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import {
  Loading,
  FormInput,
  StackScreenHeader,
  PhoneInput,
  Button,
} from "@/components/common";
import { useUpdateUserMutation } from "@/api/mutations/user";
import { COLORS } from "@/styles/colors";
import { Collapsible } from "@/components/Collapsible";
import { areaCodes } from "@/constants/const";

export default function PersonalInfo() {
  const { user, setUser } = useAuth();
  const { showAlert } = useAlert();
  const [name, setName] = useState<string>(user?.name);
  const [email, setEmail] = useState<string>(user?.email);
  const [phone, setPhone] = useState<string>(
    user?.phone?.replace(/^\+\d+\s*/, "") || ""
  );
  const [areaCode, setAreaCode] = useState<string>(
    user?.phone?.match(/^\+\d+/)?.[0] || "+1"
  );
  const [areaCodeSearch, setAreaCodeSearch] = useState<string>("");
  const scrollY = new Animated.Value(0);

  const {
    mutate: updateProfile,
    isPending,
    error,
    data: updateProfileData,
    refetch,
  } = useUpdateUserMutation();

  const handleUpdateProfile = () => {
    const updatedUser = {
      name,
      email,
      phone,
    };

    updateProfile(updatedUser, {
      onSuccess: (data) => {
        showAlert("success", "Profile Updated Sucessfully");
        setUser(data.user);
      },
    });
  };

  const filteredAreaCodes = areaCodes.filter(
    (code) =>
      code.code.includes(areaCodeSearch) ||
      code.country.toLowerCase().includes(areaCodeSearch.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView>
        <StackScreenHeader
          leftIcon={{
            name: "arrow-back",
            type: "Ionicons",
          }}
          leftIconType="Ionicons"
          leftIconStyle={styles.leftIconStyle}
          leftText=""
          onLeftPress={() => router.back()}
          scrollY={scrollY}
        />
        <View style={styles.scrollView}>
          <Text style={styles.screenTitle}>Personal Information</Text>

          <FormInput
            iconName=""
            iconSize={24}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholder="John Doe"
            style={styles.input}
            label="My name"
          />

          <FormInput
            iconName=""
            iconSize={24}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholder="johndoe@example.com"
            style={styles.input}
            label="Email"
          />
          <FormInput
            iconName=""
            iconSize={24}
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
            keyboardType="phone-pad"
            placeholder="+1 (909) 553 9980"
            style={styles.input}
            label="Phone"
          />

          {/* <PhoneInput value={phone} onChangeText={setPhone} label="Phone" /> */}
          <Button
            label="Save"
            size="medium"
            loading={isPending}
            onPress={handleUpdateProfile}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    paddingHorizontal: 15,
  },
  screenTitle: {
    fontSize: 26,
    fontFamily: "Poppins_Semibold",
    paddingBottom: 20,
  },

  leftIconStyle: {
    backgroundColor: COLORS.green,
    padding: 10,
    borderRadius: 50,
  },
  input: {
    borderWidth: 0,
    borderColor: "none",
    borderBottomColor: "red",
  },
  saveButton: {
    // width: 200,
    padding: 8,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    backgroundColor: COLORS.green,
  },

  saveButton_text: {
    fontSize: 16,
    fontFamily: "Poppins",
  },
});
