import { Button, Card, Chip, LinearProgress } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

type ProjectCardProps = {
  ctaLabel: string;
  meta: string;
  onPress?: () => void;
  progress?: number;
  status: string;
  title: string;
  value: string;
};

export function ProjectCard({
  ctaLabel,
  meta,
  onPress,
  progress,
  status,
  title,
  value,
}: ProjectCardProps) {
  const { palette } = useTheme();

  return (
    <Card
      containerStyle={[
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <ThemedText style={styles.title} type="defaultSemiBold">
            {title}
          </ThemedText>
          <ThemedText style={[styles.meta, { color: palette.mutedText }]}>
            {meta}
          </ThemedText>
        </View>
        <Chip
          buttonStyle={[styles.chip, { backgroundColor: palette.primaryMuted }]}
          title={status}
          titleStyle={[styles.chipLabel, { color: palette.primary }]}
        />
      </View>

      <ThemedText style={styles.value} type="subtitle">
        {value}
      </ThemedText>

      {typeof progress === "number" ? (
        <View style={styles.progressWrap}>
          <LinearProgress
            color={palette.primary}
            style={styles.progressBar}
            value={progress}
            variant="determinate"
          />
          <ThemedText
            style={[styles.progressLabel, { color: palette.mutedText }]}
          >
            {Math.round(progress * 100)}% delivered
          </ThemedText>
        </View>
      ) : null}

      <Button buttonStyle={styles.button} onPress={onPress} title={ctaLabel} />
    </Card>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
  },
  card: {
    gap: AppSpacing.md,
    padding: AppSpacing.md,
  },
  chip: {
    borderRadius: 999,
    minHeight: 30,
    paddingHorizontal: 8,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  meta: {
    fontSize: 13,
    lineHeight: 18,
  },
  progressBar: {
    borderRadius: 999,
    height: 8,
  },
  progressLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  progressWrap: {
    gap: AppSpacing.xs,
  },
  title: {
    fontSize: 16,
    lineHeight: 21,
  },
  topRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: AppSpacing.md,
  },
  value: {
    fontSize: 26,
    lineHeight: 30,
  },
});
