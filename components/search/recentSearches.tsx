import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../styles/colors";

interface RecentSearchesProps {
  searches: string[];
  onSelectSearch: (term: string) => void;
  onRemoveSearch: (term: string) => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSelectSearch,
  onRemoveSearch,
}) => {
  if (searches.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Searches</Text>
      {searches.map((term) => (
        <View key={term} style={styles.searchItem}>
          <TouchableOpacity
            onPress={() => onSelectSearch(term)}
            style={styles.searchTerm}>
            <Text style={styles.searchText}>{term}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onRemoveSearch(term)}
            style={styles.removeButton}>
            <Ionicons name="close" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "PoppinsMedium",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  searchTerm: {
    flex: 1,
  },
  searchText: {
    fontSize: 15,
    fontFamily: "Poppins",
    color: COLORS.textPrimary,
    opacity: 0.8,
  },
  removeButton: {
    padding: 4,
  },
});
