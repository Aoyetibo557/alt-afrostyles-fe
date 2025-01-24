import React, { useState, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StackScreenHeader } from "../../../../../components/common/stackheader";
import { Widget } from "@/components/common/widget";
import { DraftCard } from "@/components/common/draftcard";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/styles/colors";
import { useDesigner } from "@/context/DesignerContext";
import { useAuth } from "@/context/AuthContext";
import { SearchBar } from "@/components/common/searchbar";
import { useGetStoreInventory } from "../../../../../api/queries/designer";
import { Loading } from "@/components/common/loading";

const ManageInventory = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const scrollY = new Animated.Value(0);

  const {
    designerProfile,
    inventory,
    isFetchingInventory,
    inventoryError,
    refetchInventory,
  } = useDesigner();

  //take this out after you fic the initial fetch issue in the designer conext.
  //chage the routing location to product view after creation not manage
  // useEffect(() => {
  //   refetchInventory();
  // }, []);

  const HAS_INVENTORY = inventory?.length > 0 && !isFetchingInventory;

  const drafts = inventory.filter((item) => item.is_draft);
  if (isFetchingInventory)
    return (
      <Loading loadingText="Fetching Inventory" loading={isFetchingInventory} />
    );

  // if(error) return <ErrorScreen error={error} />

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}>
        <StackScreenHeader
          title="Manage Inventory"
          leftIcon="arrow-back"
          leftIconType="Ionicons"
          // leftText="Back"
          onLeftPress={() => router.back()}
          scrollY={scrollY}
        />
        <Animated.ScrollView
          style={styles.scrollView}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}>
          <View>
            <Text style={styles.screenTitle}>Manage Inventory</Text>
          </View>
          <View>
            <Text style={styles.greeting}>
              Hi {user?.name?.split(" ")[0]}, here's what's happening in your
              store.
            </Text>
            <Text style={styles.subGreeting}>
              Your store has {inventory?.length} items in stock
            </Text>
          </View>

          {/* Move this to the view inventory, not sure if this is needed just yet */}
          {/* <SearchBar
            onSearch={setSearchQuery}
            inputStyle={styles.searchInput}
          /> */}

          {drafts?.length > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Drafts</Text>
                {drafts?.length > 4 && (
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                  </TouchableOpacity>
                )}
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.draftsScroll}>
                {drafts.slice(0, 4).map((draft) => (
                  <DraftCard key={draft.id} item={draft} />
                ))}
              </ScrollView>
            </View>
          )}
          <View style={styles.widgetsContainer}>
            <Widget
              title="View Inventory"
              value={inventory?.length}
              icon="arrow-forward"
              onPress={() => router.push("./viewinventory")}
            />
            <Widget
              title="Edit Store Details"
              value={`${designerProfile?.store_name}, ${designerProfile?.store_description}`}
              icon="arrow-forward"
              onPress={() => router.push("./storedetails")}
            />
            {/* <Widget
              title="Track Sales"
              value="View"
              icon="arrow-forward"
              onPress={() => {
               
              }}
            /> */}
          </View>

          <View>
            {/* {queryResponse &&
              queryResponse?.inventory?.map((item) => (
                <InventoryItem key={item.id} item={item} />
                <Text>{item.name}</Text>
              ))} */}
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 26,
    fontFamily: "PoppinsBold",
  },
  greeting: {
    fontSize: 20,
    fontFamily: "PoppinsMedium",
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: COLORS.gray,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: COLORS.background,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_Semibold",
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: COLORS.primary,
  },
  draftsScroll: {
    marginBottom: 20,
  },

  widgetsContainer: {
    gap: 10,
  },
});

export default ManageInventory;
