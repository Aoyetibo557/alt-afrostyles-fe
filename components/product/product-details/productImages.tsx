import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { CustomImage } from "../../common";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth > 768;

interface ProductImagesProps {
  images: string[];
}

export const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const carouselRef = useRef(null); // Reference to the carousel
  const router = useRouter();

  const handleThumbnailPress = (index: number) => {
    setSelectedImageIndex(index);
    if (carouselRef.current) {
      // Scroll to the selected index
      carouselRef.current.scrollTo({ index, animated: true });
    }
  };

  const handleImagePress = () => {
    router.push({
      pathname: "/product/productimagesview",
      params: {
        images: JSON.stringify(images),
        initialIndex: selectedImageIndex,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleImagePress}>
        <Carousel
          ref={carouselRef}
          loop
          width={screenWidth}
          height={isTablet ? screenWidth : screenWidth + 150}
          data={images}
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => setSelectedImageIndex(index)}
          index={selectedImageIndex}
          renderItem={({ item, index }) => (
            <CustomImage
              height={"100%"}
              source={{ uri: item }}
              style={styles.mainImage}
              resizeMode="cover"
              key={index}
            />
          )}
        />
      </Pressable>
      <ScrollView horizontal style={styles.thumbnailContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleThumbnailPress(index)}>
            <CustomImage
              source={{ uri: image }}
              style={[
                styles.thumbnail,
                selectedImageIndex === index && styles.selectedThumbnail,
              ]}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: "center",
  },
  mainImage: {
    width: screenWidth,
    height: "100%",
  },
  thumbnailContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  thumbnail: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 8,
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: "blue",
  },
});
