import { Avatar, Button, Card, Icon } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

type ProviderCardProps = {
  audience: string;
  name: string;
  rating: string;
  specialty: string;
};

export function ProviderCard({
  audience,
  name,
  rating,
  specialty,
}: ProviderCardProps) {
  const { palette } = useTheme();

  return (
    <Card
      containerStyle={[
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.identity}>
          <Avatar
            containerStyle={{ backgroundColor: palette.primaryMuted }}
            icon={{ color: palette.primary, name: "person-outline" }}
            rounded
            size={42}
          />
          <View style={styles.copy}>
            <ThemedText style={styles.name} type="defaultSemiBold">
              {name}
            </ThemedText>
            <ThemedText
              style={[styles.specialty, { color: palette.mutedText }]}
            >
              {specialty}
            </ThemedText>
          </View>
        </View>
        <View style={styles.ratingRow}>
          <Icon color={palette.warning} name="star" size={18} />
          <ThemedText style={styles.rating} type="defaultSemiBold">
            {rating}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={[styles.audience, { color: palette.mutedText }]}>
        {audience}
      </ThemedText>

      <Button
        buttonStyle={styles.button}
        title="View profile"
        titleStyle={styles.buttonLabel}
        type="outline"
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  audience: {
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    minHeight: 44,
  },
  buttonLabel: {
    fontSize: 14,
  },
  card: {
    gap: AppSpacing.md,
    padding: AppSpacing.md,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  identity: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: AppSpacing.sm,
  },
  name: {
    fontSize: 15,
    lineHeight: 19,
  },
  rating: {
    fontSize: 14,
  },
  ratingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  specialty: {
    fontSize: 13,
    lineHeight: 18,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: AppSpacing.md,
  },
});
