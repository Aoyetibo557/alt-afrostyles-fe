import { StyleSheet, View, ScrollView } from "react-native";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { COLORS } from "@/styles/colors";
import { Text } from "@/components/common";

export default function Privacy() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.body}>
        <Text variant="heading" font="Poppins_Semibold">
          AfroStyles Privacy Policy
        </Text>
        <Divider />
        <Text
          variant="body"
          font="PoppinsMedium"
          style={{ paddingVertical: 15 }}>
          Last updated: August 13, 2024
        </Text>
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to AfroStyles, a fashion mobile app dedicated to showcasing
          and promoting African designs and fashion globally. We respect your
          privacy and are committed to protecting the personal information you
          share with us...
        </Text>
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.paragraph}>
          We may collect and process the following types of information:
          Personal Information, Payment Information, Device Information, Usage
          Data, User-Generated Content.
        </Text>
        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect for various purposes, including
          providing and improving services, processing transactions,
          communication, personalization, and security.
        </Text>
        <Text style={styles.sectionTitle}>Data Storage and Security</Text>
        <Text style={styles.paragraph}>
          We implement industry-standard security measures to safeguard your
          data. However, please be aware that no method of transmission over the
          internet or electronic storage is entirely secure.
        </Text>
        <Text style={styles.sectionTitle}>Third-Party Services</Text>
        <Text style={styles.paragraph}>
          We may engage third-party service providers to perform certain
          functions on our behalf, such as payment processing, analytics, and
          customer support.
        </Text>
        <Text style={styles.sectionTitle}>Your Rights and Choices</Text>
        <Text style={styles.paragraph}>
          You have the following rights regarding your personal information:
          access and update, opt-out and account deletion.
        </Text>
        <Text style={styles.sectionTitle}>Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may revise this Privacy Policy periodically to reflect changes in
          our practices, technology, legal requirements, or other factors.
        </Text>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or your personal information, please contact us at
          afrostyles@gmail.com.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "PoppinsMedium",
    marginVertical: 10,
  },
  paragraph: {
    fontSize: 14,
    fontFamily: "Poppins",
    lineHeight: 20,
    marginBottom: 10,
  },
});
