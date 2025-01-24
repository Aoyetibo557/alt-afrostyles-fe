import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../styles/colors";

interface SegmentedControlProps {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  values,
  selectedIndex,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      {values.map((value, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.segment,
            selectedIndex === index && styles.selectedSegment,
          ]}
          onPress={() => onChange(index)}>
          <Text
            style={[
              styles.segmentText,
              selectedIndex === index && styles.selectedSegmentText,
            ]}>
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 8,
    borderColor: COLORS.green,
    borderWidth: 1,
    overflow: "hidden",
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  selectedSegment: {
    backgroundColor: COLORS.green,
  },
  segmentText: {
    color: COLORS.textPrimary,
    fontFamily: "Poppins",
  },

  selectedSegmentText: {
    color: "white",
    fontFamily: "Poppins",
  },
});

export default SegmentedControl;
