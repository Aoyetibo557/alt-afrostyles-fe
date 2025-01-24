import { Link, Stack, router } from "expo-router";
import { StyleSheet, Image, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { COLORS } from "../styles/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <Image
          source={require("@/assets/images/404-not-found.png")}
          style={styles.image}
        />
        <ThemedText
          type="title"
          style={{
            textAlign: "center",
            fontSize: 20,
            fontFamily: "Poppins_Semibold",
          }}>
          This screen doesn't exist.
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.replace("./home-screens/home")}
          style={styles.link}>
          <ThemedText type="link" style={{ fontFamily: "Poppins" }}>
            Go to home screen!
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
