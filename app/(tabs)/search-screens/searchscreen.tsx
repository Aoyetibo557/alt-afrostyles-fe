import React, { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetFilteredProductsQuery } from "@/api/queries/product";
import { queryClient } from "../../../utils/queryClient";
import { SearchBar } from "@/components/common/searchbar";
import { ProductCard } from "@/components/product/product-card/productCard";
import { SearchTerms } from "@/components/search/searchTerms";
import { RecentSearches } from "@/components/search/recentSearches";
import { Loading } from "../../../components/common";
import { COLORS } from "@/styles/colors";

const RECENT_SEARCHES_KEY = "@recent_searches";
const DEBOUNCE_DELAY = 500;

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const {
    data: queryResult,
    isLoading,
    error,
    refetch,
  } = useGetFilteredProductsQuery(
    {
      searchQuery,
      filters: activeFilters,
    },
    {
      placeholderData: () => {
        return queryClient.getQueryData([
          "filteredProducts",
          { searchQuery, filters: activeFilters },
        ]);
      },
    }
  );

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const storedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      const updatedSearches = [
        query,
        ...recentSearches.filter((item) => item !== query),
      ].slice(0, 10);
      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches)
      );
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const removeRecentSearch = async (query: string) => {
    try {
      const updatedSearches = recentSearches.filter((item) => item !== query);
      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches)
      );
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error("Error removing recent search:", error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        saveRecentSearch(query.trim());
      }
    }, DEBOUNCE_DELAY),
    [activeFilters] // Dependency array includes activeFilters
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  const renderSearchResults = () => {
    if (searchQuery && queryResult?.products?.length === 0) {
      return <Text style={styles.noResults}>No results found</Text>;
    }

    return isLoading ? (
      <View style={{ height: 500 }}>
        <Loading
          loadingText={`fetching results  of "${searchQuery}"`}
          isLoading={isLoading}
        />
      </View>
    ) : (
      <FlatList
        data={queryResult?.products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="search for designer, accessories, product..."
        onSearch={handleSearch}
        style={{
          paddingTop: 15,
          paddingHorizontal: 15,
        }}
      />
      {/* <KeyboardAwareScrollView> */}
      <Animated.View
        entering={FadeInDown.delay(100)}
        style={styles.scrollContent}>
        <SearchTerms onSelectTerm={handleFilterChange} />

        {searchQuery ? (
          renderSearchResults()
        ) : (
          <>
            <RecentSearches
              searches={recentSearches}
              onSelectSearch={(term) => {
                setSearchQuery(term);
                handleSearch(term);
              }}
              onRemoveSearch={removeRecentSearch}
            />
          </>
        )}
      </Animated.View>
      {/* </KeyboardAwareScrollView> */}
    </SafeAreaView>
  );
};

// Debounce function
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  noResults: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: COLORS.textLight,
  },
});
