import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { categories } from "@/constants/const";

interface ProductData {
  type: string;
  categories: string[];
  details: {
    name: string;
    description: string;
    price: string;
    quantity: string;
  };
  images: { uri: string }[];
}

interface PreviewProductProps {
  productData: ProductData;
}

export const PreviewProduct: React.FC<PreviewProductProps> = ({
  productData,
}) => {
  const { width } = Dimensions.get("window");

  const getCategoryName = (value: string) => {
    const category = categories.find((category) => category.value === value);
    return category ? category.name : value;
  };

  const renderItem = ({ item }: { item: { uri: string } }) => {
    return <Image source={{ uri: item.uri }} style={styles.image} />;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Carousel
        width={width}
        height={300}
        data={productData.images}
        renderItem={renderItem}
        mode="parallax"
        pagingEnabled
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{productData.details.name}</Text>
        <Text style={styles.type}>Type: {productData.type}</Text>
        <Text style={styles.categories}>
          Categories: {productData.categories.map(getCategoryName).join(", ")}
        </Text>

        <Text style={styles.description}>
          {productData.details.description}
        </Text>
        <Text style={styles.price}>Price: {productData.details.price}</Text>
        <Text style={styles.quantity}>
          Quantity: {productData.details.quantity}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailsContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  type: {
    fontSize: 18,
    marginBottom: 5,
  },
  categories: {
    fontSize: 16,
    marginBottom: 5,
    color: "gray",
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  quantity: {
    fontSize: 16,
    color: "gray",
  },
});
