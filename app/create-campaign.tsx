import { Button, Card, Input } from "@rneui/themed";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";

import { BrandHeader } from "@/components/app/brand-header";
import { ScreenShell } from "@/components/app/screen-shell";
import { SectionHeader } from "@/components/app/section-header";
import { ThemedText } from "@/components/themed-text";
import { routes } from "@/constants/routes";
import { campaignObjectives, type CampaignObjective } from "@/constants/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { AppRadius, AppSpacing } from "@/constants/theme";
import {
  createCampaign,
  fetchCampaign,
  getApiErrorMessage,
  updateCampaign,
} from "@/lib/api-client";
import { parseCurrencyInput } from "@/lib/formatters";
import { useTheme } from "@/contexts/theme-context";

export default function CreateCampaignScreen() {
  const { palette } = useTheme();
  const { token, user } = useAuth();
  const params = useLocalSearchParams<{ campaignId?: string }>();
  const campaignId =
    typeof params.campaignId === "string" ? params.campaignId : undefined;
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(Boolean(campaignId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [objective, setObjective] = useState<CampaignObjective>("Awareness");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!campaignId) {
      setIsLoadingCampaign(false);
      return;
    }

    const activeCampaignId = campaignId;
    let isActive = true;

    async function loadCampaign() {
      setIsLoadingCampaign(true);
      setErrorMessage(null);

      try {
        const campaign = await fetchCampaign(activeCampaignId);

        if (!isActive) {
          return;
        }

        setTitle(campaign.title);
        setBudget(String(Math.max(campaign.budgetMax, campaign.budgetMin)));
        setDescription(campaign.description);
        setObjective(resolveObjective(campaign.objectives));
      } catch (error) {
        if (isActive) {
          setErrorMessage(getApiErrorMessage(error));
        }
      } finally {
        if (isActive) {
          setIsLoadingCampaign(false);
        }
      }
    }

    loadCampaign();

    return () => {
      isActive = false;
    };
  }, [campaignId]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.dashboard);
  };

  if (!user || !token) {
    return <Redirect href={routes.login} />;
  }

  const isAdvertiser = user.role === "advertiser";
  const isEditing = Boolean(campaignId);

  const handleSubmit = async (status: "draft" | "open") => {
    if (!isAdvertiser) {
      setErrorMessage("Only advertiser accounts can publish campaigns.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Campaign name and brief summary are required.");
      return;
    }

    const parsedBudget = parseCurrencyInput(budget);

    if (parsedBudget <= 0) {
      setErrorMessage("Enter a valid budget to create the campaign.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        brandName: user.companyName ?? user.name,
        budgetMax: parsedBudget,
        budgetMin: parsedBudget,
        description: description.trim(),
        objectives: [objective.toLowerCase()],
        status,
        title: title.trim(),
      };

      if (campaignId) {
        await updateCampaign(token, campaignId, payload);
      } else {
        await createCampaign(token, payload);
      }

      Alert.alert(
        campaignId ? "Campaign updated" : "Campaign created",
        status === "draft"
          ? campaignId
            ? "Your campaign draft changes were saved."
            : "Your campaign was saved as a draft."
          : campaignId
            ? "Your campaign changes are now live in the marketplace."
            : "Your campaign is now live in the marketplace.",
      );
      router.replace(routes.dashboard);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <BrandHeader actionLabel="Back" compact onActionPress={handleBack} />

      <View style={styles.headerCopy}>
        <ThemedText style={styles.kicker}>CAMPAIGN STUDIO</ThemedText>
        <ThemedText style={styles.title} type="title">
          {isEditing ? "Edit Campaign" : "Create New Campaign"}
        </ThemedText>
        <ThemedText style={[styles.body, { color: palette.mutedText }]}>
          {isEditing
            ? "This form is now connected to the live campaign detail and update endpoints, so your edits sync directly with the deployed AdBridge API."
            : "This form now posts real data to the AdBridge API. Campaigns created here will appear in your dashboard and the live campaign catalog."}
        </ThemedText>
      </View>

      {!isAdvertiser ? (
        <Card
          containerStyle={[
            styles.formCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <ThemedText style={styles.stateTitle} type="defaultSemiBold">
            Advertiser access required
          </ThemedText>
          <ThemedText style={[styles.stateBody, { color: palette.mutedText }]}>
            Provider accounts can browse campaigns and track applications, but
            only advertisers can create new listings from this screen.
          </ThemedText>
          <Button
            onPress={() => router.replace(routes.campaigns)}
            title="Browse live campaigns"
          />
        </Card>
      ) : isLoadingCampaign ? (
        <Card
          containerStyle={[
            styles.formCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={palette.primary} size="large" />
          </View>
          <ThemedText style={[styles.stateBody, { color: palette.mutedText }]}>
            Loading campaign details from the live API...
          </ThemedText>
        </Card>
      ) : (
        <Card
          containerStyle={[
            styles.formCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Input
            containerStyle={styles.inputContainer}
            inputContainerStyle={[
              styles.inputFrame,
              {
                backgroundColor: palette.background,
                borderColor: palette.border,
              },
            ]}
            inputStyle={{ color: palette.text, fontSize: 15 }}
            label="Campaign name"
            labelStyle={[styles.label, { color: palette.text }]}
            onChangeText={setTitle}
            placeholder="Launch monsoon awareness"
            placeholderTextColor={palette.mutedText}
            value={title}
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
            inputStyle={{ color: palette.text, fontSize: 15 }}
            keyboardType="numeric"
            label="Budget"
            labelStyle={[styles.label, { color: palette.text }]}
            onChangeText={setBudget}
            placeholder="$8,500"
            placeholderTextColor={palette.mutedText}
            value={budget}
          />
          <Input
            containerStyle={styles.inputContainer}
            inputContainerStyle={[
              styles.inputFrame,
              styles.textAreaFrame,
              {
                backgroundColor: palette.background,
                borderColor: palette.border,
              },
            ]}
            inputStyle={[styles.textArea, { color: palette.text }]}
            label="Brief summary"
            labelStyle={[styles.label, { color: palette.text }]}
            multiline
            numberOfLines={4}
            onChangeText={setDescription}
            placeholder="Describe the audience, placements, and creative direction."
            placeholderTextColor={palette.mutedText}
            textAlignVertical="top"
            value={description}
          />

          <SectionHeader
            subtitle="Select the primary outcome for the campaign."
            title="Objective"
          />
          <View
            style={[
              styles.objectiveRow,
              { backgroundColor: palette.primaryMuted },
            ]}
          >
            {campaignObjectives.map((item) => {
              const selected = objective === item;

              return (
                <Button
                  buttonStyle={[
                    styles.objectiveButton,
                    selected && { backgroundColor: palette.primary },
                  ]}
                  key={item}
                  onPress={() => setObjective(item)}
                  title={item}
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
            <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
          ) : null}

          <View style={styles.ctaRow}>
            <Button
              buttonStyle={[
                styles.secondaryButton,
                { borderColor: palette.border },
              ]}
              loading={isSubmitting}
              disabled={isSubmitting}
              onPress={() => handleSubmit("draft")}
              title={isEditing ? "Save Changes" : "Save Draft"}
              titleStyle={{ color: palette.text }}
              type="outline"
            />
            <Button
              buttonStyle={styles.primaryButton}
              loading={isSubmitting}
              disabled={isSubmitting}
              onPress={() => handleSubmit("open")}
              title={isEditing ? "Update Live Campaign" : "Launch Campaign"}
            />
          </View>
        </Card>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  content: {
    gap: AppSpacing.xl,
    paddingBottom: 32,
  },
  ctaRow: {
    flexDirection: "row",
    gap: AppSpacing.sm,
  },
  errorText: {
    color: "#c74545",
    fontSize: 13,
    lineHeight: 18,
  },
  formCard: {
    gap: AppSpacing.lg,
  },
  headerCopy: {
    gap: AppSpacing.sm,
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
  kicker: {
    color: "#2f80ed",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  objectiveButton: {
    borderRadius: AppRadius.pill,
    flex: 1,
    minHeight: 42,
  },
  objectiveRow: {
    borderRadius: AppRadius.pill,
    flexDirection: "row",
    padding: 4,
  },
  primaryButton: {
    flex: 1,
    minHeight: 50,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 50,
  },
  stateBody: {
    fontSize: 14,
    lineHeight: 20,
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
    minHeight: 130,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
  },
});

function resolveObjective(objectives: string[]): CampaignObjective {
  const firstObjective = objectives[0];

  if (!firstObjective) {
    return "Awareness";
  }

  const matchingObjective = campaignObjectives.find(
    (item) => item.toLowerCase() === firstObjective.toLowerCase(),
  );

  return matchingObjective ?? "Awareness";
}
