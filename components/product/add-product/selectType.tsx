import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import { Asset } from "expo-asset";
import { COLORS } from "@/styles/colors";
import { Loading } from "../../common";

const ClothingImage = require("@/assets/images/clothingtype.png");
const JewelryImage = require("@/assets/images/accessoriestype.png");

export const SelectType = ({ setProductData, productData }) => {
  const [selectedType, setSelectedType] = useState<string>(productData?.type);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalImages = 2;

  const handleSelectType = (type) => {
    setSelectedType(type);
    setProductData({ ...productData, type });
  };

  const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

  useEffect(() => {
    Asset.loadAsync([ClothingImage, JewelryImage]);
  }, []);

  useEffect(() => {
    if (imagesLoaded === totalImages) {
      setIsLoadingImage(false);
    }
  }, [imagesLoaded]);

  // if (isLoadingImage) {
  //   return <Loading loadingText="Loading..." loading={isLoadingImage} />;
  // }

  return (
    <View style={styles.container}>
      <View style={styles.CTA_container}>
        <Text style={styles.CTA_text}>
          Choose one of the types below that best represent your product{" "}
        </Text>
      </View>
      <ScrollView>
        <View style={styles.typesContainer}>
          <Pressable
            style={[
              styles.type,
              selectedType === "Accessories" && styles.selectedType,
            ]}
            title="Accessories"
            onPress={() => handleSelectType("Accessories")}>
            <Image
              source={JewelryImage}
              style={{
                width: 120,
                height: 120,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }}
              placeholder={blurhash}
              transition={1000}
              contentFit="cover"
              cachePolicy="memory-disk"
              onLoad={() => setImagesLoaded((prev) => prev + 1)}
            />

            <Text
              style={[
                styles.typeText,
                selectedType === "Accessories" && styles.selectedTypeText,
              ]}>
              Accessories
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.type,
              selectedType === "Clothing" && styles.selectedType,
            ]}
            onPress={() => handleSelectType("Clothing")}>
            <Image
              source={ClothingImage}
              style={{
                width: 120,
                height: 120,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }}
              placeholder={blurhash}
              transition={1000}
              contentFit="cover"
              cachePolicy="memory-disk"
              onLoad={() => setImagesLoaded((prev) => prev + 1)}
            />
            <Text
              style={[
                styles.typeText,
                selectedType === "Clothing" && styles.selectedTypeText,
              ]}>
              Clothing
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Add more types as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  CTA_container: {
    paddingBottom: 15,
  },

  CTA_text: {
    fontSize: 16,
    fontFamily: "Poppins_Semibold",
    textAlign: "center",
  },

  typesContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-around",
  },
  type: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: "#ccc",
  },
  typeText: {
    fontSize: 17,
    fontFamily: "IBM",
    textAlign: "center",
    padding: 5,
  },
  selectedType: {
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderColor: COLORS.green,
    borderWidth: 3,
  },
  selectedTypeText: {
    color: COLORS.secondary,
  },
});
