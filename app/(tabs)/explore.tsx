import { Button, Card, Input } from "@rneui/themed";
import { router } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useEffect, useMemo, useState } from "react";

import { BrandHeader } from "@/components/app/brand-header";
import { ProjectCard } from "@/components/app/dashboard/project-card";
import { ScreenShell } from "@/components/app/screen-shell";
import { SectionHeader } from "@/components/app/section-header";
import { ThemedText } from "@/components/themed-text";
import { routePaths, routes } from "@/constants/routes";
import { AppRadius, AppSpacing } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import {
  createApplication,
  fetchApplications,
  fetchCampaigns,
  fetchMyCreatorProfile,
  getApiErrorMessage,
} from "@/lib/api-client";
import {
  formatBudgetRange,
  formatStatusLabel,
  parseCurrencyInput,
} from "@/lib/formatters";
import { useTheme } from "@/contexts/theme-context";
import type { Application, Campaign, CreatorProfile } from "@/types/api";

export default function CampaignsScreen() {
  const { palette } = useTheme();
  const { token, user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [applicationCampaignId, setApplicationCampaignId] = useState<
    string | null
  >(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pitch, setPitch] = useState("");
  const [proposedFee, setProposedFee] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [timelineDays, setTimelineDays] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadCampaigns() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (user?.role === "creator" && token) {
          const [nextCampaigns, nextApplications, nextProfile] =
            await Promise.all([
              fetchCampaigns(),
              fetchApplications(token),
              fetchMyCreatorProfile(token),
            ]);

          if (!isActive) {
            return;
          }

          setCampaigns(nextCampaigns);
          setApplications(nextApplications);
          setCreatorProfile(nextProfile);
          return;
        }

        const nextCampaigns = await fetchCampaigns();

        if (!isActive) {
          return;
        }

        setCampaigns(nextCampaigns);
        setApplications([]);
        setCreatorProfile(null);
      } catch (error) {
        if (isActive) {
          setErrorMessage(getApiErrorMessage(error));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadCampaigns();

    return () => {
      isActive = false;
    };
  }, [refreshKey, token, user]);

  const statusFilters = useMemo(
    () => [
      "all",
      ...Array.from(new Set(campaigns.map((campaign) => campaign.status))),
    ],
    [campaigns],
  );
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleCards = campaigns.filter((campaign) => {
    const matchesStatus =
      activeFilter === "all" ? true : campaign.status === activeFilter;
    const matchesQuery =
      normalizedQuery.length === 0
        ? true
        : [
            campaign.title,
            campaign.brandName,
            campaign.description,
            campaign.platforms.join(" "),
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });
  const applicationByCampaignId = useMemo(
    () =>
      new Map(
        applications.map((application) => [application.campaignId, application]),
      ),
    [applications],
  );

  const handlePrimaryAction = () => {
    if (!user) {
      router.push(routes.login);
      return;
    }

    if (user.role === "advertiser") {
      router.push(routes.createCampaign);
      return;
    }

    router.push(creatorProfile ? routes.dashboard : routes.account);
  };

  const openApplicationComposer = (campaignId: string) => {
    if (applicationCampaignId === campaignId) {
      setApplicationCampaignId(null);
      return;
    }

    setApplicationCampaignId(campaignId);
    setPitch("");
    setProposedFee(
      creatorProfile?.rateCardMin ? String(creatorProfile.rateCardMin) : "",
    );
    setTimelineDays("");
    setFormErrorMessage(null);
  };

  const handleApplicationSubmit = async (campaignId: string) => {
    if (!token || user?.role !== "creator") {
      router.push(routes.login);
      return;
    }

    if (!creatorProfile) {
      router.push(routes.account);
      return;
    }

    if (!pitch.trim()) {
      setFormErrorMessage("Add a short pitch before applying.");
      return;
    }

    const parsedFee = parseCurrencyInput(proposedFee);
    const parsedTimeline = Number(timelineDays.replace(/[^\d]/g, ""));

    if (parsedFee <= 0 || parsedTimeline <= 0) {
      setFormErrorMessage("Enter a valid proposed fee and delivery timeline.");
      return;
    }

    setIsApplying(true);
    setFormErrorMessage(null);

    try {
      await createApplication(token, campaignId, {
        pitch: pitch.trim(),
        proposedFee: parsedFee,
        timelineDays: parsedTimeline,
      });

      const [nextCampaigns, nextApplications] = await Promise.all([
        fetchCampaigns(),
        fetchApplications(token),
      ]);

      setCampaigns(nextCampaigns);
      setApplications(nextApplications);
      setApplicationCampaignId(null);
      setPitch("");
      setProposedFee("");
      setTimelineDays("");
    } catch (error) {
      setFormErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <BrandHeader
        actionLabel={
          !user ? "Login" : user.role === "advertiser" ? "New" : "Open"
        }
        compact
        onActionPress={handlePrimaryAction}
      />

      <Card
        containerStyle={[
          styles.heroCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <ThemedText style={styles.heroTitle} type="title">
          {user?.role === "advertiser"
            ? "Create new campaign"
            : "Explore live campaigns"}
        </ThemedText>
        <ThemedText style={[styles.heroBody, { color: palette.mutedText }]}>
          Browse real marketplace listings served by the AdBridge API at
          `https://adbridge-2woq.onrender.com`, then jump into the matching
          workflow for your role.
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
          onChangeText={setSearchQuery}
          placeholder="Search campaigns, brands, or platforms"
          placeholderTextColor={palette.mutedText}
          value={searchQuery}
        />
        <Button
          onPress={handlePrimaryAction}
          title={
            user?.role === "advertiser"
              ? "Start New"
              : user
                ? creatorProfile
                  ? "Open Dashboard"
                  : "Complete Creator Profile"
                : "Sign in to continue"
          }
        />
      </Card>

      {user?.role === "creator" && !isLoading && !creatorProfile ? (
        <Card
          containerStyle={[
            styles.stateCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <ThemedText style={styles.stateTitle} type="defaultSemiBold">
            Complete your creator profile first
          </ThemedText>
          <ThemedText style={[styles.stateBody, { color: palette.mutedText }]}>
            The live API requires a creator profile before you can apply to open
            campaigns. Add your handle, bio, and rate card from the account tab.
          </ThemedText>
          <Button onPress={() => router.push(routes.account)} title="Open account" />
        </Card>
      ) : null}

      <View
        style={[styles.filterRow, { backgroundColor: palette.primaryMuted }]}
      >
        {statusFilters.map((filter) => {
          const selected = activeFilter === filter;

          return (
            <Button
              buttonStyle={[
                styles.filterButton,
                selected && { backgroundColor: palette.primary },
              ]}
              key={filter}
              onPress={() => setActiveFilter(filter)}
              title={filter === "all" ? "All" : formatStatusLabel(filter)}
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

      {errorMessage ? (
        <Card
          containerStyle={[
            styles.stateCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <ThemedText style={styles.stateTitle} type="defaultSemiBold">
            Campaign actions need attention
          </ThemedText>
          <ThemedText style={[styles.stateBody, { color: palette.mutedText }]}>
            {errorMessage}
          </ThemedText>
          <Button
            onPress={() => setRefreshKey((currentValue) => currentValue + 1)}
            title="Refresh campaigns"
          />
        </Card>
      ) : null}

      <SectionHeader
        subtitle={`Showing ${visibleCards.length} live campaign item${visibleCards.length === 1 ? "" : "s"} from the deployed backend.`}
        title="Campaign board"
      />

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={palette.primary} size="large" />
        </View>
      ) : (
        <View style={styles.cardStack}>
          {visibleCards.length > 0 ? (
            visibleCards.map((campaign) => {
              const existingApplication = applicationByCampaignId.get(campaign.id);
              const isOwnCampaign =
                user?.role === "advertiser" && campaign.advertiserId === user.id;
              const canApply =
                user?.role === "creator" &&
                !existingApplication &&
                Boolean(creatorProfile) &&
                campaign.status === "open";
              const isButtonDisabled =
                user?.role === "creator" &&
                !existingApplication &&
                Boolean(creatorProfile) &&
                campaign.status !== "open";

              return (
                <View key={campaign.id} style={styles.campaignStack}>
                  <ProjectCard
                    buttonDisabled={isButtonDisabled}
                    ctaLabel={
                      !user
                        ? "Sign in to continue"
                        : user.role === "advertiser"
                          ? isOwnCampaign
                            ? "Edit campaign"
                            : "Create campaign"
                          : existingApplication
                            ? `Application ${formatStatusLabel(existingApplication.status)}`
                            : creatorProfile
                              ? campaign.status === "open"
                                ? applicationCampaignId === campaign.id
                                  ? "Hide application form"
                                  : "Apply now"
                                : "Campaign closed"
                              : "Complete profile"
                    }
                    meta={`${campaign.brandName} - ${campaign.platforms.join(", ") || "Marketplace brief"}`}
                    onPress={() => {
                      if (!user) {
                        router.push(routes.login);
                        return;
                      }

                      if (user.role === "advertiser") {
                        if (isOwnCampaign) {
                          router.push({
                            pathname: routePaths.createCampaign,
                            params: { campaignId: campaign.id },
                          });
                          return;
                        }

                        router.push(routes.createCampaign);
                        return;
                      }

                      if (existingApplication) {
                        router.push(routes.dashboard);
                        return;
                      }

                      if (!creatorProfile) {
                        router.push(routes.account);
                        return;
                      }

                      if (campaign.status !== "open") {
                        return;
                      }

                      openApplicationComposer(campaign.id);
                    }}
                    status={formatStatusLabel(campaign.status)}
                    title={campaign.title}
                    value={formatBudgetRange(campaign.budgetMin, campaign.budgetMax)}
                  />

                  {canApply && applicationCampaignId === campaign.id ? (
                    <Card
                      containerStyle={[
                        styles.applicationCard,
                        {
                          backgroundColor: palette.card,
                          borderColor: palette.border,
                        },
                      ]}
                    >
                      <ThemedText style={styles.stateTitle} type="defaultSemiBold">
                        Submit your application
                      </ThemedText>
                      <ThemedText
                        style={[styles.stateBody, { color: palette.mutedText }]}
                      >
                        Send your pitch, quote, and expected timeline to the
                        advertiser through the live applications API.
                      </ThemedText>
                      <Input
                        containerStyle={styles.searchContainer}
                        inputContainerStyle={[
                          styles.textAreaFrame,
                          {
                            backgroundColor: palette.background,
                            borderColor: palette.border,
                          },
                        ]}
                        inputStyle={[styles.textArea, { color: palette.text }]}
                        label="Pitch"
                        labelStyle={[styles.label, { color: palette.text }]}
                        multiline
                        onChangeText={setPitch}
                        placeholder="Explain why your audience and format fit this campaign."
                        placeholderTextColor={palette.mutedText}
                        textAlignVertical="top"
                        value={pitch}
                      />
                      <View style={styles.inlineFieldRow}>
                        <Input
                          containerStyle={styles.inlineField}
                          inputContainerStyle={[
                            styles.searchFrame,
                            {
                              backgroundColor: palette.background,
                              borderColor: palette.border,
                            },
                          ]}
                          inputStyle={{ color: palette.text, fontSize: 15 }}
                          keyboardType="numeric"
                          label="Proposed fee"
                          labelStyle={[styles.label, { color: palette.text }]}
                          onChangeText={setProposedFee}
                          placeholder="1500"
                          placeholderTextColor={palette.mutedText}
                          value={proposedFee}
                        />
                        <Input
                          containerStyle={styles.inlineField}
                          inputContainerStyle={[
                            styles.searchFrame,
                            {
                              backgroundColor: palette.background,
                              borderColor: palette.border,
                            },
                          ]}
                          inputStyle={{ color: palette.text, fontSize: 15 }}
                          keyboardType="numeric"
                          label="Timeline days"
                          labelStyle={[styles.label, { color: palette.text }]}
                          onChangeText={setTimelineDays}
                          placeholder="7"
                          placeholderTextColor={palette.mutedText}
                          value={timelineDays}
                        />
                      </View>
                      <View style={styles.applicationActionRow}>
                        <Button
                          buttonStyle={[
                            styles.secondaryButton,
                            { borderColor: palette.border },
                          ]}
                          disabled={isApplying}
                          onPress={() => setApplicationCampaignId(null)}
                          title="Cancel"
                          titleStyle={{ color: palette.text }}
                          type="outline"
                        />
                        <Button
                          buttonStyle={styles.primaryButton}
                          loading={isApplying}
                          onPress={() => handleApplicationSubmit(campaign.id)}
                          title="Send application"
                        />
                      </View>
                      {formErrorMessage ? (
                        <ThemedText style={styles.formErrorText}>
                          {formErrorMessage}
                        </ThemedText>
                      ) : null}
                    </Card>
                  ) : null}
                </View>
              );
            })
          ) : (
            <Card
              containerStyle={[
                styles.stateCard,
                { backgroundColor: palette.card, borderColor: palette.border },
              ]}
            >
              <ThemedText style={styles.stateTitle} type="defaultSemiBold">
                No campaigns match this view
              </ThemedText>
              <ThemedText
                style={[styles.stateBody, { color: palette.mutedText }]}
              >
                Adjust the search or filter to explore more live listings.
              </ThemedText>
            </Card>
          )}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  applicationActionRow: {
    flexDirection: "row",
    gap: AppSpacing.sm,
  },
  applicationCard: {
    gap: AppSpacing.md,
  },
  campaignStack: {
    gap: AppSpacing.md,
  },
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
    flexWrap: "wrap",
    gap: 4,
    padding: 4,
  },
  formErrorText: {
    color: "#c74545",
    fontSize: 13,
    lineHeight: 18,
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
  inlineField: {
    flex: 1,
    paddingHorizontal: 0,
  },
  inlineFieldRow: {
    flexDirection: "row",
    gap: AppSpacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
  },
  primaryButton: {
    flex: 1,
    minHeight: 48,
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
  secondaryButton: {
    flex: 1,
    minHeight: 48,
  },
  stateBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  stateCard: {
    gap: AppSpacing.md,
  },
  stateTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  textArea: {
    minHeight: 110,
    paddingTop: 14,
  },
  textAreaFrame: {
    alignItems: "flex-start",
    borderBottomWidth: 0,
    borderRadius: AppRadius.md,
    borderWidth: 1,
    minHeight: 130,
    paddingHorizontal: AppSpacing.sm,
  },
});
