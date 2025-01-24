import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { router } from "expo-router";
import { useDesigner } from "@/context/DesignerContext";
import { useAlert } from "../../../context/AlertContext";
import { useAddProductMutation } from "@/api/mutations/designer";
import { SelectType } from "./selectType";
import { SelectCategories } from "./selectCategory";
import { AddDetails } from "./addDetails";
import { AddSizes } from "./addSizes";
import { UploadImages } from "./uploadImages";
import { PreviewProduct } from "./previewProduct";
import { COLORS } from "@/styles/colors";
import { ProductActionButtons } from "./productButtons";
import { supabase } from "@/api/supabase";
import { changeImageFileName } from "@/utils/util";
import { Loading } from "../../common";

interface ImageItem {
  uri: string;
  file?: File;
}

const AddProduct = () => {
  const { designerProfile } = useDesigner();
  const { showAlert, hideAlert } = useAlert();
  const {
    mutate: addProduct,
    isPending,
    error,
    data: addResponse,
  } = useAddProductMutation();

  const [step, setStep] = useState(1);
  const [productData, setProductData] = useState({
    type: "",
    categories: [],
    details: {
      name: "",
      description: "",
      price: "",
      quantity: "",
    },
    sizes: [],
    fitPreference: "",
    images: [],
  });

  const isStepValid = () => {
    switch (step) {
      case 1:
        return productData.type !== "";
      case 2:
        return productData.categories.length > 0;
      case 3:
        return (
          productData.details.name !== "" &&
          productData.details.description !== "" &&
          productData.details.price !== "" &&
          productData.details.quantity !== ""
        );
      case 4:
        return productData.sizes !== null;
      case 5:
        return productData.images.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 5 && isStepValid()) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSaveDraft = async () => {
    const product = {
      ...productData,
      isDraft: true,
    };
    addProduct(
      {
        designer_id: designerProfile.id,
        product: product,
        images: productData?.images,
      },
      {
        onSuccess: () => {
          showAlert("success", "New product saved as draft");
          router.replace("./manageinventory");
        },
      }
    );
  };

  const handlePublish = async () => {
    const product = {
      ...productData,
      isPublished: true,
    };

    addProduct(
      {
        designer_id: designerProfile.id,
        product: product,
        images: productData?.images,
      },
      {
        onSuccess: () => {
          showAlert("success", "New product created sucessfully");
          router.replace("./manageinventory");
        },
      },
      {
        onError: () => {
          showAlert(
            "error",
            "Oops! Something went wroong add the new product."
          );
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Add New Product</Text>
        <Text style={styles.subtitle}>
          Fill in the required information to add product to inventory
        </Text>
      </View>

      {step === 1 && (
        <SelectType setProductData={setProductData} productData={productData} />
      )}
      {step === 2 && (
        <SelectCategories
          setProductData={setProductData}
          productData={productData}
        />
      )}
      {step === 3 && (
        <AddDetails setProductData={setProductData} productData={productData} />
      )}
      {productData?.type?.toLowerCase() === "accessories" && step === 4 && (
        <AddSizes setProductData={setProductData} productData={productData} />
      )}
      {step === 5 && (
        <UploadImages
          setProductData={setProductData}
          productData={productData}
        />
      )}
      {step === 6 && <PreviewProduct productData={productData} />}

      <View style={styles.navigationButtons}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.btn, styles.backBtn]}
            onPress={handleBack}>
            <Text style={[styles.btnText, styles.backBtnText]}>Back</Text>
          </TouchableOpacity>
        )}
        {step < 6 && (
          <TouchableOpacity
            style={[
              styles.btn,
              styles.nextBtn,
              !isStepValid() && styles.disabledBtn,
            ]}
            onPress={handleNext}
            disabled={!isStepValid()}>
            <Text
              style={[
                styles.btnText,
                !isStepValid() && styles.disabledBtnText,
              ]}>
              Next
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {step === 5 && (
        <ProductActionButtons
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  titleContainer: {
    paddingVertical: 30,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  title: {
    fontSize: 25,
    fontFamily: "PoppinsBold",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins",
    opacity: 0.5,
  },
  btn: {
    display: " flex",
    alignItems: "center",
    width: 90,
    padding: 10,
    borderRadius: 30,
  },
  btnText: {
    fontSize: 15,
    fontFamily: "Poppins",
  },
  nextBtn: {
    backgroundColor: COLORS.green,
  },
  backBtn: {
    backgroundColor: COLORS.primary,
  },
  backBtnText: {
    color: "#fff",
  },
  disabledBtn: {
    backgroundColor: "#ccc",
  },
  disabledBtnText: {
    color: "#666",
  },
});

export default AddProduct;
