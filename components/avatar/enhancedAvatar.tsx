import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { StyleSheet, View, TouchableOpacity, Text, Modal } from "react-native";
import { COLORS } from "../../styles/colors";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import { supabase } from "../../api/supabase";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { changeImageFileName } from "../../utils/util";
import { IUser } from "@/types/index";
import { MESSAGE_TYPES } from "../../constants/const";
import { useAlert } from "../../context/AlertContext";

interface EnhancedAvatarProps {
  id: string;
  initialImageUrl?: string;
  size?: number;
  style?: string;
  uploadImage: (
    fileName: string,
    image: any
  ) => Promise<{
    imageUrl: string;
    messageType: string;
    message: string;
  }>;
  origin: string;
}

export const EnhancedAvatar: React.FC<EnhancedAvatarProps> = ({
  id,
  initialImageUrl,
  size = 100,
  uploadImage,
  origin,
  style,
}) => {
  const { showAlert, hideAlert } = useAlert();

  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [showModal, setShowModal] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "25%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // if i wanted to do something cray here
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const handleChooseImage = async () => {
    bottomSheetModalRef.current?.dismiss();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300, height: 300 } }],
        { format: "jpeg" }
      );

      await handleUploadImage(manipResult);
    }
  };

  const handleUploadImage = async (image: any) => {
    bottomSheetModalRef.current?.dismiss();

    try {
      const warpedImage = {
        uri: image.uri,
        file: image,
      };
      // first change the fileName
      const fileName = changeImageFileName({
        fileName: image.uri,
        origin: "PROFILE_PICTURE",
        _id: id,
      });
      const { profile_picture_url, messageType, message } = await uploadImage(
        fileName,
        warpedImage
      );

      if (messageType === MESSAGE_TYPES.SUCCESS) {
        setImageUrl(profile_picture_url);
      }
    } catch (error) {
      showAlert("error", "Oops, uploading image failed. Try again!");
    }
  };

  const handleViewProfilePicture = () => {
    bottomSheetModalRef.current?.dismiss();
    setShowModal(true);
  };

  useEffect(() => {
    // Clean up the BottomSheetModal when component unmounts
    return () => bottomSheetModalRef.current?.close();
  }, []);

  return (
    <View>
      <TouchableOpacity onLongPress={handlePresentModalPress}>
        <Image
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("@/assets/images/placeholder-avatar.png")
          }
          style={[
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: 2,
              borderColor: COLORS.green,
            },
            style,
          ]}
        />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={handleChooseImage} style={styles.option}>
            <Text>Choose from library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleViewProfilePicture}
            style={styles.option}>
            <Text>View Profile Picture</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
      <Modal
        visible={showModal}
        transparent={true}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowModal(false)}>
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
          <Image
            source={
              imageUrl
                ? { uri: imageUrl }
                : require("@/assets/images/placeholder-avatar.png")
            }
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalImage: {
    width: "90%",
    height: "90%",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  modalCloseButtonText: {
    color: "white",
    fontSize: 18,
  },
});
