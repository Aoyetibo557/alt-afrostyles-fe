import Ionicons from "@expo/vector-icons/Ionicons";
import React, { PropsWithChildren, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

export function Collapsible({
  children,
  title,
  label,
  isPanelOpen,
  bodyStyle,
  onSelect,
}: PropsWithChildren & {
  title: string;
  isPanelOpen: boolean;
  label: string;
  bodyStyle: object;
  onSelect?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(isPanelOpen);
  const theme = useColorScheme() ?? "light";

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return (
    <View>
      <ThemedText type="default">{label}</ThemedText>
      <ThemedView style={[styles.container, bodyStyle]}>
        <TouchableOpacity
          style={styles.heading}
          onPress={toggleOpen}
          activeOpacity={0.8}>
          <Ionicons
            name={isOpen ? "chevron-down" : "chevron-forward-outline"}
            size={18}
            color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          />
          <ThemedText type="default">{title}</ThemedText>
        </TouchableOpacity>
        {isOpen && (
          <ScrollView style={styles.content} nestedScrollEnabled={true}>
            {React.Children.map(children, (child) =>
              React.cloneElement(child as React.ReactElement, {
                onPress: () => {
                  if (onSelect) {
                    onSelect();
                    setIsOpen(false);
                  }
                },
              })
            )}
          </ScrollView>
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 5,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
    maxHeight: 200, // Adjust this value as needed
  },
});
