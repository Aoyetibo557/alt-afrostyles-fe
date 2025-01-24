import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { COLORS } from "../../styles/colors";

export const DraftCard = ({ item, onPress }) => {
  const totalFields = Object.keys(item).length;
  const completedFields = Object.values(item).filter(
    (value) => value !== null && value !== ""
  ).length;
  const progress = (completedFields / totalFields) * 100;

  return (
    <Pressable style={styles.draftCard} onPress={onPress}>
      <Text style={styles.draftTitle}>{item.name}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{progress.toFixed()}% complete</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  draftCard: {
    width: 180,
    backgroundColor: COLORS.green,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  draftTitle: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    marginBottom: 10,
  },
  progressBar: {
    height: 5,
    backgroundColor: COLORS.gray,
    borderRadius: 5,
    marginBottom: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "Poppins",
    color: COLORS.gray,
  },
});
