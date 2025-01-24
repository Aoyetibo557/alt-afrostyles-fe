import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../styles/colors";

export const Widget = ({ title, value, icon, onPress }) => (
  <TouchableOpacity style={styles.widget} onPress={onPress}>
    <View style={styles.widgetContent}>
      <Text style={styles.widgetTitle}>{title}</Text>
      <Text style={styles.widgetValue}>{value}</Text>
    </View>
    <Ionicons name={icon} size={24} color={COLORS.primary} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  widget: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 15,
  },
  widgetContent: {
    flex: 1,
  },
  widgetTitle: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    marginBottom: 5,
  },
  widgetValue: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: COLORS.gray,
  },
});
