import {
  StyleSheet,
  View,
  Animated,
  SectionList,
  Text,
  TouchableOpacity,
  RefreshControl,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StoreSetupComp } from "@/components/designers/setupstore";
import { COLORS } from "@/styles/colors";
import {
  FormInput,
  StackScreenHeader,
  Button,
  Loading,
} from "@/components/common";
import { useDesigner } from "@/context/DesignerContext";
import { EnhancedAvatar } from "@/components/avatar/enhancedAvatar";
import { useUpdateStoreImageMutation } from "@/api/mutations/designer";
import { useCreateStoreMutation } from "@/api/mutations/designer";
import { useAlert } from "@/context/AlertContext";
import _ from "lodash";

const StoreDetails = () => {
  const { showAlert } = useAlert();
  const {
    designerProfile,
    updateDesignerProfileMutation,
    refetchDesignerProfile,
    isPending: isFetchingStore,
  } = useDesigner();
  const [storeName, setStoreName] = useState<string>(
    designerProfile?.store_name
  );
  const [storeDescription, setStoreDescriptiom] = useState<string>(
    designerProfile?.store_description
  );
  const [nameError, setNameError] = useState<string>("");
  const [descpError, setDescpError] = useState<string>("");
  const [loadingText, setLoadingText] = useState("Loading...");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const scrollY = new Animated.Value(0);

  const {
    mutate: createStore,
    isPending: isCreatingStore,
    data: createData,
  } = useCreateStoreMutation();

  const {
    mutate: updateStore,
    isPending: isUpdateLoading,
    error: updateStoreError,
  } = updateDesignerProfileMutation;

  const {
    mutate: updateStoreImage,
    error,
    isPending: isUpdateStoreImage,
  } = useUpdateStoreImageMutation();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchDesignerProfile();
    setRefreshing(false);
  }, [refetchDesignerProfile]);

  //use the create store mutation from the designer mutation file here
  const handleCreateStore = () => {
    createStore(
      { storeName, storeDescription },
      {
        onSuccess: () => {
          setLoadingText("Store created successfully! Updating information...");
          refetchDesignerProfile().then(() => {
            setStoreName(designerProfile?.store_name);
            setStoreDescriptiom(designerProfile?.store_description);
            setLoadingText("Loading...");
          });
        },
      }
    );
    setLoadingText("Hang on a minute while we create your store...");
  };

  const handleStoreProfileUpdate = () => {
    setStoreName("");
    if (_.isEmpty(storeName)) {
      setNameError("Store name cannot be empty!");
      return;
    }

    updateStore({ storeName, storeDescription });
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  useEffect(() => {
    if (designerProfile) {
      setStoreName(designerProfile.store_name || "");
      setStoreDescriptiom(designerProfile.store_description || "");
    }
  }, [designerProfile]);

  if (isUpdateStoreImage) {
    <Loading
      loadingText="Updating store image..."
      isLoading={isUpdateStoreImage}
    />;
  }
  if (isFetchingStore || isCreatingStore)
    return (
      <Loading
        loadingText={loadingText}
        isLoading={isFetchingStore || isCreatingStore}
      />
    );

  return (
    <SafeAreaView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isFetchingStore}
          onRefresh={refetchDesignerProfile}
        />
      }>
      <KeyboardAwareScrollView>
        <BottomSheetModalProvider>
          <StackScreenHeader
            title="Store Details"
            leftIcon={{
              name: "arrow-back",
              type: "Ionicons",
            }}
            leftText="store profile"
            onLeftPress={() => router.back()}
            scrollY={scrollY}
          />
          <View style={styles.container}>
            <View style={styles.bodyTop}>
              {_.isEmpty(designerProfile?.store_name) ? (
                <>
                  <Text style={styles.title}>Create Store</Text>
                  <Text style={styles.subtitle}>
                    Fill in the inputs below to create your store.
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.title}>Update Store Details</Text>
                  <Text style={styles.subtitle}>
                    Please ensure all information is accurate and up-to-date.
                  </Text>
                </>
              )}
            </View>

            <View>
              {!_.isEmpty(designerProfile?.store_name) && (
                <EnhancedAvatar
                  id={designerProfile?.id}
                  initialImageUrl={designerProfile?.store_image}
                  uploadImage={updateStoreImage}
                  origin="STORE_IMAGE"
                  size={100}
                  style={styles.enhancedAvatar}
                />
              )}

              <FormInput
                iconName=""
                iconSize={24}
                value={storeName}
                onChangeText={setStoreName}
                autoCapitalize="sentences"
                placeholder="JD's Boutique"
                style={styles.input}
                label="Store Name"
                error={nameError}
              />

              <FormInput
                iconName=""
                iconSize={24}
                value={storeDescription}
                placeholder="Shade's boutique is your go-to place for unique designs and couture..."
                onChangeText={setStoreDescriptiom}
                autoCapitalize="sentences"
                style={styles.input}
                label="Store Description"
              />

              {!_.isEmpty(designerProfile?.store_name) ? (
                <Button
                  label="Update"
                  type="primary"
                  onPress={handleStoreProfileUpdate}
                  loading={isUpdateLoading}
                />
              ) : (
                <Button
                  label="Create store"
                  onPress={handleCreateStore}
                  loading={isUpdateLoading}
                />
              )}
            </View>
          </View>
        </BottomSheetModalProvider>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default StoreDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
  },
  bodyTop: {
    paddingVertical: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins_Semibold",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins",
    opacity: 0.5,
  },
  input: {
    borderRadius: 8,
  },
  btn: {
    display: "flex",
    alignItems: "center",
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  btnText: {
    fontSize: 15,
    fontFamily: "Poppins",
    color: "#fff",
  },

  enhancedAvatar: {
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "none",
    height: 250,
    aspectRatio: 1.5,
    marginVertical: 20,
  },
});
