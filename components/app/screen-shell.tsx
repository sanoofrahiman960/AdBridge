import { ReactNode } from "react";
import {
    Platform,
    ScrollView,
    StyleProp,
    StyleSheet,
    ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

type ScreenShellProps = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ScreenShell({
  children,
  contentContainerStyle,
  scroll = true,
  style,
}: ScreenShellProps) {
  const { palette } = useTheme();

  if (scroll) {
    return (
      <SafeAreaView
        edges={
          Platform.OS === "ios" ? ["top", "left", "right"] : ["top", "bottom"]
        }
        style={[
          styles.safeArea,
          { backgroundColor: palette.background },
          style,
        ]}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView
            darkColor={palette.background}
            lightColor={palette.background}
            style={styles.surface}
          >
            {children}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={
        Platform.OS === "ios" ? ["top", "left", "right"] : ["top", "bottom"]
      }
      style={[styles.safeArea, { backgroundColor: palette.background }, style]}
    >
      <ThemedView
        darkColor={palette.background}
        lightColor={palette.background}
        style={[styles.surface, styles.fill, contentContainerStyle]}
      >
        {children}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: AppSpacing.lg,
    paddingBottom: Platform.OS === "ios" ? AppSpacing.xxl : 110,
  },
  surface: {
    gap: AppSpacing.lg,
  },
});
