import { Button, Icon } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

import { ThemeToggle } from "@/components/app/theme-toggle";
import { ThemedText } from "@/components/themed-text";
import { AppRadius, AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

type BrandHeaderProps = {
  actionLabel?: string;
  compact?: boolean;
  onActionPress?: () => void;
  subtitle?: string;
};

export function BrandHeader({
  actionLabel,
  compact = false,
  onActionPress,
  subtitle = "Marketplace for advertisers and providers",
}: BrandHeaderProps) {
  const { palette } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.brandWrap}>
        <View
          style={[styles.logoShell, { backgroundColor: palette.primaryMuted }]}
        >
          <View
            style={[styles.logoDot, { backgroundColor: palette.primary }]}
          />
          <Icon
            color={palette.primary}
            name="stacked-bar-chart"
            size={compact ? 18 : 22}
          />
        </View>
        <View style={styles.textWrap}>
          <ThemedText
            style={[styles.brand, compact && styles.compactBrand]}
            type="defaultSemiBold"
          >
            AdBridge
          </ThemedText>
          <ThemedText
            style={[
              styles.subtitle,
              { color: palette.mutedText },
              compact && styles.compactSubtitle,
            ]}
          >
            {subtitle}
          </ThemedText>
        </View>
      </View>
      <View style={styles.actions}>
        <ThemeToggle />
        {actionLabel ? (
          <Button
            onPress={onActionPress}
            title={actionLabel}
            titleStyle={[styles.actionLabel, { color: palette.primary }]}
            type="clear"
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionLabel: {
    fontSize: 14,
  },
  brand: {
    fontSize: 18,
    lineHeight: 22,
  },
  brandWrap: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: AppSpacing.md,
  },
  compactBrand: {
    fontSize: 16,
    lineHeight: 20,
  },
  compactSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  logoDot: {
    borderRadius: 4,
    height: 8,
    left: 10,
    position: "absolute",
    top: 10,
    width: 8,
  },
  logoShell: {
    alignItems: "center",
    borderRadius: AppRadius.md,
    height: 52,
    justifyContent: "center",
    position: "relative",
    width: 52,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: AppSpacing.md,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: AppSpacing.sm,
  },
});
