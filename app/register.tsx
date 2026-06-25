import { Button, Card, Input } from "@rneui/themed";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { BackgroundAccents } from "@/components/app/background-accents";
import { BrandHeader } from "@/components/app/brand-header";
import { ScreenShell } from "@/components/app/screen-shell";
import { ThemedText } from "@/components/themed-text";
import {
  appRoleToApiRole,
  getRoleLabel,
} from "@/constants/auth";
import { routePaths, routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { AppRadius, AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";
import type { AppUserRole } from "@/types/api";

export default function RegisterScreen() {
  const { palette } = useTheme();
  const { isAuthenticated, isLoading, register } = useAuth();
  const params = useLocalSearchParams<{ role?: string }>();
  const initialRole: AppUserRole =
    params.role === "provider" ? "provider" : "advertiser";

  const [city, setCity] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppUserRole>(initialRole);

  const roleDescription = useMemo(() => {
    return role === "advertiser"
      ? "Create campaigns, review provider fits, and manage live delivery."
      : "Browse live briefs, submit bids, and track your campaign applications.";
  }, [role]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.login);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Name, email, and password are required.");
      return;
    }

    if (role === "advertiser" && !companyName.trim()) {
      setErrorMessage("Company name is required for advertiser accounts.");
      return;
    }

    if (role === "provider" && !city.trim()) {
      setErrorMessage("City is required for provider accounts.");
      return;
    }

    setErrorMessage(null);

    try {
      await register({
        city: role === "provider" ? city.trim() : undefined,
        companyName: role === "advertiser" ? companyName.trim() : undefined,
        email: email.trim(),
        name: name.trim(),
        password,
        role: appRoleToApiRole(role),
      });

      router.replace(routes.dashboard);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create account.",
      );
    }
  };

  if (isAuthenticated) {
    return <Redirect href={routes.dashboard} />;
  }

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <BackgroundAccents />
      <BrandHeader actionLabel="Back" compact onActionPress={handleBack} />

      <View style={styles.heroCopy}>
        <ThemedText style={styles.kicker}>CREATE ACCOUNT</ThemedText>
        <ThemedText style={styles.headline} type="title">
          Join AdBridge with a live account.
        </ThemedText>
        <ThemedText style={[styles.description, { color: palette.mutedText }]}>
          This form is wired to the live `/api/auth/register` endpoint and signs
          you in immediately after account creation.
        </ThemedText>
      </View>

      <Card
        containerStyle={[
          styles.formCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <View style={[styles.roleRow, { backgroundColor: palette.primaryMuted }]}>
          {(["advertiser", "provider"] as const).map((item) => {
            const selected = role === item;

            return (
              <Button
                buttonStyle={[
                  styles.roleButton,
                  selected && { backgroundColor: palette.primary },
                ]}
                key={item}
                onPress={() => setRole(item)}
                title={getRoleLabel(item)}
                titleStyle={[
                  styles.roleLabel,
                  { color: selected ? "#ffffff" : palette.text },
                ]}
                type={selected ? "solid" : "clear"}
              />
            );
          })}
        </View>

        <ThemedText style={[styles.roleDescription, { color: palette.mutedText }]}>
          {roleDescription}
        </ThemedText>

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
          label="Full name"
          labelStyle={[styles.label, { color: palette.text }]}
          onChangeText={setName}
          placeholder="Aarav Mehta"
          placeholderTextColor={palette.mutedText}
          value={name}
        />
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
          keyboardType="email-address"
          label="Email address"
          labelStyle={[styles.label, { color: palette.text }]}
          onChangeText={setEmail}
          placeholder="name@example.com"
          placeholderTextColor={palette.mutedText}
          value={email}
        />
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
          label="Password"
          labelStyle={[styles.label, { color: palette.text }]}
          onChangeText={setPassword}
          placeholder="Create a password"
          placeholderTextColor={palette.mutedText}
          secureTextEntry
          value={password}
        />
        {role === "advertiser" ? (
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
            label="Company name"
            labelStyle={[styles.label, { color: palette.text }]}
            onChangeText={setCompanyName}
            placeholder="Nimbus Labs"
            placeholderTextColor={palette.mutedText}
            value={companyName}
          />
        ) : (
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
            label="City"
            labelStyle={[styles.label, { color: palette.text }]}
            onChangeText={setCity}
            placeholder="Bengaluru"
            placeholderTextColor={palette.mutedText}
            value={city}
          />
        )}

        {errorMessage ? (
          <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
        ) : null}

        <View style={styles.ctaStack}>
          <Button
            buttonStyle={styles.primaryCta}
            loading={isLoading}
            onPress={handleSubmit}
            title={`Create ${getRoleLabel(role)} account`}
          />
          <Button
            buttonStyle={[styles.secondaryCta, { borderColor: palette.border }]}
            onPress={() =>
              router.replace({
                pathname: routePaths.login,
                params: { role },
              })
            }
            title="Already have an account?"
            titleStyle={{ color: palette.text }}
            type="outline"
          />
        </View>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: AppSpacing.xl,
  },
  ctaStack: {
    gap: AppSpacing.sm,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    color: "#c74545",
    fontSize: 13,
    lineHeight: 18,
  },
  formCard: {
    gap: AppSpacing.lg,
  },
  headline: {
    fontSize: 34,
    lineHeight: 38,
  },
  heroCopy: {
    gap: AppSpacing.sm,
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  inputFrame: {
    borderBottomWidth: 0,
    borderRadius: AppRadius.md,
    borderWidth: 1,
    minHeight: 56,
    paddingHorizontal: AppSpacing.sm,
  },
  inputText: {
    fontSize: 15,
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
  primaryCta: {
    minHeight: 54,
  },
  roleButton: {
    borderRadius: AppRadius.pill,
    flex: 1,
    minHeight: 46,
  },
  roleDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  roleRow: {
    borderRadius: AppRadius.pill,
    flexDirection: "row",
    padding: 4,
  },
  secondaryCta: {
    minHeight: 54,
  },
});
