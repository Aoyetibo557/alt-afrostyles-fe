import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
import { useInventoryActions } from "@/hooks/useInventoryActions";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/styles/colors";
import { ProductImages } from "@/components/product/product-details";
import { IProduct } from "@/types/index";
import {
  FormInput,
  CollapsiblePicker,
  StackScreenHeader,
  Button,
} from "@/components/common";
import { SizeManager } from "./sizemanager";
import { getCategoryValueByName } from "@/constants/categories";
import { scrollY } from "../../constants/const";
import { EditCategoryChips } from "./editproductcategories";
import { isEmpty } from "lodash";

interface EditProductProps {
  item: IProduct;
  onSubmit: (updatedItem: IProduct) => void;
  isPending?: boolean;
  onCancel: () => void;
  categories: string[];
}

const { width: screenWidth } = Dimensions.get("window");

export const EditProduct: React.FC<EditProductProps> = ({
  item,
  onSubmit,
  isPending,
  onCancel,
  categories,
}) => {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price.toString());
  const [description, setDescription] = useState(item.description);
  const [quantity, setQuantity] = useState<number>(item?.quantity);
  const [sizes, setSizes] = useState<Record<string, { quantity: number }>>(
    item.sizes
  );
  const [selectedCategories, setSelectedCategories] = useState(
    item.categories || []
  );
  const [status, setStatus] = useState<string>(
    item?.is_draft ? "draft" : "publish"
  );
  const [isDraft, setIsDraft] = useState<boolean>(item?.is_draft);
  const [isPublished, setIsPublished] = useState<boolean>(item?.is_published);

  const { isEditModalVisible, setEditModalVisible } = useInventoryActions();

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);

    if (newStatus === "publish") {
      setIsDraft(false);
      setIsPublished(true);
    } else if (newStatus === "draft") {
      setIsDraft(true);
      setIsPublished(false);
    }
  };

  const handleSizesChange = (
    updatedSizes: Record<string, { quantity: number }>
  ) => {
    setSizes(updatedSizes);
  };

  const handleSubmit = () => {
    onSubmit({
      ...item,
      name,
      price: parseFloat(price),
      description,
      sizes,
      quantity,
      categories: selectedCategories,
      is_draft: isDraft,
      is_published: isPublished,
    });
  };

  const handleCategoryChange = (categoryName) => {
    const categoryValue = getCategoryValueByName(categoryName);

    if (!categoryValue) return;

    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(categoryValue)) {
        // If already selected, remove it
        return prevSelectedCategories.filter(
          (value) => value !== categoryValue
        );
      } else {
        // If not selected, add it
        return [...prevSelectedCategories, categoryValue];
      }
    });
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <StackScreenHeader
        title={item?.name}
        leftIcon={{
          name: "arrow-back",
          type: "Ionicons",
          style: styles.topiconstyles,
        }}
        onLeftPress={onCancel}
        scrollY={scrollY}
        backgroundStyle={styles.stackheader}
      />
      <ScrollView style={styles.scrollview}>
        <ProductImages images={item.images} />

        <View style={styles.detailsContainer}>
          <FormInput
            iconName="pricetag-outline"
            iconSize={24}
            iconColor={COLORS.textLight}
            placeholder="Product Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            label="Product Name"
          />

          <FormInput
            iconName="cash-outline"
            iconSize={24}
            iconColor={COLORS.textLight}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            label="Price"
          />

          <FormInput
            iconName="document-text-outline"
            iconSize={24}
            iconColor={COLORS.textLight}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            label="Description"
          />

          <SizeManager initialSizes={sizes} onSizesChange={handleSizesChange} />

          <FormInput
            iconName="document-text-outline"
            iconSize={24}
            iconColor={COLORS.textLight}
            placeholder="0"
            value={quantity.toString()}
            onChangeText={setQuantity}
            keyboardType="numeric"
            label="Stock Count"
          />
        </View>

        <EditCategoryChips
          itemType={item?.type}
          handleCategoryChange={handleCategoryChange}
          selectedCategories={selectedCategories}
        />

        <View style={styles.segementedContainer}>
          <Text style={styles.segementedTitle}>Product Status</Text>
          <SegmentedButtons
            value={status}
            style={styles.segemented}
            onValueChange={handleStatusChange}
            buttons={[
              {
                value: "publish",
                label: "Publish",
                style: {
                  backgroundColor:
                    status === "publish" ? COLORS.green : COLORS.background,
                },
                checkedColor: COLORS.background,
                uncheckedColor: COLORS.textPrimary,
              },
              {
                value: "draft",
                label: "Draft",
                style: {
                  backgroundColor:
                    status === "draft" ? COLORS.green : COLORS.background,
                },
                checkedColor: COLORS.background,
                uncheckedColor: COLORS.textPrimary,
              },
            ]}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          label="Cancel"
          onPress={onCancel}
          type="other"
          style={styles.cancelButton}
        />
        <Button
          label="Update"
          onPress={() => handleSubmit("update")}
          type="primary"
          loading={isPending}
          style={styles.updateButton}
          textStyle={styles.updateButtonText}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollview: {
    flex: 1,
  },
  detailsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PoppinsMedium",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.background,
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    width: "50%",
  },
  updateButton: {
    width: "50%",
    backgroundColor: COLORS.green,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PoppinsMedium",
  },
  stackheader: {
    width: "100%",
    backgroundColor: "transparent",
    position: "absolute",
    top: 50,
    zIndex: 1,
  },
  topiconstyles: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
  },
  segementedContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  segementedTitle: {
    fontFamily: "PoppinsMedium",
  },
  segemented: {
    width: "50%",
  },
});
