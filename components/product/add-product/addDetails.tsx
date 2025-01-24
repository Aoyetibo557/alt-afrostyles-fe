import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormInput } from "../../common";
import { COLORS } from "@/styles/colors";

interface ProductDetails {
  name: string;
  description: string;
  price: string;
  quantity: string;
}

interface AddDetailsProps {
  setProductData: React.Dispatch<React.SetStateAction<any>>;
  productData: {
    details: ProductDetails;
    [key: string]: any;
  };
}

export const AddDetails: React.FC<AddDetailsProps> = ({
  setProductData,
  productData,
}) => {
  const [details, setDetails] = useState<ProductDetails>(
    productData.details || {
      name: "",
      description: "",
      price: "",
      quantity: "",
    }
  );

  useEffect(() => {
    setProductData((prevData) => ({ ...prevData, details }));
  }, [details, setProductData]);

  const handleChange = (field: keyof ProductDetails, value: string) => {
    setDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Add Product Details</Text>
        <Text style={styles.subtitle}>
          Enter the details that best describe your product
        </Text>

        <FormInput
          // iconName="tag"
          iconSize={24}
          style={styles.input}
          label="Product Name"
          placeholder="African Multicolor Print Buba"
          value={details.name}
          onChangeText={(value) => handleChange("name", value)}
          autoCapitalize="words"
        />

        <FormInput
          // iconName="dollar-sign"
          iconSize={24}
          style={styles.input}
          label="Price"
          placeholder="0.00"
          value={details.price}
          onChangeText={(value) => handleChange("price", value)}
          keyboardType="numeric"
        />

        <FormInput
          // iconName="package"
          iconSize={24}
          style={styles.input}
          label="Quantity"
          placeholder="1"
          value={details.quantity}
          onChangeText={(value) => handleChange("quantity", value)}
          keyboardType="numeric"
        />

        <FormInput
          // iconName="file-text"
          iconSize={24}
          style={styles.input}
          label="Description"
          placeholder="Describe your product..."
          value={details.description}
          onChangeText={(value) => handleChange("description", value)}
          autoCapitalize="sentences"
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: COLORS.background,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontFamily: "Poppins",
  },
});
