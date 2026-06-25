import { Avatar, Button, Card, ListItem } from "@rneui/themed";
import { router, type Href } from "expo-router";
import { StyleSheet, View } from "react-native";

import { BrandHeader } from "@/components/app/brand-header";
import { MetricCard } from "@/components/app/dashboard/metric-card";
import { ScreenShell } from "@/components/app/screen-shell";
import { SectionHeader } from "@/components/app/section-header";
import { ThemedText } from "@/components/themed-text";
import { AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

const accountItems = [
  {
    icon: "notifications-none",
    title: "Notifications",
    subtitle: "Campaign updates, bid alerts, and daily summaries",
  },
  {
    icon: "security",
    title: "Security",
    subtitle: "Two-factor auth and session controls",
  },
  {
    icon: "payments",
    title: "Billing & payouts",
    subtitle: "Invoices, card methods, and provider settlements",
  },
];

export default function AccountScreen() {
  const { palette } = useTheme();
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
          styles.profileCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <View style={styles.profileTop}>
          <Avatar
            containerStyle={{ backgroundColor: palette.primaryMuted }}
            icon={{ color: palette.primary, name: "person-outline" }}
            rounded
            size={56}
          />
          <View style={styles.profileCopy}>
            <ThemedText style={styles.name} type="defaultSemiBold">
              Alex Carter
            </ThemedText>
            <ThemedText style={[styles.role, { color: palette.mutedText }]}>
              Advertiser Lead · AdBridge Team
            </ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.profileBody, { color: palette.mutedText }]}>
          This profile section rounds out the Figma concept with settings,
          ownership, and a quick summary of account health.
        </ThemedText>
        <Button
          onPress={() => router.push(createCampaignHref)}
          title="Open studio"
        />
      </Card>

      <SectionHeader
        subtitle="High-level health and access."
        title="Account snapshot"
      />
      <View style={styles.metricGrid}>
        <MetricCard
          accent="primary"
          icon="verified-user"
          label="Access"
          value="Owner"
        />
        <MetricCard
          accent="success"
          icon="check-circle-outline"
          label="Status"
          value="Healthy"
        />
      </View>

      <SectionHeader
        subtitle="Core settings surfaced as list items."
        title="Preferences"
      />
      <Card
        containerStyle={[
          styles.listCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        {accountItems.map((item, index) => (
          <ListItem
            Component={View}
            containerStyle={[
              styles.listItem,
              {
                borderBottomColor:
                  index === accountItems.length - 1
                    ? "transparent"
                    : palette.border,
                backgroundColor: "transparent",
              },
            ]}
            key={item.title}
          >
            <ListItem.Content>
              <ListItem.Title
                style={[styles.listTitle, { color: palette.text }]}
              >
                {item.title}
              </ListItem.Title>
              <ListItem.Subtitle
                style={[styles.listSubtitle, { color: palette.mutedText }]}
              >
                {item.subtitle}
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron color={palette.mutedText} />
          </ListItem>
        ))}
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: AppSpacing.xl,
    paddingBottom: 32,
  },
  listCard: {
    padding: 0,
  },
  listItem: {
    borderBottomWidth: 1,
    paddingHorizontal: AppSpacing.md,
    paddingVertical: AppSpacing.md,
  },
  listSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  metricGrid: {
    flexDirection: "row",
    gap: AppSpacing.md,
  },
  name: {
    fontSize: 20,
    lineHeight: 24,
  },
  profileBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  profileCard: {
    gap: AppSpacing.md,
  },
  profileCopy: {
    flex: 1,
    gap: 4,
  },
  profileTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: AppSpacing.md,
  },
  role: {
    fontSize: 13,
    lineHeight: 18,
  },
});
