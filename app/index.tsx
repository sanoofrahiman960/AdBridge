import { Button, Card, Icon } from "@rneui/themed";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import type { UserRole } from "@/components/app/auth/login-card";
import { RoleTile } from "@/components/app/auth/role-tile";
import { BackgroundAccents } from "@/components/app/background-accents";
import { BrandHeader } from "@/components/app/brand-header";
import { ScreenShell } from "@/components/app/screen-shell";
import { ThemedText } from "@/components/themed-text";
import { routePaths, routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { AppRadius, AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

export default function IndexScreen() {
  const { palette } = useTheme();
  const { isAuthenticated } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("advertiser");

  if (isAuthenticated) {
    return <Redirect href={routes.dashboard} />;
  }

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <BackgroundAccents />
      <BrandHeader
        actionLabel="Sign in"
        onActionPress={() => router.push(routes.login)}
      />

      <View style={styles.heroCopy}>
        <ThemedText style={styles.eyebrow}>LAUNCH FASTER</ThemedText>
        <ThemedText style={styles.headline} type="title">
          Design your future narrative.
        </ThemedText>
        <ThemedText style={[styles.description, { color: palette.mutedText }]}>
          A clean marketplace flow for advertisers and media providers to
          discover campaigns, bid faster, and track performance in one place.
        </ThemedText>
      </View>

      <Card
        containerStyle={[
          styles.highlightCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <View style={styles.highlightHeader}>
          <View
            style={[
              styles.highlightIcon,
              { backgroundColor: palette.primaryMuted },
            ]}
          >
            <Icon color={palette.primary} name="insights" size={20} />
          </View>
          <View style={styles.highlightCopy}>
            <ThemedText style={styles.highlightTitle} type="defaultSemiBold">
              One interface, two roles
            </ThemedText>
            <ThemedText
              style={[styles.highlightBody, { color: palette.mutedText }]}
            >
              Jump from onboarding to login, dashboards, and campaign creation
              with a reusable component system.
            </ThemedText>
          </View>
        </View>
        <View style={styles.featureRow}>
          <View
            style={[
              styles.featurePill,
              { backgroundColor: palette.primaryMuted },
            ]}
          >
            <ThemedText
              style={[styles.featureValue, { color: palette.primary }]}
              type="defaultSemiBold"
            >
              24
            </ThemedText>
            <ThemedText
              style={[styles.featureLabel, { color: palette.mutedText }]}
            >
              Open briefs
            </ThemedText>
          </View>
          <View
            style={[
              styles.featurePill,
              { backgroundColor: palette.primaryMuted },
            ]}
          >
            <ThemedText
              style={[styles.featureValue, { color: palette.primary }]}
              type="defaultSemiBold"
            >
              1.2M
            </ThemedText>
            <ThemedText
              style={[styles.featureLabel, { color: palette.mutedText }]}
            >
              Reach tracked
            </ThemedText>
          </View>
        </View>
      </Card>

      <View style={styles.roleStack}>
        <RoleTile
          description="Plan campaigns, review provider matches, and monitor live delivery."
          icon="campaign"
          onPress={() => setSelectedRole("advertiser")}
          selected={selectedRole === "advertiser"}
          title="I am an Advertiser"
        />
        <RoleTile
          description="Browse briefs, bid on opportunities, and keep your inventory filled."
          icon="storefront"
          onPress={() => setSelectedRole("provider")}
          selected={selectedRole === "provider"}
          title="I am a Provider"
        />
      </View>

      <View style={styles.ctaStack}>
        <Button
          onPress={() =>
            router.push({
              pathname: routePaths.login,
              params: { role: selectedRole },
            })
          }
          title={`Continue as ${selectedRole === "advertiser" ? "Advertiser" : "Provider"}`}
        />
        <Button
          onPress={() => router.push(routes.campaigns)}
          title="Preview the app"
          titleStyle={{ color: palette.text }}
          type="outline"
        />
      </View>

      <View style={styles.footer}>
        <ThemedText style={[styles.footerText, { color: palette.mutedText }]}>
          Privacy Policy
        </ThemedText>
        <ThemedText
          style={[styles.footerDivider, { color: palette.mutedText }]}
        >
          /
        </ThemedText>
        <ThemedText style={[styles.footerText, { color: palette.mutedText }]}>
          Terms of Service
        </ThemedText>
        <ThemedText
          style={[styles.footerDivider, { color: palette.mutedText }]}
        >
          /
        </ThemedText>
        <ThemedText style={[styles.footerText, { color: palette.mutedText }]}>
          Support
        </ThemedText>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: AppSpacing.xl,
    paddingBottom: 40,
  },
  ctaStack: {
    gap: AppSpacing.sm,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  eyebrow: {
    color: "#2f80ed",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.1,
  },
  featureLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  featurePill: {
    borderRadius: AppRadius.lg,
    flex: 1,
    gap: 4,
    padding: AppSpacing.md,
  },
  featureRow: {
    flexDirection: "row",
    gap: AppSpacing.sm,
  },
  featureValue: {
    fontSize: 22,
    lineHeight: 26,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
    marginTop: 4,
  },
  footerDivider: {
    fontSize: 12,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
  },
  headline: {
    fontSize: 40,
    lineHeight: 44,
  },
  heroCopy: {
    gap: AppSpacing.sm,
  },
  highlightBody: {
    fontSize: 13,
    lineHeight: 19,
  },
  highlightCard: {
    gap: AppSpacing.md,
  },
  highlightCopy: {
    flex: 1,
    gap: 4,
  },
  highlightHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: AppSpacing.md,
  },
  highlightIcon: {
    alignItems: "center",
    borderRadius: AppRadius.md,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  highlightTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  roleStack: {
    gap: AppSpacing.sm,
  },
});
