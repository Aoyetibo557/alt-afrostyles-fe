import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { queryClient } from "@/utils/queryClient";
import { useAuth } from "@/context/AuthContext";
import TopBar from "@/components/home/topBar";
import { Avatar } from "@/components/avatar/avatar";
import { truncate } from "lodash";
import { useGetFeaturedDesigners } from "@/api/queries/designer";
import { StyleTips } from "@/components/home/styleTips";
import { COLORS } from "@/styles/colors";
import Animated, { FadeInDown } from "react-native-reanimated";

import MensImage from "../../../assets/images/mensImage.png";
import WomensImage from "../../../assets/images/womensCategory.png";
import UniqueImage from "../../../assets/images/uniqueCategory.png";
import AccessoriesImage from "../../../assets/images/accessoriesCategory.png";

const Categories = ({ category, isTablet }) => {
  const handleCategorySelect = (value) => {
    router.push({
      pathname: "product/productlist",
      params: { category: value },
    });
  };

  return (
    <Animated.View
      key={category.title}
      entering={FadeInDown.delay(100)}
      style={[styles.categoryItem, isTablet && styles.categoryItemTablet]}>
      <TouchableOpacity onPress={() => handleCategorySelect(category.value)}>
        <ImageBackground
          source={category.image}
          style={styles.categoryImage}
          imageStyle={styles.categoryImageStyle}>
          <View style={styles.categoryOverlay}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Home = () => {
  const { user, isAuthPending } = useAuth();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const { data } = useGetFeaturedDesigners({
    placeholderData: () => {
      return queryClient.getQueryData(["featuredDesigners"]);
    },
  });

  const categoryImages = [
    {
      title: "Shop Unique",
      value: "unique",
      image: UniqueImage,
    },
    {
      title: "Accessories",
      value: "accessories",
      image: AccessoriesImage,
    },
    {
      title: "Shop Women's",
      value: "women",
      image: WomensImage,
    },
    {
      title: "Shop Men's",
      value: "men",
      image: MensImage,
    },
  ];

  const handleViewDesignerProfile = (id) => {
    router.push({
      pathname: "../../(public)/designer/[id]",
      params: { id: id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 15, paddingTop: 20 }}>
        <TopBar />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>What are you looking for?</Text>
          <View style={styles.categoryGrid}>
            {categoryImages.map((item, index) => (
              <Categories key={index} category={item} isTablet={isTablet} />
            ))}
          </View>
        </View>

        {data &&
          data.featuredDesigners &&
          data.featuredDesigners.length > 0 && (
            <View style={styles.designersSection}>
              <Text style={styles.sectionTitle}>Featured Designers</Text>
              <ScrollView horizontal>
                {data.featuredDesigners.map((designer, idx) => (
                  <TouchableOpacity
                    key={designer.id || idx}
                    onPress={() => handleViewDesignerProfile(designer?.id)}
                    style={styles.designerCard}>
                    <Avatar
                      source={designer.store_image}
                      size={100}
                      style={{ marginRight: 10 }}
                      imageStyle={{ opacity: 0.9 }}
                    />
                    <Text style={styles.designersName}>
                      {truncate(designer?.store_name, { length: 15 })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        <StyleTips />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
    paddingHorizontal: 15,
  },
  categoriesSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: COLORS.textPrimary,
    marginVertical: 15,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "48%",
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImageStyle: {
    borderRadius: 8,
  },
  categoryOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 18,
    color: "white",
    fontFamily: "PoppinsMedium",
  },
  designerCard: {
    marginHorizontal: 5,
  },
  designersSection: {
    marginTop: 40,
    flexDirection: "column",
  },
  designersName: {
    fontFamily: "PoppinsMedium",
    fontSize: 15,
    textAlign: "center",
  },
});
