import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { COLORS } from "@/styles/colors";

interface StyleTip {
  id: string;
  title: string;
  description: string;
  image: any;
}

const styleTips: StyleTip[] = [
  {
    id: "1",
    title: "Mix Patterns Like a Pro",
    description: "Combine stripes with florals for a bold look.",
    image: require("../../assets/images/bg2.png"),
  },
  {
    id: "2",
    title: "Accessorize Wisely",
    description: "Less is more. Choose one statement piece.",
    image: require("../../assets/images/bg1.png"),
  },
  // Add more style tips...
];

export const StyleTips: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Style Tips</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {styleTips.map((tip) => (
          <View key={tip.id} style={styles.tipContainer}>
            {/* <Image source={tip.image} style={styles.image} /> */}
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDescription}>{tip.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  tipContainer: {
    width: 300,
    marginRight: 15,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: COLORS.textPrimary,
    marginTop: 5,
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: COLORS.textSecondary,
  },
});
