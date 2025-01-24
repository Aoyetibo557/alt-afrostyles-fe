import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Carousel from "react-native-reanimated-carousel";
import { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/styles/colors";
import { IProduct } from "@/types/index";
import { StackScreenHeader } from "@/components/common/stackheader";
import { testData } from "@/constants/testdata";
import { Loading, Error } from "@/components/common";
import {
  DesignerInfo,
  ProductDetails,
  ProductImages,
  SizeSelection,
} from "@/components/product/product-details";
import { useAlert } from "@/context/AlertContext";
import { useGetProductQuery } from "@/api/queries/product";
import { useCart } from "@/context/CartContext";
import { isEmpty } from "lodash";

const { width: screenWidth } = Dimensions.get("window");

const ProductDetailScreen = () => {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const { showAlert } = useAlert();
  const [isSaved, setIsSaved] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const {
    data: productQueryData,
    isPending,
    error: getProductError,
  } = useGetProductQuery(id);

  const {
    cart,
    isPending: isAddPending,
    error: addToCartError,
    addToCart,
  } = useCart();

  const scrollY = new Animated.Value(0);

  const renderCarouselItem = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.carouselImage} />
  );

  const handleAddToCart = async () => {
    if (user) {
      await addToCart(product.id, 1);
    } else {
      router.push("../../(tabs)/auth/login");
    }
  };

  useEffect(() => {
    if (productQueryData?.product) {
      setProduct(productQueryData.product);
    } else if (getProductError) {
      setError(getProductError);
    }
    setIsLoading(isPending);
  }, [productQueryData, isPending, getProductError]);

  if (isLoading) {
    return (
      <Loading loadingText="Fetching product detail..." isLoading={isLoading} />
    );
  }

  if (error) {
    return (
      <Error
        message={error?.message}
        onRetry={() => setRetryCount(retryCount + 1)}
        retryCount={retryCount}
      />
    );
  }

  if (isEmpty(product)) {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text>Product Could not be found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const goToCart = () => {
    router.push("../../(tabs)/cart-screens/cart");
  };

  return (
    <View style={styles.container}>
      <StackScreenHeader
        title={product?.name}
        leftIcon={{
          name: "arrow-back",
          type: "Ionicons",
          style: styles.topiconstyles,
        }}
        rightIcon={{
          name: "cart-outline",
          type: "Ionicons",
          badgeCount: cart?.length,
          style: styles.topiconstyles,
        }}
        onLeftPress={() => router.back()}
        onRightPress={() => goToCart()}
        scrollY={scrollY}
        backgroundStyle={styles.stackheader}
      />
      <ScrollView style={styles.scrollview}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <ProductImages images={product?.images} />

          <ProductDetails
            product={product}
            isSaved={isSaved}
            setIsSaved={setIsSaved}
          />

          <SizeSelection
            sizes={product?.sizes}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
          <DesignerInfo designerId={product?.designer_id} />

          <View style={styles.reviewsSection}>
            <Text style={styles.reviewsTitle}>Reviews</Text>
            {/* Add reviews component here */}
            <Text style={styles.noReviews}>No reviews yet</Text>
          </View>
        </Animated.View>
      </ScrollView>
      <View style={styles.addToCartButtonContainer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          disabled={isAddPending}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
          <Text style={styles.addToCartText}>
            {isAddPending ? "Adding to cart..." : "Add to cart"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsSaved(!isSaved)}
          style={styles.saveButton}>
          <Ionicons
            name={isSaved ? "heart" : "heart-outline"}
            size={24}
            color={isSaved ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollview: {
    flex: 1,
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
  carousel: {
    display: "flex",
    alignItems: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  addToCartButtonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    padding: 20,
    backgroundColor: COLORS.background,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    // width: 200,
    marginRight: 10,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    marginLeft: 10,
  },
  saveButton: {
    padding: 8,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  reviewsSection: {
    padding: 20,
  },
  reviewsTitle: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
    color: COLORS.text,
    marginBottom: 10,
  },
  noReviews: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: COLORS.textLight,
    fontStyle: "italic",
  },
});
