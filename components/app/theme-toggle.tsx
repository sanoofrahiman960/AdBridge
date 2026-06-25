import { Icon } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

import { AppRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme, palette } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: palette.primaryMuted }]}>
      <Icon
        color={palette.primary}
        name={colorScheme === "light" ? "wb-sunny" : "nightlight-round"}
        onPress={toggleColorScheme}
        size={22}
        type="material"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: AppRadius.md,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
});
