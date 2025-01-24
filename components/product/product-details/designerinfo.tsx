import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { COLORS } from "@/styles/colors";
import { useGetDesignerInfoQuery } from "../../../api/queries/designer";
import { CustomImage } from "../../common";
import { IStore } from "../../../types/index";
import { truncate } from "lodash";

export const DesignerInfo = ({ designerId }: { designerId: string }) => {
  const [designer, setDesigner] = useState<IStore>({});
  const { data, isPending, error } = useGetDesignerInfoQuery(designerId);

  useEffect(() => {
    if (data?.designer) {
      setDesigner(data.designer);
    } else if (error) {
    }
  }, [data, isPending]);

  const handleNavToDesigner = (designerId: string) => {
    router.push({
      pathname: "/(public)/designer/[id]",
      params: { id: designerId },
    });
  };
  return (
    <View style={styles.designerBlock}>
      <View style={styles.designerInfo}>
        <CustomImage
          height={"200"}
          source={designer?.store_image}
          style={styles.designerImage}
        />
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.designerName}>{designer?.store_name}</Text>
          <Text style={styles.designerDescp}>
            {truncate(designer?.store_description, { length: 65 })}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.viewDesignerButton}
        onPress={() => handleNavToDesigner(designerId)}>
        <Text style={styles.viewDesignerText}>View</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  designerBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  designerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  designerImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  designerName: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: COLORS.text,
  },
  designerDescp: {
    width: 180,
    color: COLORS.textSecondary,
    flexWrap: "wrap",
  },
  viewDesignerButton: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  viewDesignerText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: "PoppinsMedium",
  },
});
