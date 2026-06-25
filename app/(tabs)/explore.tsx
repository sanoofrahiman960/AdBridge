import { Button, Card, Input } from "@rneui/themed";
import { router, type Href } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BrandHeader } from "@/components/app/brand-header";
import { ProjectCard } from "@/components/app/dashboard/project-card";
import { ScreenShell } from "@/components/app/screen-shell";
import { SectionHeader } from "@/components/app/section-header";
import { ThemedText } from "@/components/themed-text";
import { AppRadius, AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

const filters = ["Drafts", "Scheduled", "Completed"] as const;

const campaignCards = [
  {
    ctaLabel: "Open brief",
    meta: "Briefing · Needs targeting + creative",
    progress: 0.3,
    status: "Draft",
    title: "Launch monsoon awareness",
    value: "$6,500",
  },
  {
    ctaLabel: "Review assets",
    meta: "Media buying · Awaiting provider approvals",
    progress: 0.58,
    status: "Scheduled",
    title: "Retail activation weekender",
    value: "$8,000",
  },
  {
    ctaLabel: "View wrap-up",
    meta: "Performance · Final report ready",
    progress: 1,
    status: "Completed",
    title: "Founders stories spotlight",
    value: "$3,200",
  },
];

export default function CampaignsScreen() {
  const { palette } = useTheme();
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("Drafts");
  const createCampaignHref = "/create-campaign" as Href;

  const visibleCards = campaignCards.filter((item) =>
    activeFilter === "Drafts"
      ? item.status === "Draft"
      : activeFilter === "Scheduled"
        ? item.status === "Scheduled"
        : item.status === "Completed",
  );

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <BrandHeader
        actionLabel="New"
        compact
        onActionPress={() => router.push(createCampaignHref)}
      />

      <Card
        containerStyle={[
          styles.heroCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <ThemedText style={styles.heroTitle} type="title">
          Create new campaign
        </ThemedText>
        <ThemedText style={[styles.heroBody, { color: palette.mutedText }]}>
          The campaign studio mirrors the Figma flow with a structured brief,
          budget inputs, and clean actions for draft or launch states.
        </ThemedText>
        <Input
          containerStyle={styles.searchContainer}
          inputContainerStyle={[
            styles.searchFrame,
            {
              backgroundColor: palette.background,
              borderColor: palette.border,
            },
          ]}
          inputStyle={{ color: palette.text, fontSize: 15 }}
          leftIcon={{ color: palette.mutedText, name: "search" }}
          placeholder="Search campaigns or briefs"
          placeholderTextColor={palette.mutedText}
        />
        <Button
          onPress={() => router.push(createCampaignHref)}
          title="Start New"
        />
      </Card>

      <View
        style={[styles.filterRow, { backgroundColor: palette.primaryMuted }]}
      >
        {filters.map((filter) => {
          const selected = activeFilter === filter;

          return (
            <Button
              buttonStyle={[
                styles.filterButton,
                selected && { backgroundColor: palette.primary },
              ]}
              key={filter}
              onPress={() => setActiveFilter(filter)}
              title={filter}
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

      <SectionHeader
        subtitle={`Showing ${activeFilter.toLowerCase()} campaign items and next actions.`}
        title="Campaign board"
      />

      <View style={styles.cardStack}>
        {visibleCards.map((item) => (
          <ProjectCard
            key={item.title}
            {...item}
            onPress={() => router.push(createCampaignHref)}
          />
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
  filterButton: {
    borderRadius: AppRadius.pill,
    flex: 1,
    minHeight: 42,
  },
  filterRow: {
    borderRadius: AppRadius.pill,
    flexDirection: "row",
    padding: 4,
  },
  heroBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  heroCard: {
    gap: AppSpacing.md,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 34,
  },
  searchContainer: {
    paddingHorizontal: 0,
  },
  searchFrame: {
    borderBottomWidth: 0,
    borderRadius: AppRadius.md,
    borderWidth: 1,
    minHeight: 52,
    paddingHorizontal: AppSpacing.sm,
  },
});
