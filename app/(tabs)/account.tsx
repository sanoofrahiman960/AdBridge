import {
  Avatar,
  Button,
  Card,
  Icon,
  Input,
  ListItem,
} from "@rneui/themed";
import { Redirect, router } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";

import { getRoleLabel } from "@/constants/auth";
import { routes } from "@/constants/routes";
import { BrandHeader } from "@/components/app/brand-header";
import { MetricCard } from "@/components/app/dashboard/metric-card";
import { ScreenShell } from "@/components/app/screen-shell";
import { SectionHeader } from "@/components/app/section-header";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/auth-context";
import { AppRadius, AppSpacing } from "@/constants/theme";
import {
  fetchApplications,
  fetchMyCampaigns,
  fetchMyCreatorProfile,
  getApiErrorMessage,
  upsertCreatorProfile,
} from "@/lib/api-client";
import { formatCurrency, parseCurrencyInput } from "@/lib/formatters";
import { useTheme } from "@/contexts/theme-context";
import type { Application, Campaign, CreatorPlatform, CreatorProfile } from "@/types/api";

type AccountItem = {
  icon: string;
  subtitle: string;
  title: string;
};

export default function AccountScreen() {
  const { palette } = useTheme();
  const { logout, refreshUser, token, user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [categoriesInput, setCategoriesInput] = useState("");
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(
    null,
  );
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [handle, setHandle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingSession, setIsRefreshingSession] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [platformsInput, setPlatformsInput] = useState("");
  const [rateCardMin, setRateCardMin] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user || !token) {
      return;
    }

    const sessionToken = token;
    const sessionUser = user;
    let isActive = true;

    async function loadAccountData() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (sessionUser.role === "advertiser") {
          const [campaignItems, applicationItems] = await Promise.all([
            fetchMyCampaigns(sessionToken),
            fetchApplications(sessionToken),
          ]);

          if (!isActive) {
            return;
          }

          setCampaigns(campaignItems);
          setApplications(applicationItems);
          setCreatorProfile(null);
          setHandle("");
          setDisplayName("");
          setBio("");
          setRateCardMin("");
          setCategoriesInput("");
          setPlatformsInput("");
          return;
        }

        const [applicationItems, profile] = await Promise.all([
          fetchApplications(sessionToken),
          fetchMyCreatorProfile(sessionToken),
        ]);

        if (!isActive) {
          return;
        }

        setApplications(applicationItems);
        setCreatorProfile(profile);
        setCampaigns([]);
        setHandle(profile?.handle ?? "");
        setDisplayName(profile?.displayName ?? sessionUser.name);
        setBio(profile?.bio ?? "");
        setRateCardMin(profile ? String(profile.rateCardMin) : "");
        setCategoriesInput(profile?.categories.join(", ") ?? "");
        setPlatformsInput(profile ? profile.platforms.map((item) => item.name).join(", ") : "");
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

    loadAccountData();

    return () => {
      isActive = false;
    };
  }, [refreshKey, token, user]);

  if (!user || !token) {
    return <Redirect href={routes.login} />;
  }

  const roleLabel = getRoleLabel(user.role);
  const locationLine =
    user.role === "advertiser"
      ? user.companyName ?? user.email
      : creatorProfile?.handle ?? user.city ?? user.email;

  const accountItems: AccountItem[] =
    user.role === "advertiser"
      ? [
          {
            icon: "mail-outline",
            title: "Email",
            subtitle: user.email,
          },
          {
            icon: "business-center",
            title: "Company",
            subtitle: user.companyName ?? "No company name saved yet",
          },
          {
            icon: "campaign",
            title: "Live campaigns",
            subtitle: `${campaigns.length} campaign${campaigns.length === 1 ? "" : "s"} returned from the backend`,
          },
        ]
      : [
          {
            icon: "mail-outline",
            title: "Email",
            subtitle: user.email,
          },
          {
            icon: "alternate-email",
            title: "Creator handle",
            subtitle: creatorProfile?.handle ?? "Create a profile to personalize your applications",
          },
          {
            icon: "insights",
            title: "Rate card",
            subtitle: creatorProfile
              ? formatCurrency(creatorProfile.rateCardMin)
              : "Not set yet",
          },
        ];
  const creatorMetrics = [
    {
      accent: "primary" as const,
      icon: "verified-user",
      label: "Access",
      value: roleLabel,
    },
    {
      accent: "success" as const,
      icon: "mark-email-read",
      label: user.role === "advertiser" ? "Applications" : "My bids",
      value: String(applications.length),
    },
  ];

  const handleLogout = () => {
    logout();
    router.replace(routes.login);
  };

  const handleSessionRefresh = async () => {
    setIsRefreshingSession(true);
    setErrorMessage(null);

    try {
      await refreshUser();
      setRefreshKey((currentValue) => currentValue + 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to refresh session.",
      );
    } finally {
      setIsRefreshingSession(false);
    }
  };

  const handleSaveCreatorProfile = async () => {
    if (user.role !== "creator") {
      return;
    }

    if (!handle.trim() || !displayName.trim() || !bio.trim()) {
      setErrorMessage("Handle, display name, and bio are required.");
      return;
    }

    setIsSavingProfile(true);
    setErrorMessage(null);

    try {
      const updatedProfile = await upsertCreatorProfile(token, {
        bio: bio.trim(),
        categories: parseCommaSeparatedList(categoriesInput),
        displayName: displayName.trim(),
        handle: handle.trim(),
        platforms: parsePlatforms(platformsInput),
        rateCardMin: parseCurrencyInput(rateCardMin),
      });

      setCreatorProfile(updatedProfile);
      setHandle(updatedProfile.handle);
      setDisplayName(updatedProfile.displayName);
      setBio(updatedProfile.bio);
      setRateCardMin(String(updatedProfile.rateCardMin));
      setCategoriesInput(updatedProfile.categories.join(", "));
      setPlatformsInput(updatedProfile.platforms.map((item) => item.name).join(", "));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <BrandHeader
        actionLabel="Logout"
        compact
        onActionPress={handleLogout}
        subtitle={`${roleLabel} account`}
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
              {user.name}
            </ThemedText>
            <ThemedText style={[styles.role, { color: palette.mutedText }]}>
              {roleLabel} - {locationLine}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.profileBody, { color: palette.mutedText }]}>
          {creatorProfile?.bio ??
            "Your account is connected to the deployed AdBridge API and is now driving the protected screens in this app."}
        </ThemedText>
        <View style={styles.heroActionRow}>
          <Button
            buttonStyle={styles.heroPrimaryButton}
            onPress={() =>
              router.push(
                user.role === "advertiser" ? routes.createCampaign : routes.campaigns,
              )
            }
            title={user.role === "advertiser" ? "Open studio" : "Browse campaigns"}
          />
          <Button
            buttonStyle={[styles.heroSecondaryButton, { borderColor: palette.border }]}
            loading={isRefreshingSession}
            onPress={handleSessionRefresh}
            title="Refresh session"
            titleStyle={{ color: palette.text }}
            type="outline"
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
            Account details need attention
          </ThemedText>
          <ThemedText style={[styles.stateBody, { color: palette.mutedText }]}>
            {errorMessage}
          </ThemedText>
          <Button
            onPress={() => setRefreshKey((currentValue) => currentValue + 1)}
            title="Reload account data"
          />
        </Card>
      ) : null}

      <SectionHeader
        subtitle="Live access and activity pulled from your API session."
        title="Account snapshot"
      />

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={palette.primary} size="large" />
        </View>
      ) : (
        <>
          <View style={styles.metricGrid}>
            {creatorMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </View>

          <SectionHeader
            subtitle="Account details returned from the live backend session."
            title="Profile details"
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
                <Icon color={palette.primary} name={item.icon} size={20} />
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

          {user.role === "creator" ? (
            <>
              <SectionHeader
                subtitle="This profile is required before you can apply to campaigns."
                title="Creator profile"
              />
              <Card
                containerStyle={[
                  styles.formCard,
                  { backgroundColor: palette.card, borderColor: palette.border },
                ]}
              >
                <Input
                  autoCapitalize="none"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={[
                    styles.inputFrame,
                    {
                      backgroundColor: palette.background,
                      borderColor: palette.border,
                    },
                  ]}
                  inputStyle={[styles.inputText, { color: palette.text }]}
                  label="Handle"
                  labelStyle={[styles.label, { color: palette.text }]}
                  onChangeText={setHandle}
                  placeholder="@creatorname"
                  placeholderTextColor={palette.mutedText}
                  value={handle}
                />
                <Input
                  autoCapitalize="words"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={[
                    styles.inputFrame,
                    {
                      backgroundColor: palette.background,
                      borderColor: palette.border,
                    },
                  ]}
                  inputStyle={[styles.inputText, { color: palette.text }]}
                  label="Display name"
                  labelStyle={[styles.label, { color: palette.text }]}
                  onChangeText={setDisplayName}
                  placeholder="Aarav Media"
                  placeholderTextColor={palette.mutedText}
                  value={displayName}
                />
                <Input
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={[
                    styles.textAreaFrame,
                    {
                      backgroundColor: palette.background,
                      borderColor: palette.border,
                    },
                  ]}
                  inputStyle={[styles.textArea, { color: palette.text }]}
                  label="Bio"
                  labelStyle={[styles.label, { color: palette.text }]}
                  multiline
                  onChangeText={setBio}
                  placeholder="Describe your niche, audience, and campaign strengths."
                  placeholderTextColor={palette.mutedText}
                  textAlignVertical="top"
                  value={bio}
                />
                <Input
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={[
                    styles.inputFrame,
                    {
                      backgroundColor: palette.background,
                      borderColor: palette.border,
                    },
                  ]}
                  inputStyle={[styles.inputText, { color: palette.text }]}
                  keyboardType="numeric"
                  label="Rate card minimum"
                  labelStyle={[styles.label, { color: palette.text }]}
                  onChangeText={setRateCardMin}
                  placeholder="1500"
                  placeholderTextColor={palette.mutedText}
                  value={rateCardMin}
                />
                <Input
                  autoCapitalize="words"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={[
                    styles.inputFrame,
                    {
                      backgroundColor: palette.background,
                      borderColor: palette.border,
                    },
                  ]}
                  inputStyle={[styles.inputText, { color: palette.text }]}
                  label="Categories"
                  labelStyle={[styles.label, { color: palette.text }]}
                  onChangeText={setCategoriesInput}
                  placeholder="Lifestyle, Fitness, SaaS"
                  placeholderTextColor={palette.mutedText}
                  value={categoriesInput}
                />
                <Input
                  autoCapitalize="words"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={[
                    styles.inputFrame,
                    {
                      backgroundColor: palette.background,
                      borderColor: palette.border,
                    },
                  ]}
                  inputStyle={[styles.inputText, { color: palette.text }]}
                  label="Platforms"
                  labelStyle={[styles.label, { color: palette.text }]}
                  onChangeText={setPlatformsInput}
                  placeholder="Instagram, YouTube, Newsletter"
                  placeholderTextColor={palette.mutedText}
                  value={platformsInput}
                />
                <Button
                  buttonStyle={styles.primaryButton}
                  loading={isSavingProfile}
                  onPress={handleSaveCreatorProfile}
                  title={creatorProfile ? "Save profile changes" : "Create profile"}
                />
              </Card>
            </>
          ) : null}
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: AppSpacing.xl,
    paddingBottom: 32,
  },
  formCard: {
    gap: AppSpacing.md,
  },
  heroActionRow: {
    flexDirection: "row",
    gap: AppSpacing.sm,
  },
  heroPrimaryButton: {
    flex: 1,
    minHeight: 48,
  },
  heroSecondaryButton: {
    flex: 1,
    minHeight: 48,
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  inputFrame: {
    borderBottomWidth: 0,
    borderRadius: AppRadius.md,
    borderWidth: 1,
    minHeight: 54,
    paddingHorizontal: AppSpacing.sm,
  },
  inputText: {
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
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
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
  },
  metricGrid: {
    flexDirection: "row",
    gap: AppSpacing.md,
  },
  name: {
    fontSize: 20,
    lineHeight: 24,
  },
  primaryButton: {
    minHeight: 50,
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

function parseCommaSeparatedList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePlatforms(value: string): CreatorPlatform[] {
  return parseCommaSeparatedList(value).map((name) => ({
    engagementRate: 0,
    followers: 0,
    name,
  }));
}
