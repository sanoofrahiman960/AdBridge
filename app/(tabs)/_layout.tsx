import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { useTheme } from "@/contexts/theme-context";

export default function TabLayout() {
  const { palette } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const androidTabBarBottomPadding = Math.max(bottom, 16);
  const androidTabBarHeight = 54 + androidTabBarBottomPadding;

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        tabBarActiveTintColor: palette.tint,
        tabBarInactiveTintColor: palette.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveBackgroundColor: palette.card,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: palette.card,
          borderTopColor: palette.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : androidTabBarHeight + 15,
          paddingBottom:
            Platform.OS === "ios" ? 20 : androidTabBarBottomPadding + 10,
          paddingTop: Platform.OS === "ios" ? 12 : 10,
          elevation: 8,
          shadowColor: palette.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <MaterialIcons color={color} name="grid-view" size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Campaigns",
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <MaterialIcons color={color} name="campaign" size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <MaterialIcons color={color} name="person-outline" size={24} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
