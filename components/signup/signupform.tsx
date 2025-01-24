import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";
import { Divider } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState, useEffect } from "react";
import { containerStyles } from "@/styles/general";
import { formstyles } from "../../styles/formStyles";
import { FormInput, Button } from "../common";
import { router } from "expo-router";
import SegmentedControl from "../SegmentedControl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  isValidEmail,
  isValidPassword,
  getPasswordValidationErrors,
} from "@/utils/validationUtils";
import { useAuth } from "@/context/AuthContext";

type UserType = "shopper" | "designer";

const SignupForm = () => {
  const {
    signup,
    data: signupResponse,
    isPending,
    error: signUpError,
  } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("shopper");
  const [authErr, setAuthErr] = useState<string>(signUpError);
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [termsError, setTermsError] = useState<string>("");

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!isValidEmail(email)) {
      setEmailError("Invalid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!isValidPassword(password)) {
      const errors = getPasswordValidationErrors(password);
      setPasswordError(errors.join(", "));
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!termsAccepted) {
      setTermsError("You must accept the terms and conditions");
      isValid = false;
    } else {
      setTermsError("");
    }

    return isValid;
  };

  const handleUserTypeChange = (index: number) => {
    setUserType(index === 0 ? "shopper" : "designer");
  };

  const handleSignUp = async () => {
    setAuthErr("");
    if (validateForm()) {
      await AsyncStorage.setItem("termsAccepted", "true");
      signup({
        name,
        email,
        password,
        userType,
      });
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={[containerStyles.container, formstyles.container]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Create your free account today</Text>
          <Text style={styles.subHeaderText}>
            Join us and start exploring the best fashion african designers have
            to offer.
          </Text>
        </View>

        <View style={formstyles.input_container}>
          <FormInput
            iconName="person"
            iconSize={24}
            placeholder="John Smith"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            label="Name"
            style={formstyles.custom_input}
            error={nameError}
          />

          <FormInput
            iconName="mail"
            iconSize={24}
            placeholder="jsmith@gmail.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            label="Email"
            style={formstyles.custom_input}
            error={emailError}
          />

          <FormInput
            iconName="lock-closed"
            iconSize={24}
            placeholder="Min. 8 Characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            label="Password"
            style={formstyles.custom_input}
            error={passwordError}
          />

          <FormInput
            iconName="lock-closed"
            iconSize={24}
            placeholder="************"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            label="Confirm Password"
            style={formstyles.custom_input}
            error={confirmPasswordError}
          />

          <View style={styles.userTypeContainer}>
            <Text style={styles.userTypeLabel}>I am a </Text>
            <SegmentedControl
              values={["Shopper", "Designer"]}
              selectedIndex={userType === "shopper" ? 0 : 1}
              onChange={handleUserTypeChange}
            />
          </View>
        </View>

        <View style={formstyles.btns_container}>
          {isPending ? (
            <View style={[formstyles.loadingBtn]}>
              <Text style={[formstyles.loginText]}>Loading...</Text>
            </View>
          ) : (
            <Button
              label="Sign Up"
              size="medium"
              type="primary"
              onPress={handleSignUp}
              style={[formstyles.button]}
            />
          )}

          <TouchableOpacity
            onPress={() => router.replace("/profile_screens/auth/login")}>
            <Text style={formstyles.signup_text}>
              Have an account already?{" "}
              <Text style={formstyles.signup_inner_text}>Log in</Text>
            </Text>
          </TouchableOpacity>
          <Divider />
          {/* <TouchableOpacity
            onPress={() => router.replace("/home-screens/home")}>
            <Text
              style={[formstyles.signup_text, formstyles.signup_inner_text]}>
              register later
            </Text>
          </TouchableOpacity> */}

          <View style={styles.socialSignupContainer}>
            <Text style={styles.socialSignupText}>or sign up with</Text>
            {/* Future implementation for social sign-ups */}
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "PoppinsBold",
    textAlign: "center",
    color: "#333",
  },
  subHeaderText: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "PoppinsMedium",
    color: "#666",
    marginTop: 5,
    paddingHorizontal: 10,
  },

  userTypeContainer: {
    marginTop: 10,
  },
  userTypeLabel: {
    fontSize: 16,
    fontFamily: "Poppins",
    marginBottom: 8,
  },
  socialSignupContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  socialSignupText: {
    fontSize: 16,
    color: "#666",
  },
  socialButton: {
    marginTop: 10,
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SignupForm;
