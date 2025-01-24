import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { COLORS } from "../../../styles/colors";
import { IProduct } from "../../../types/index";
import { CustomImage } from "../../common/image";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth > 768;

interface ProductCardProps {
  product: IProduct;
  onPress: () => void;
  onLongPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onLongPress,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const renderCarouselItem = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  const handleOnPress = () => {
    if (!onPress) {
      router.push({
        pathname: `/product/${product?.id}`,
        params: { productId: product.id },
      });
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      onLongPress={() => onLongPress(product)}>
      <Animated.View
        key={product.name}
        entering={FadeInDown.delay(product?.id * 100)}
        style={styles.card}>
        <View style={styles.imageContainer}>
          <CustomImage
            source={{ uri: product.images[0] }}
            width={isTablet ? 170 : 180}
            height={isTablet ? 170 : 180}
            style={styles.image}
            resizeMode="cover"
            borderRadius={8}
            onError={(error) => console.log("Image load error:", error)}
            placeholder={<Text>Failed to load image</Text>}
          />
          <TouchableOpacity
            style={styles.heartIconContainer}
            onPress={() => setIsSaved(!isSaved)}>
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={24}
              color={isSaved ? "red" : "white"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.priceAndSave}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>
          <Text style={styles.name}>{product.name}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 3,
  },
  imageContainer: {
    width: isTablet ? 170 : 180,
    height: isTablet ? 170 : 180,
    overflow: "hidden",
    position: "relative", // Add this
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  heartIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.3)", // Optional: adds a semi-transparent background
    borderRadius: 15,
    padding: 5,
  },

  infoContainer: {
    padding: 12,
  },
  priceAndSave: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
  },
  name: {
    fontFamily: "Poppins",
    color: COLORS.textSecondary,
    fontSize: 15,
  },
});
