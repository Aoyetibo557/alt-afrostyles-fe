import {
  StyleSheet,
  Text,
  Image,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Button,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import React, { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { FormInput } from "../common/forminput";
import { COLORS } from "../../styles/colors";
import { useCreateStoreMutation } from "@/api/mutations/designer";
import { useAlert } from "../../context/AlertContext";
import { MESSAGE_TYPES } from "../../constants/const";

const OnbardingImage = require("../../assets/images/onboarding.png");
const ConstructionImage = require("../../assets/images/construction.png");

const FormView = () => {
  const [storeName, setStoreName] = useState<string>("");
  const [storeDescription, setStoreDescription] = useState<string>("");
  const { showAlert } = useAlert();

  const {
    mutate: createStore,
    isPending: isLoading,
    error,
    data,
  } = useCreateStoreMutation();

  const handleCreateStore = () => {
    createStore({ storeName, storeDescription });
    if (data.messageType === MESSAGE_TYPES.SUCCESS) {
      router.replace("/home");
    }
    if (error) {
      showAlert("error", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.body}>
        <Image
          style={styles.constructImage}
          source={ConstructionImage}
          priority="high"
          cachePolicy="memory-disk"
        />

        <View style={styles.captioncontainer}>
          <Text style={styles.caption}>Brand Identity</Text>
          <Text style={styles.subcaption}>
            Enter your unique brand name to attract your target audience.
          </Text>

          <Text style={styles.store_examples}>
            "Daniel fashion house", "Kemis boutique", "9ja streetz"{" "}
          </Text>
        </View>

        <View style={styles.formcontainer}>
          <FormInput
            iconName="storefront-outline"
            iconSize={24}
            placeholder="Shade's Boutique"
            value={storeName}
            onChangeText={setStoreName}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleCreateStore}
          dsabled={isLoading}>
          <Text style={styles.btn_text}>
            {isLoading ? "Creating Store..." : "Finish setup"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export const StoreSetupComp = () => {
  const [goToNext, setgoToNext] = useState<boolean>(false);
  const [showSkip, setShowSkip] = useState<boolean>(false);

  const opacity = useSharedValue(0);

  const config = {
    duration: 700,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, config),
    };
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSkip(true);
      opacity.value = 1;
    }, 6000);
    return () => {
      clearTimeout(timeout);
    };
  }, [opacity]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {showSkip && (
          <Animated.View style={[styles.skipcontainer, animatedStyle]}>
            <TouchableOpacity
              style={styles.skipbtn}
              onPress={() => router.replace("home")}>
              <Text style={styles.skipbtn_text}>skip</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        {!goToNext ? (
          <View style={styles.body}>
            <Image style={styles.onboardingImage} source={OnbardingImage} />
            <View style={styles.captioncontainer}>
              <Text style={styles.caption}>Launch Your Shop</Text>
              <Text style={styles.subcaption}>
                Take the first steps and register unique store name to fit your
                brand’s identity.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => setgoToNext(true)}>
                <Text style={styles.btn_text}>Start Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FormView />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 30,
  },
  body: {
    alignItems: "center",
  },
  onboardingImage: {
    width: "90%",
    height: "70%",
    objectFit: "contain",
  },
  constructImage: {
    width: "100%",
    height: "50%",
    objectFit: "contain",
  },
  captioncontainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  caption: {
    fontSize: 32,
    fontFamily: "IBM_Bold",
  },
  subcaption: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins",
    marginTop: 15,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  btn: {
    width: 250,
    display: "flex",
    alignItems: "center",
    marginTop: 25,
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 30,
  },
  btn_text: {
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: 600,
    color: COLORS.background,
  },
  skipcontainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  skipbtn: {
    marginTop: 25,
    fontSize: 16,
    padding: 10,
    width: 100,
    borderRadius: 50,
    fontFamily: "Poppins",
    backgroundColor: COLORS.green,
  },
  skipbtn_text: {
    textAlign: "center",
    fontSize: 15,
    color: COLORS.textPrimarym,
  },
  formcontainer: {
    marginTop: 15,
  },
  store_examples: {
    marginTop: 10,
    fontFamily: "IBM",
    fontSize: 15,
    textAlign: "center",
  },
  input: {
    width: 350,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: COLORS.primary,
  },
});
