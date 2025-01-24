import React, { useState } from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../../styles/colors";

interface SearchTermsProps {
  onSelectTerm: (activeFilters: string[]) => void;
}

const searchTerms = [
  "Dresses",
  "Shoes",
  "Accessories",
  "Men",
  "Women",
  "Kids",
  "Sale",
];

export const SearchTerms: React.FC<SearchTermsProps> = ({ onSelectTerm }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleTermPress = (term: string) => {
    let updatedFilters;
    if (activeFilters.includes(term)) {
      // Remove the term from active filters if it's already selected
      updatedFilters = activeFilters.filter((filter) => filter !== term);
    } else {
      // Add the term to active filters
      updatedFilters = [...activeFilters, term];
    }
    setActiveFilters(updatedFilters);
    onSelectTerm(updatedFilters); // Pass the updated filters to the parent component
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}>
      {searchTerms.map((term) => {
        const isActive = activeFilters.includes(term);
        return (
          <TouchableOpacity
            key={term}
            style={[
              styles.termButton,
              isActive && {
                backgroundColor: COLORS.green,
                borderColor: COLORS.green,
              },
            ]}
            onPress={() => handleTermPress(term)}>
            <Text
              style={[
                styles.termText,
                isActive && { color: COLORS.background },
              ]}>
              {term}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  termButton: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  termText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: "Poppins",
  },
});
