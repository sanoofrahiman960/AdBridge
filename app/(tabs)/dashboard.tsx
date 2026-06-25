import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, Card } from "@rneui/themed";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";

import { getRoleLabel } from "@/constants/auth";
import { routePaths, routes } from "@/constants/routes";
import { BrandHeader } from "@/components/app/brand-header";
import { MetricCard } from "@/components/app/dashboard/metric-card";
import { ProjectCard } from "@/components/app/dashboard/project-card";
import { ProviderCard } from "@/components/app/dashboard/provider-card";
import { ScreenShell } from "@/components/app/screen-shell";
import { SectionHeader } from "@/components/app/section-header";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/auth-context";
import { AppRadius, AppSpacing } from "@/constants/theme";
import {
  fetchApplications,
  fetchCampaigns,
  fetchCreators,
  fetchMyCampaigns,
  getApiErrorMessage,
  updateApplicationStatus,
} from "@/lib/api-client";
import {
  formatBudgetRange,
  formatCompactNumber,
  formatCurrency,
  formatStatusLabel,
} from "@/lib/formatters";
import { useTheme } from "@/contexts/theme-context";
import type {
  Application,
  ApplicationStatus,
  Campaign,
  CreatorProfile,
} from "@/types/api";

type DashboardMetric = {
  accent?: "primary" | "success" | "warning";
  icon: string;
  label: string;
  value: string;
};

type DashboardCard = {
  buttonDisabled?: boolean;
  ctaLabel: string;
  meta: string;
  onPress?: () => void;
  status: string;
  title: string;
  value: string;
};

