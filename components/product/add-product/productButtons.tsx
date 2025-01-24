import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { COLORS } from "@/styles/colors";

export const ProductActionButtons = ({ onSaveDraft, onPublish }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        // marginBottom: 50,
        gap: 10,
      }}>
      <TouchableOpacity
        onPress={onSaveDraft}
        style={[styles.button, styles.draftBtn]}>
        <Text style={[styles.btnText]}>Save as Draft</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPublish}
        style={[styles.button, styles.publishBtn]}>
        <Text style={[styles.btnText]}>Publish</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 150,
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
  },
  btnText: {
    fontFamily: "Poppins",
    fontSize: 16,
  },
  publishBtn: {
    backgroundColor: COLORS.green,
  },
  draftBtn: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
});
