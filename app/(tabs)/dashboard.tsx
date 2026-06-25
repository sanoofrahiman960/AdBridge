import { Button, Card } from "@rneui/themed";
import { router, type Href } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BrandHeader } from "@/components/app/brand-header";
import { MetricCard } from "@/components/app/dashboard/metric-card";
import { ProjectCard } from "@/components/app/dashboard/project-card";
import { ProviderCard } from "@/components/app/dashboard/provider-card";
import { ScreenShell } from "@/components/app/screen-shell";
import { SectionHeader } from "@/components/app/section-header";
import { ThemedText } from "@/components/themed-text";
import { AppRadius, AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

const advertiserMetrics = [
  {
    accent: "primary" as const,
    icon: "rocket-launch",
    label: "Active Campaigns",
    value: "12",
  },
  {
    accent: "success" as const,
    icon: "visibility",
    label: "Live Reach",
    value: "1.2M",
  },
  {
    accent: "warning" as const,
    icon: "payments",
    label: "Spend",
    value: "$14.2k",
  },
  { accent: "primary" as const, icon: "bolt", label: "CTR", value: "4.2%" },
];

const providerMetrics = [
  {
    accent: "primary" as const,
    icon: "assignment-late",
    label: "Open Briefs",
    value: "24",
  },
  {
    accent: "success" as const,
    icon: "mark-email-read",
    label: "Pending Bids",
    value: "08",
  },
  {
    accent: "warning" as const,
    icon: "payments",
    label: "Revenue",
    value: "$6.8k",
  },
  {
    accent: "primary" as const,
    icon: "thumb-up-off-alt",
    label: "Acceptance",
    value: "87%",
  },
];

const advertiserCampaigns = [
  {
    ctaLabel: "Manage campaign",
    meta: "Video · Kerala launch burst",
    progress: 0.72,
    status: "Live",
    title: "Monsoon awareness sprint",
    value: "$14.2k",
  },
  {
    ctaLabel: "Review providers",
    meta: "Retail · In-store screens",
    progress: 0.41,
    status: "Scaling",
    title: "Weekend retail activation",
    value: "$8.9k",
  },
];

const providerProjects = [
  {
    ctaLabel: "Bid now",
    meta: "E-commerce · 3 short-form placements",
    status: "Open",
    title: "UGC showcase for product reveal",
    value: "$1,500",
  },
  {
    ctaLabel: "Send proposal",
    meta: "Local retail · Outdoor signage",
    status: "Invite",
    title: "Festival storefront campaign",
    value: "$3,200",
  },
];

const topProviders = [
  {
    audience: "240k highly engaged lifestyle audience",
    name: "Lana Admin",
    rating: "4.9",
    specialty: "Lifestyle creator · Reels and stories",
  },
  {
    audience: "190k B2B and startup community",
    name: "Ravi Joseph",
    rating: "4.8",
    specialty: "Newsletter + founder content",
  },
];

export default function DashboardScreen() {
  const { palette } = useTheme();
  const [activeRole, setActiveRole] = useState<"advertiser" | "provider">(
    "advertiser",
  );
  const metrics =
    activeRole === "advertiser" ? advertiserMetrics : providerMetrics;
  const cards =
    activeRole === "advertiser" ? advertiserCampaigns : providerProjects;
  const createCampaignHref = "/create-campaign" as Href;

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <BrandHeader
        actionLabel="Logout"
        compact
        onActionPress={() => router.replace("/Login")}
      />

      <Card
        containerStyle={[
          styles.heroCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <View style={styles.heroTop}>
          <View style={styles.heroCopy}>
            <ThemedText style={[styles.kicker, { color: palette.primary }]}>
              Good morning, Alex.
            </ThemedText>
            <ThemedText style={styles.heroTitle} type="title">
              {activeRole === "advertiser"
                ? "Own your campaign pipeline."
                : "Turn briefs into momentum."}
            </ThemedText>
            <ThemedText style={[styles.heroBody, { color: palette.mutedText }]}>
              {activeRole === "advertiser"
                ? "Create campaigns, match with top providers, and keep delivery moving from one dashboard."
                : "Review open briefs, send proposals quickly, and stay on top of invite activity."}
            </ThemedText>
          </View>
          <Button
            buttonStyle={styles.heroButton}
            onPress={() => router.push(createCampaignHref)}
            title={
              activeRole === "advertiser"
                ? "Create New Campaign"
                : "Browse Projects"
            }
          />
        </View>

        <View
          style={[styles.roleToggle, { backgroundColor: palette.primaryMuted }]}
        >
          {(["advertiser", "provider"] as const).map((role) => {
            const selected = activeRole === role;

            return (
              <Button
                buttonStyle={[
                  styles.roleButton,
                  selected && { backgroundColor: palette.primary },
                ]}
                key={role}
                onPress={() => setActiveRole(role)}
                title={
                  role === "advertiser" ? "Advertiser view" : "Provider view"
                }
                titleStyle={{
                  color: selected ? "#fff" : palette.text,
                  fontSize: 13,
                  fontWeight: "600",
                }}
                type={selected ? "solid" : "clear"}
              />
            );
          })}
        </View>
      </Card>

      <SectionHeader
        subtitle="A compact snapshot styled after the Figma dashboard frames."
        title="Performance overview"
      />

      <View style={styles.metricGrid}>
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </View>

      <SectionHeader
        actionLabel={activeRole === "advertiser" ? "Open studio" : "See all"}
        onActionPress={() => router.push(createCampaignHref)}
        subtitle={
          activeRole === "advertiser"
            ? "Live work and optimizations"
            : "Open opportunities to act on"
        }
        title={
          activeRole === "advertiser" ? "Campaign focus" : "Available projects"
        }
      />

      <View style={styles.cardStack}>
        {cards.map((item) => (
          <ProjectCard
            key={item.title}
            {...item}
            onPress={() => router.push(createCampaignHref)}
          />
        ))}
      </View>

      <SectionHeader
        actionLabel="View all"
        subtitle="High-fit partners surfaced from the marketplace."
        title="Top providers"
      />

      <View style={styles.cardStack}>
        {topProviders.map((provider) => (
          <ProviderCard key={provider.name} {...provider} />
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  cardStack: {
    gap: AppSpacing.md,
  },
  content: {
    gap: AppSpacing.xl,
    paddingBottom: 32,
  },
  heroBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  heroButton: {
    minHeight: 48,
  },
  heroCard: {
    gap: AppSpacing.lg,
  },
  heroCopy: {
    gap: AppSpacing.sm,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 34,
  },
  heroTop: {
    gap: AppSpacing.lg,
  },
  kicker: {
    fontSize: 13,
    fontWeight: "700",
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: AppSpacing.md,
  },
  roleButton: {
    borderRadius: AppRadius.pill,
    flex: 1,
    minHeight: 44,
  },
  roleToggle: {
    borderRadius: AppRadius.pill,
    flexDirection: "row",
    padding: 4,
  },
});
