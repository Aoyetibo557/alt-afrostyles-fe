import { StyleSheet } from "react-native";
import { COLORS } from "@styles/colors";

export const formstyles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
  },

  logo_image: {
    width: "100%",
    height: "25%",
    contentFit: "contain",
  },

  input_text: {
    lineHeight: 24,
    fontWeight: "normal",
    fontFamily: "Poppins",
  },

  input_container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },

  btns_container: {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
  },

  forgot_password_text: {
    color: COLORS.primary,
    textDecorationLine: "underline",
    fontSize: 15,
    fontFamily: "Poppins",
    marginBottom: 10,
  },

  signup_text: {
    fontSize: 15,
    fontFamily: "Poppins",
    marginTop: 11,
  },

  signup_inner_text: {
    opacity: 1,
    color: COLORS.secondary,
    textDecorationLine: "underline",
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "PoppinsMedium",
    marginTop: 15,
  },

  CTAtext: {
    textAlign: "center",
    opacity: 0.5,
    fontFamily: "Poppins",
    fontSize: 17,
    marginBottom: 15,
  },

  authErrorText: {
    textAlign: "center",
    opacity: 0.5,
    fontFamily: "Poppins",
    fontSize: 15,
    marginBottom: 4,
    color: "red",
  },

  button: {
    width: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },

  loginText: {
    color: COLORS.background,
    fontFamily: "IBM",
    fontSize: 18,
  },

  custom_input: {
    backgroundColor: COLORS.background,
  },

  switch_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  remember_me: {
    fontFamily: "Poppins",
    fontSize: 15,
  },

  loadingBtn: {
    width: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 6,
    marginVertical: 10,
  },
});
