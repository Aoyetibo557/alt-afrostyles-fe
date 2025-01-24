import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/styles/colors";
import { supabase } from "@/api/supabase";

interface ImageItem {
  uri: string;
  file?: File;
}

interface UploadImagesProps {
  setProductData: React.Dispatch<React.SetStateAction<any>>;
  productData: {
    images: ImageItem[];
    name: string;
    [key: string]: any;
  };
}

export const UploadImages: React.FC<UploadImagesProps> = ({
  setProductData,
  productData,
}) => {
  const [images, setImages] = useState<ImageItem[]>(productData.images);

  useEffect(() => {
    setProductData((prevData) => ({ ...prevData, images }));
  }, [images]);

  const pickImage = async () => {
    if (images.length >= 6) {
      Alert.alert("Maximum Images", "You can upload a maximum of 6 images.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 6 - images.length,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        file: asset,
      }));
      setImages((prevImages) => [...prevImages, ...newImages].slice(0, 6));
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<ImageItem>) => (
    <TouchableOpacity
      onLongPress={drag}
      style={[styles.imageContainer, isActive && styles.activeImageContainer]}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() =>
          removeImage(images.findIndex((img) => img.uri === item.uri))
        }>
        <Ionicons name="close-circle" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Product Images</Text>
      <Text style={styles.subtitle}>Add 3-6 images of your product</Text>

      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
        }}>
        <DraggableFlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item, index) => `image-${index}`}
          onDragEnd={({ data }) => setImages(data)}
          horizontal
          contentContainerStyle={styles.imageList}
        />
        {images.length < 6 && (
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <Ionicons name="add" size={40} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
      {/* </ScrollView> */}

      {images.length < 3 && (
        <Text style={styles.warningText}>Please add at least 3 images</Text>
      )}

      <Text style={styles.helpText}>
        Tip: Long press and drag to rearrange images
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "PoppinsBold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
    fontFamily: "Poppins",
  },
  imageList: {
    alignItems: "center",
    gap: 5,
  },
  imageContainer: {
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  activeImageContainer: {
    opacity: 0.7,
  },
  image: {
    width: 110,
    height: 110,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
  },
  addButton: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
  },
  warningText: {
    color: "red",
    marginTop: 10,
    fontFamily: "Poppins",
  },
  helpText: {
    marginTop: 20,
    fontStyle: "italic",
    color: "#666",
    fontFamily: "Poppins",
  },
});
