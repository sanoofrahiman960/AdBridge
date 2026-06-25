import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform } from "react-native";

import { Colors } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

export default function Root() {
  const { colorScheme } = useTheme();

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors[colorScheme].background,
          },
          animation: "fade",
          gestureEnabled: Platform.OS === "ios",
          orientation: "portrait",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Login"
          options={{
            presentation: "card",
            gestureEnabled: Platform.OS === "ios",
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="create-campaign"
          options={{
            presentation: "card",
            gestureEnabled: Platform.OS === "ios",
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            gestureEnabled: Platform.OS === "ios",
          }}
        />
      </Stack>
    </>
  );
}
