import {
  StyleSheet,
  View,
  Switch,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { containerStyles } from "@/styles/general";
import { formstyles } from "../../styles/formStyles";
import { FormInput, Button } from "../common";
import { Link, router } from "expo-router";
import { isValidEmail } from "@/utils/validationUtils";
import { useAuth } from "@/context/AuthContext";

const LogoImage = require("@/assets/images/logo-bgcolor.png");

const LoginForm = () => {
  const {
    user,
    login,
    isAuthPending,
    error: loginError,
    data: loginResponse,
  } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [click, setClick] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [authErr, setAuthErr] = useState<string>(loginError);

  const handleNav = () => {
    router.replace("/profile_screens/auth/signup");
  };

  const validateForm = () => {
    let isValid = true;
    if (!isValidEmail(email)) {
      setEmailError("Invalid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const handleLogin = () => {
    setAuthErr("");
    try {
      if (validateForm()) {
        login({
          email,
          password,
        });
      }
    } catch (error) {
      setAuthErr(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}>
        <View style={[containerStyles.container, formstyles.container]}>
          <Image style={formstyles.logo_image} source={LogoImage} />
          <View>
            <Text style={formstyles.CTAtext}>
              Please enter your e-mail address and password to login
            </Text>
          </View>
          <View style={formstyles.input_container}>
            <FormInput
              iconName="mail"
              iconSize={24}
              placeholder="johndoe@gmail.com"
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
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              label="Password"
              style={formstyles.custom_input}
              error={passwordError}
              clearable={false}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <View style={formstyles.switch_container}>
              <Switch
                value={click}
                onValueChange={setClick}
                trackColor={{ true: "green", false: "gray" }}
              />
              <Text style={formstyles.remember_me}>Remember me?</Text>
            </View>

            <View>
              <Link href="/forgotpassword" asChild>
                <Pressable>
                  <Text style={formstyles.forgot_password_text}>
                    Forgot password?
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>

          <View style={formstyles.btns_container}>
            <Button
              label="Login"
              onPress={handleLogin}
              type="primary"
              size="medium"
              loading={isAuthPending}
              style={[formstyles.button]}
            />
            <View>
              <Text style={formstyles.signup_text}>
                Don't have an account?{" "}
                <Pressable onPress={handleNav} asChild>
                  <Text style={formstyles.signup_inner_text}>Sign Up</Text>
                </Pressable>
              </Text>
            </View>
          </View>

          {!user && (
            <View>
              <TouchableOpacity
                onPress={() => router.replace("/home-screens/home")}>
                <Text
                  style={[
                    formstyles.signup_text,
                    formstyles.signup_inner_text,
                  ]}>
                  browse as guest >
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginForm;
