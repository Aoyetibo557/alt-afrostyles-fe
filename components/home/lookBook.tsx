import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../../styles/colors";

interface LookbookItem {
  id: string;
  title: string;
  image: any;
}

const lookbookItems: LookbookItem[] = [
  {
    id: "1",
    title: "Summer Vibes",
    image: require("../../assets/images/heroImage1.png"),
  },
  {
    id: "2",
    title: "Office Chic",
    image: require("../../assets/images/colorJewelry.png"),
  },
];

export const Lookbook: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lookbook</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {lookbookItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.itemContainer}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.itemTitle}>{item.title}</Text>
          </TouchableOpacity>
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
    fontSize: 24,
    fontFamily: "Poppins",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  itemContainer: {
    marginRight: 15,
    width: 200,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: COLORS.textPrimary,
    marginTop: 5,
    textAlign: "center",
  },
});
