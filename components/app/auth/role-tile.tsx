import { Icon } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppRadius, AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

type RoleTileProps = {
  description: string;
  icon: string;
  onPress: () => void;
  selected?: boolean;
  title: string;
};

export function RoleTile({
  description,
  icon,
  onPress,
  selected = false,
  title,
}: RoleTileProps) {
  const { palette } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.tile,
        {
          backgroundColor: selected ? palette.primaryMuted : palette.card,
          borderColor: selected ? palette.primary : palette.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconShell,
          {
            backgroundColor: selected ? palette.primary : palette.primaryMuted,
          },
        ]}
      >
        <Icon
          color={selected ? "#ffffff" : palette.primary}
          name={icon}
          size={22}
        />
      </View>
      <View style={styles.copy}>
        <ThemedText style={styles.title} type="defaultSemiBold">
          {title}
        </ThemedText>
        <ThemedText style={[styles.description, { color: palette.mutedText }]}>
          {description}
        </ThemedText>
      </View>
      <Icon
        color={selected ? palette.primary : palette.mutedText}
        name="arrow-forward"
        size={20}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
    gap: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
  iconShell: {
    alignItems: "center",
    borderRadius: AppRadius.md,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  tile: {
    alignItems: "center",
    borderRadius: AppRadius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: AppSpacing.md,
    padding: AppSpacing.md,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
  },
});
