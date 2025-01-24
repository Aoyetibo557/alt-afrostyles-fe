import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: COLORS.background,
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.background,
    // justifyContent: "center",
  },
});
