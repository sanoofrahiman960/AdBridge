import { Button, Card, Input } from "@rneui/themed";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BrandHeader } from "@/components/app/brand-header";
import { ScreenShell } from "@/components/app/screen-shell";
import { SectionHeader } from "@/components/app/section-header";
import { ThemedText } from "@/components/themed-text";
import { AppRadius, AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

const objectives = ["Awareness", "Traffic", "Leads"] as const;

export default function CreateCampaignScreen() {
  const { palette } = useTheme();
  const [objective, setObjective] =
    useState<(typeof objectives)[number]>("Awareness");

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <BrandHeader
        actionLabel="Back"
        compact
        onActionPress={() => router.back()}
      />

      <View style={styles.headerCopy}>
        <ThemedText style={styles.kicker}>CAMPAIGN STUDIO</ThemedText>
        <ThemedText style={styles.title} type="title">
          Create New Campaign
        </ThemedText>
        <ThemedText style={[styles.body, { color: palette.mutedText }]}>
          This form mirrors the create-campaign frame from the design: clear
          fields, objective selection, and strong primary actions.
        </ThemedText>
      </View>

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
          placeholder="Launch monsoon awareness"
          placeholderTextColor={palette.mutedText}
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
          label="Budget"
          labelStyle={[styles.label, { color: palette.text }]}
          placeholder="$8,500"
          placeholderTextColor={palette.mutedText}
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
          placeholder="Describe the audience, placements, and creative direction."
          placeholderTextColor={palette.mutedText}
          textAlignVertical="top"
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
          {objectives.map((item) => {
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

        <View style={styles.ctaRow}>
          <Button
            buttonStyle={[
              styles.secondaryButton,
              { borderColor: palette.border },
            ]}
            title="Save Draft"
            titleStyle={{ color: palette.text }}
            type="outline"
          />
          <Button buttonStyle={styles.primaryButton} title="Launch Campaign" />
        </View>
      </Card>
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
