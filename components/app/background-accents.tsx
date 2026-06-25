import { StyleSheet, View } from "react-native";

import { useTheme } from "@/contexts/theme-context";

export function BackgroundAccents() {
  const { colorScheme, palette } = useTheme();

  return (
    <>
      <View
        pointerEvents="none"
        style={[
          styles.blob,
          styles.primaryBlob,
          { backgroundColor: colorScheme === "dark" ? "#163457" : "#d9e9ff" },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.blob,
          styles.secondaryBlob,
          {
            backgroundColor:
              colorScheme === "dark" ? "#14283a" : palette.primaryMuted,
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  blob: {
    borderRadius: 999,
    opacity: 0.95,
    position: "absolute",
  },
  primaryBlob: {
    height: 180,
    right: -48,
    top: -40,
    width: 180,
  },
  secondaryBlob: {
    bottom: 140,
    height: 140,
    left: -56,
    width: 140,
  },
});
