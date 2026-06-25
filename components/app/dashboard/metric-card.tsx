import { Icon } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppRadius, AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

type MetricCardProps = {
  accent?: "primary" | "success" | "warning";
  icon: string;
  label: string;
  value: string;
};

export function MetricCard({
  accent = "primary",
  icon,
  label,
  value,
}: MetricCardProps) {
  const { palette } = useTheme();
  const accentColor = palette[accent];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <View
        style={[styles.iconShell, { backgroundColor: palette.primaryMuted }]}
      >
        <Icon color={accentColor} name={icon} size={18} />
      </View>
      <ThemedText style={[styles.label, { color: palette.mutedText }]}>
        {label}
      </ThemedText>
      <ThemedText style={styles.value} type="defaultSemiBold">
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AppRadius.lg,
    borderWidth: 1,
    flex: 1,
    gap: AppSpacing.sm,
    minWidth: "47%",
    padding: AppSpacing.md,
  },
  iconShell: {
    alignItems: "center",
    borderRadius: AppRadius.md,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
  },
  value: {
    fontSize: 22,
    lineHeight: 26,
  },
});
