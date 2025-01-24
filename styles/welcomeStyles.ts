import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const buttonStyles = StyleSheet.create({
  getStartedButton: {
    display: "flex",
    alignItems: "center",
    width: 180,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 100,
    backgroundColor: COLORS.green,
  },
  getStartedText: {
    color: COLORS.textPrimary,
    fontSize: 19,
    fontFamily: "IBM",
  },

  loginButton: {
    display: "flex",
    alignItems: "center",
    width: 300,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: COLORS.green,
  },

  signupButton: {
    display: "flex",
    alignItems: "center",
    width: 300,
    borderWidth: 2,
    borderColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins",
    textAlign: "center",
  },

  loginSubText: {
    color: COLORS.green,
    fontSize: 17,
    fontFamily: "Poppins_Semibold",
  },
  signupText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins",
  },
});

export const contentStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    // backgroundColor: "rgba(0,0,0,0.5)",
  },

  topcontent: {
    marginBottom: 15,
  },

  subtitle: {
    paddingHorizontal: 50,
    color: COLORS.background,
    fontSize: 18,
    fontFamily: "IBM",
    textAlign: "center",
  },
});
