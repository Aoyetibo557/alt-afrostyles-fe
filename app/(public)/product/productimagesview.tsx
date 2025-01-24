import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { StackScreenHeader } from "../../../components/common";
import { useLocalSearchParams, router } from "expo-router";
import { COLORS } from "@/styles/colors";
import { scrollY } from "../../../constants/const";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface ImageZoomScreenParams {
  images: string;
  initialIndex: string;
}

const ImageZoomScreen: React.FC = () => {
  const { images, initialIndex } =
    useLocalSearchParams<ImageZoomScreenParams>();
  const parsedImages = JSON.parse(images);
  const [selectedImageIndex, setSelectedImageIndex] = useState(
    parseInt(initialIndex, 10)
  );

  const handleThumbnailPress = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        title="Product Images"
        leftIcon={{
          name: "arrow-back",
          type: "Ionicons",
        }}
        leftText="Cancel"
        onLeftPress={() => router.back()}
        scrollY={scrollY}
        backgroundStyle={styles.stackheader}
      />
      <View style={styles.mainImageContainer}>
        <ScrollView
          maximumZoomScale={5}
          minimumZoomScale={1}
          bouncesZoom={true}>
          <Image
            source={{ uri: parsedImages[selectedImageIndex] }}
            style={styles.mainImage}
            contentFit="contain"
          />
        </ScrollView>
        <ScrollView horizontal style={styles.thumbnailScrollview}>
          {parsedImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleThumbnailPress(index)}>
              <Image
                source={{ uri: image }}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.selectedThumbnail,
                ]}
                contentFit="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: COLORS.background,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginVertical: 40,
    marginLeft: 10,
    borderRadius: 8,
  },
  thumbnailScrollview: {},
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: "blue",
  },
  mainImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: screenWidth,
    height: screenHeight - 500,
  },
});

export default ImageZoomScreen;
