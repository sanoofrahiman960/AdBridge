import { Button } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

type SectionHeaderProps = {
  actionLabel?: string;
  onActionPress?: () => void;
  subtitle?: string;
  title: string;
};

export function SectionHeader({
  actionLabel,
  onActionPress,
  subtitle,
  title,
}: SectionHeaderProps) {
  const { palette } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <ThemedText style={styles.title} type="defaultSemiBold">
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText style={[styles.subtitle, { color: palette.mutedText }]}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {actionLabel ? (
        <Button
          onPress={onActionPress}
          title={actionLabel}
          titleStyle={[styles.actionLabel, { color: palette.primary }]}
          type="clear"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  actionLabel: {
    fontSize: 14,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: AppSpacing.md,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
  },
});
