import { Button, Card } from "@rneui/themed";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { StyleSheet, View } from "react-native";

import { LoginCard, type UserRole } from "@/components/app/auth/login-card";
import { BackgroundAccents } from "@/components/app/background-accents";
import { BrandHeader } from "@/components/app/brand-header";
import { ScreenShell } from "@/components/app/screen-shell";
import { ThemedText } from "@/components/themed-text";
import { AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

export default function LoginScreen() {
  const { palette } = useTheme();
  const params = useLocalSearchParams<{ role?: string }>();
  const initialRole = params.role === "provider" ? "provider" : "advertiser";
  const dashboardHref = "/dashboard" as Href;

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <BackgroundAccents />
      <BrandHeader
        actionLabel="Back"
        compact
        onActionPress={() => router.back()}
      />

      <View style={styles.heroCopy}>
        <ThemedText style={styles.kicker}>AUTHENTICATION</ThemedText>
        <ThemedText style={styles.headline} type="title">
          Unified login for every role.
        </ThemedText>
        <ThemedText style={[styles.description, { color: palette.mutedText }]}>
          Switch between advertiser and provider access from the same polished
          auth surface.
        </ThemedText>
      </View>

      <LoginCard
        initialRole={initialRole as UserRole}
        onSubmit={() => router.replace(dashboardHref)}
      />

      <Card
        containerStyle={[
          styles.footerCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <ThemedText style={styles.footerTitle} type="defaultSemiBold">
          Need help getting started?
        </ThemedText>
        <ThemedText style={[styles.footerBody, { color: palette.mutedText }]}>
          Explore dashboards first, then come back and wire the form to your
          auth backend.
        </ThemedText>
        <Button
          onPress={() => router.replace(dashboardHref)}
          title="Open dashboard preview"
          titleStyle={{ color: palette.text }}
          type="outline"
        />
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: AppSpacing.xl,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  footerBody: {
    fontSize: 13,
    lineHeight: 19,
  },
  footerCard: {
    gap: AppSpacing.md,
  },
  footerTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  headline: {
    fontSize: 34,
    lineHeight: 38,
  },
  heroCopy: {
    gap: AppSpacing.sm,
  },
  kicker: {
    color: "#2f80ed",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
