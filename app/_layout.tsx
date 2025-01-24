import React, { useEffect, useState, useCallback } from "react";
import { useFonts } from "expo-font";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import { Image, LogBox, View } from "react-native";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AlertProvider } from "../context/AlertContext";
import { CartProvider } from "../context/CartContext";
import { DesignerProvider } from "../context/DesignerContext";
import ErrorBoundary from "./ErrorBoundary";

// Import your background images
import backgroundOne from "@/assets/images/bg1.png";
import backgroundTwo from "@/assets/images/bg2.png";
import backgroundThree from "@/assets/images/bg3.png";

// Ignore specific warnings
LogBox.ignoreLogs(["Warning: ..."]); // Add specific warnings to ignore

export const unstable_settings = {
  initialRouteName: "welcome",
};

SplashScreen.preventAutoHideAsync();

const fonts = {
  IBM: require("@/assets/fonts/IBM/IBMPlexSans-Regular.ttf"),
  IBM_Medium: require("@/assets/fonts/IBM/IBMPlexSans-Medium.ttf"),
  IBM_Bold: require("@/assets/fonts/IBM/IBMPlexSans-Bold.ttf"),
  Poppins: require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
  PoppinsMedium: require("@/assets/fonts/Poppins/Poppins-Medium.ttf"),
  Poppins_Semibold: require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
  PoppinsBold: require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
  Roboto: require("@/assets/fonts/Roboto/RobotoFlex-Regular.ttf"),
  Limelight: require("@/assets/fonts/Limelight/Limelight-Regular.ttf"),
};

const backgroundImages = [backgroundOne, backgroundTwo, backgroundThree];

const cacheImages = (images: (string | number)[]) => {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

function RootLayoutNav() {
  const { user, isPending } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      setIsFirstLaunch(hasLaunched === null);
      if (hasLaunched === null) {
        await AsyncStorage.setItem("hasLaunched", "true");
      }
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (isFirstLaunch === null) return;

    if (isFirstLaunch) {
      router.replace("/welcome");
    } else {
      router.replace("home-screens/home");
    }
  }, [isFirstLaunch]);

  return (
    <Stack>
      {/* For all the routes that do not need auth or bottom tab nav */}
      <Stack.Screen
        name="welcome"
        options={{ title: "Welcome", headerShown: false }}
      />
      <Stack.Screen
        name="(public)"
        options={{ title: "Public", headerShown: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ title: "Tabs", headerShown: false }}
      />
      <Stack.Screen name="(modal)/modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
function AppLayoutNav() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <AlertProvider>
            <AuthProvider>
              <DesignerProvider>
                <CartProvider>
                  <RootLayoutNav />
                </CartProvider>
              </DesignerProvider>
            </AuthProvider>
          </AlertProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = useFonts(fonts);

  const prepare = useCallback(async () => {
    try {
      await Promise.all([
        ...cacheImages(backgroundImages),
        // Add any other assets or API calls here
      ]);
    } catch (e) {
      console.warn("Error loading assets:", e);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    prepare();
  }, [prepare]);

  useEffect(() => {
    if (isReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isReady, fontsLoaded]);

  if (!isReady || !fontsLoaded) {
    return null; // This will show the splash screen
  }

  return <AppLayoutNav />;
}

// export { ErrorBoundary };