export default function DashboardScreen() {
  const { palette } = useTheme();
  const { logout, token, user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingApplicationKey, setUpdatingApplicationKey] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!user || !token) {
      return;
    }

    const sessionToken = token;
    const sessionUser = user;
    let isActive = true;

    async function loadDashboard() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (sessionUser.role === "advertiser") {
          const [campaignItems, applicationItems, creatorItems] =
            await Promise.all([
              fetchMyCampaigns(sessionToken),
              fetchApplications(sessionToken),
              fetchCreators(),
            ]);

          if (!isActive) {
            return;
          }

          setCampaigns(campaignItems);
          setApplications(applicationItems);
          setCreators(creatorItems);
          return;
        }

        const [campaignItems, applicationItems] = await Promise.all([
          fetchCampaigns(),
          fetchApplications(sessionToken),
        ]);

        if (!isActive) {
          return;
        }

        setCampaigns(campaignItems);
        setApplications(applicationItems);
        setCreators([]);
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

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, [refreshKey, token, user]);

  if (!user || !token) {
    return <Redirect href={routes.login} />;
  }

  const isAdvertiser = user.role === "advertiser";
  const activeRoleLabel = getRoleLabel(user.role).toLowerCase();
  const campaignCards: DashboardCard[] = isAdvertiser
    ? campaigns.slice(0, 3).map((campaign) => ({
        ctaLabel: "Edit campaign",
        meta: `${campaign.brandName} - ${campaign.applicationsCount} application${campaign.applicationsCount === 1 ? "" : "s"}`,
        onPress: () =>
          router.push({
            pathname: routePaths.createCampaign,
            params: { campaignId: campaign.id },
          }),
        status: formatStatusLabel(campaign.status),
        title: campaign.title,
        value: formatBudgetRange(campaign.budgetMin, campaign.budgetMax),
      }))
    : applications.length > 0
      ? applications.slice(0, 3).map((application) => ({
          ctaLabel: "Campaign catalog",
          meta: application.campaign
            ? `${application.campaign.brandName} - ${application.timelineDays} day timeline`
            : `${application.timelineDays} day timeline`,
          onPress: () => router.push(routes.campaigns),
          status: formatStatusLabel(application.status),
          title: application.campaign?.title ?? "Campaign application",
          value: formatCurrency(application.proposedFee),
        }))
      : campaigns
          .filter((campaign) => campaign.status === "open")
          .slice(0, 3)
          .map((campaign) => ({
            ctaLabel: "Browse catalog",
            meta: `${campaign.brandName} - ${campaign.platforms.join(", ") || "Open brief"}`,
            onPress: () => router.push(routes.campaigns),
            status: formatStatusLabel(campaign.status),
            title: campaign.title,
            value: formatBudgetRange(campaign.budgetMin, campaign.budgetMax),
          }));

  const totalApplicationCount = campaigns.reduce(
    (sum, campaign) => sum + campaign.applicationsCount,
    0,
  );
  const highestBudget = campaigns.reduce(
    (maxValue, campaign) =>
      Math.max(maxValue, campaign.budgetMax, campaign.budgetMin),
    0,
  );
  const metrics: DashboardMetric[] = isAdvertiser
    ? [
        {
          accent: "primary",
          icon: "campaign",
          label: "Active Campaigns",
          value: String(campaigns.length),
        },
        {
          accent: "success",
          icon: "groups",
          label: "Creator Applications",
          value: formatCompactNumber(totalApplicationCount),
        },
        {
          accent: "warning",
          icon: "bolt",
          label: "Open Campaigns",
          value: String(campaigns.filter((campaign) => campaign.status === "open").length),
        },
        {
          accent: "primary",
          icon: "payments",
          label: "Budget Ceiling",
          value: highestBudget > 0 ? formatCurrency(highestBudget) : "$0",
        },
      ]
    : [
        {
          accent: "primary",
          icon: "assignment-late",
          label: "Open Briefs",
          value: String(campaigns.filter((campaign) => campaign.status === "open").length),
        },
        {
          accent: "success",
          icon: "send",
          label: "My Applications",
          value: String(applications.length),
        },
        {
          accent: "warning",
          icon: "thumb-up-off-alt",
          label: "Shortlisted",
          value: String(
            applications.filter((application) =>
              ["shortlisted", "accepted"].includes(application.status),
            ).length,
          ),
        },
        {
          accent: "primary",
          icon: "payments",
          label: "Quoted Fees",
          value:
            applications.length > 0
              ? formatCurrency(
                  Math.round(
                    applications.reduce(
                      (sum, application) => sum + application.proposedFee,
                      0,
                    ) / applications.length,
                  ),
                )
              : "$0",
        },
      ];

  const handleLogout = () => {
    logout();
    router.replace(routes.login);
  };

  const handleApplicationStatusUpdate = async (
    applicationId: string,
    status: ApplicationStatus,
  ) => {
    if (!token || !isAdvertiser) {
      return;
    }

    const nextUpdateKey = `${applicationId}:${status}`;
    setUpdatingApplicationKey(nextUpdateKey);
    setErrorMessage(null);

    try {
      const updatedApplication = await updateApplicationStatus(
        token,
        applicationId,
        status,
      );

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? { ...application, ...updatedApplication }
            : application,
        ),
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setUpdatingApplicationKey(null);
    }
  };

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <BrandHeader
        actionLabel="Logout"
        compact
        onActionPress={handleLogout}
        subtitle={`Signed in as ${activeRoleLabel}`}
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
              Welcome back, {user.name.split(" ")[0]}.
            </ThemedText>
            <ThemedText style={styles.heroTitle} type="title">
              {isAdvertiser
                ? "Own your campaign pipeline."
                : "Turn live briefs into momentum."}
            </ThemedText>
            <ThemedText style={[styles.heroBody, { color: palette.mutedText }]}>
              {isAdvertiser
                ? "Your real campaign listings, creator responses, and marketplace data now load from the deployed AdBridge API."
                : "Track your live applications and browse open opportunities from the deployed AdBridge marketplace backend."}
            </ThemedText>
          </View>
          <Button
            buttonStyle={styles.heroButton}
            onPress={() =>
              router.push(isAdvertiser ? routes.createCampaign : routes.campaigns)
            }
            title={isAdvertiser ? "Create New Campaign" : "Browse Campaigns"}
          />
        </View>

        <View
          style={[styles.roleToggle, { backgroundColor: palette.primaryMuted }]}
        >
          <Button
            buttonStyle={[styles.roleButton, { backgroundColor: palette.primary }]}
            title={`${getRoleLabel(user.role)} view`}
            titleStyle={styles.selectedRoleLabel}
          />
        </View>
      </Card>

      {errorMessage ? (
        <Card
          containerStyle={[
            styles.stateCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <ThemedText style={styles.stateTitle} type="defaultSemiBold">
            Dashboard data could not be loaded
          </ThemedText>
          <ThemedText style={[styles.stateBody, { color: palette.mutedText }]}>
            {errorMessage}
          </ThemedText>
          <Button
            onPress={() => setRefreshKey((currentValue) => currentValue + 1)}
            title="Try again"
          />
        </Card>
      ) : null}

      <SectionHeader
        subtitle="Live metrics calculated from the deployed backend."
        title="Performance overview"
      />

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={palette.primary} size="large" />
        </View>
      ) : (
        <>
          <View style={styles.metricGrid}>
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </View>

          <SectionHeader
            actionLabel={isAdvertiser ? "Open studio" : "See catalog"}
            onActionPress={() =>
              router.push(isAdvertiser ? routes.createCampaign : routes.campaigns)
            }
            subtitle={
              isAdvertiser
                ? "Your live listings and marketplace activity."
                : "Applications and open opportunities from the marketplace."
            }
            title={isAdvertiser ? "Campaign focus" : "Application focus"}
          />

          <View style={styles.cardStack}>
            {campaignCards.length > 0 ? (
              campaignCards.map((item) => (
                <ProjectCard key={`${item.title}-${item.status}`} {...item} />
              ))
            ) : (
              <Card
                containerStyle={[
                  styles.stateCard,
                  { backgroundColor: palette.card, borderColor: palette.border },
                ]}
              >
                <ThemedText style={styles.stateTitle} type="defaultSemiBold">
                  No live items yet
                </ThemedText>
                <ThemedText
                  style={[styles.stateBody, { color: palette.mutedText }]}
                >
                  {isAdvertiser
                    ? "Create your first campaign to populate the dashboard."
                    : "Your applications will appear here once you start engaging with campaign briefs."}
                </ThemedText>
              </Card>
            )}
          </View>

          {isAdvertiser ? (
            <>
              <SectionHeader
                subtitle="Move real creator submissions through your review pipeline."
                title="Application inbox"
              />

              <View style={styles.cardStack}>
                {applications.length > 0 ? (
                  applications.map((application) => (
                    <Card
                      containerStyle={[
                        styles.stateCard,
                        {
                          backgroundColor: palette.card,
                          borderColor: palette.border,
                        },
                      ]}
                      key={application.id}
                    >
                      <View style={styles.applicationHeader}>
                        <View style={styles.applicationCopy}>
                          <ThemedText
                            style={styles.stateTitle}
                            type="defaultSemiBold"
                          >
                            {application.creatorProfile?.displayName ??
                              application.creator?.name ??
                              "Creator application"}
                          </ThemedText>
                          <ThemedText
                            style={[
                              styles.stateBody,
                              { color: palette.mutedText },
                            ]}
                          >
                            {application.campaign?.title ?? "Campaign"} -{" "}
                            {formatCurrency(application.proposedFee)} -{" "}
                            {application.timelineDays} days
                          </ThemedText>
                        </View>
                        <ThemedText
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: palette.primaryMuted,
                              color: palette.primary,
                            },
                          ]}
                        >
                          {formatStatusLabel(application.status)}
                        </ThemedText>
                      </View>

                      <ThemedText
                        style={[styles.stateBody, { color: palette.text }]}
                      >
                        {application.pitch}
                      </ThemedText>

                      <View style={styles.statusActionRow}>
                        {applicationStatuses.map((statusOption) => {
                          const isSelected = application.status === statusOption;
                          const isUpdating =
                            updatingApplicationKey ===
                            `${application.id}:${statusOption}`;

                          return (
                            <Button
                              buttonStyle={[
                                styles.statusButton,
                                isSelected && {
                                  backgroundColor: palette.primary,
                                  borderColor: palette.primary,
                                },
                              ]}
                              disabled={
                                Boolean(updatingApplicationKey) || isSelected
                              }
                              key={`${application.id}-${statusOption}`}
                              loading={isUpdating}
                              onPress={() =>
                                handleApplicationStatusUpdate(
                                  application.id,
                                  statusOption,
                                )
                              }
                              title={formatStatusLabel(statusOption)}
                              titleStyle={{
                                color: isSelected ? "#ffffff" : palette.text,
                                fontSize: 12,
                                fontWeight: "600",
                              }}
                              type={isSelected ? "solid" : "outline"}
                            />
                          );
                        })}
                      </View>
                    </Card>
                  ))
                ) : (
                  <Card
                    containerStyle={[
                      styles.stateCard,
                      { backgroundColor: palette.card, borderColor: palette.border },
                    ]}
                  >
                    <ThemedText style={styles.stateTitle} type="defaultSemiBold">
                      No creator applications yet
                    </ThemedText>
                    <ThemedText
                      style={[styles.stateBody, { color: palette.mutedText }]}
                    >
                      Applications submitted against your live campaigns will
                      appear here for review.
                    </ThemedText>
                  </Card>
                )}
              </View>

              <SectionHeader
                actionLabel="View all"
                subtitle="Creator profiles returned from the live marketplace API."
                title="Top providers"
              />

              <View style={styles.cardStack}>
                {creators.slice(0, 3).map((provider) => (
                  <ProviderCard
                    audience={`${formatCompactNumber(
                      provider.platforms.reduce(
                        (sum, platform) => sum + platform.followers,
                        0,
                      ),
                    )} followers across ${provider.platforms.length} platform${provider.platforms.length === 1 ? "" : "s"}`}
                    key={provider.id}
                    name={provider.displayName}
                    rating={provider.verified ? "Verified" : "Open"}
                    specialty={provider.bio}
                  />
                ))}
              </View>
            </>
          ) : null}
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  applicationCopy: {
    flex: 1,
    gap: 4,
  },
  applicationHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: AppSpacing.md,
    justifyContent: "space-between",
  },
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
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
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
  selectedRoleLabel: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
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
  statusActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: AppSpacing.sm,
  },
  statusBadge: {
    borderRadius: AppRadius.pill,
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusButton: {
    borderRadius: AppRadius.pill,
    minHeight: 38,
  },
});

const applicationStatuses: ApplicationStatus[] = [
  "pending",
  "shortlisted",
  "accepted",
  "rejected",
];
