import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { Animated, View, Text, StyleSheet, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenHeader } from "@/components/common/stackheader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "@/styles/colors";

interface Preferences {
  emailNewArrivals: boolean;
  emailSales: boolean;
  appPushNotifications: boolean;
  appOrderUpdates: boolean;
  styleRecommendations: boolean;
  trendAlerts: boolean;
}

const NotificationPreferencesScreen: React.FC = () => {
  const scrollY = new Animated.Value(0);

  const [preferences, setPreferences] = useState<Preferences>({
    emailNewArrivals: false,
    emailSales: false,
    appPushNotifications: false,
    appOrderUpdates: false,
    styleRecommendations: false,
    trendAlerts: false,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const storedPreferences = await AsyncStorage.getItem("userPreferences");
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  const savePreferences = async (newPreferences: Preferences) => {
    try {
      await AsyncStorage.setItem(
        "userPreferences",
        JSON.stringify(newPreferences)
      );
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const togglePreference = (key: keyof Preferences) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const PreferenceItem: React.FC<{
    label: string;
    description?: string;
    value: boolean;
    onToggle: () => void;
  }> = ({ label, description, value, onToggle }) => (
    <View style={styles.preferenceItem}>
      <View>
        <Text style={styles.preferenceLabel}>{label}</Text>
        <Text style={styles.preferenceDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.secondary, true: COLORS.green }}
        thumbColor={label ? COLORS.background : COLORS.secondary}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StackScreenHeader
        title="Notification Prefrences"
        leftIcon="arrow-back"
        leftIconType="Ionicons"
        leftText=""
        onLeftPress={() => router.back()}
        scrollY={scrollY}
      />

      <View style={styles.bodyView}>
        <Text style={styles.screenTitle}>Notification Prefrences</Text>

        <Text style={styles.sectionTitle}>Email</Text>
        <PreferenceItem
          label="New Arrivals"
          description="Weekly emails about new arrivals from diffrent designers"
          value={preferences.emailNewArrivals}
          onToggle={() => togglePreference("emailNewArrivals")}
        />
        <PreferenceItem
          label="Sales & Promotions"
          description="Promotional emails and notifications weekly"
          value={preferences.emailSales}
          onToggle={() => togglePreference("emailSales")}
        />

        <Text style={styles.sectionTitle}>App Preferences</Text>
        <PreferenceItem
          label="Push Notifications"
          value={preferences.appPushNotifications}
          onToggle={() => togglePreference("appPushNotifications")}
        />
        <PreferenceItem
          label="Order Updates"
          value={preferences.appOrderUpdates}
          onToggle={() => togglePreference("appOrderUpdates")}
        />

        <Text style={styles.sectionTitle}>Style Recommendations</Text>
        <PreferenceItem
          label="Personalized Style Suggestions"
          value={preferences.styleRecommendations}
          onToggle={() => togglePreference("styleRecommendations")}
        />
        <PreferenceItem
          label="Trend Alerts"
          value={preferences.trendAlerts}
          onToggle={() => togglePreference("trendAlerts")}
        />
      </View>
    </SafeAreaView>
  );
};
export default NotificationPreferencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bodyView: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_Semibold",
    marginTop: 20,
    marginBottom: 10,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  preferenceLabel: {
    fontSize: 16,
    fontFamily: "Poppins",
  },
  preferenceDescription: {
    width: 300,
    fontFamily: "Poppins",
    color: COLORS.textSecondary,
  },
  screenTitle: {
    fontSize: 20,
    fontFamily: "Poppins_Semibold",
    paddingBottom: 20,
  },
});
