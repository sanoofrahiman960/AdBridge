import { Button, Card } from "@rneui/themed";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  LoginCard,
  type LoginCardSubmitValues,
  type UserRole,
} from "@/components/app/auth/login-card";
import { BackgroundAccents } from "@/components/app/background-accents";
import { BrandHeader } from "@/components/app/brand-header";
import { ScreenShell } from "@/components/app/screen-shell";
import { ThemedText } from "@/components/themed-text";
import { routePaths, routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { AppSpacing } from "@/constants/theme";
import { fetchHealth, getApiErrorMessage } from "@/lib/api-client";
import { useTheme } from "@/contexts/theme-context";
import type { HealthResponse } from "@/types/api";

export default function LoginScreen() {
  const { palette } = useTheme();
  const { isAuthenticated, isLoading, login } = useAuth();
  const params = useLocalSearchParams<{ role?: string }>();
  const initialRole = params.role === "provider" ? "provider" : "advertiser";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [healthInfo, setHealthInfo] = useState<HealthResponse | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadHealth() {
      setIsCheckingHealth(true);
      setHealthError(null);

      try {
        const nextHealth = await fetchHealth();

        if (isActive) {
          setHealthInfo(nextHealth);
        }
      } catch (error) {
        if (isActive) {
          setHealthError(getApiErrorMessage(error));
          setHealthInfo(null);
        }
      } finally {
        if (isActive) {
          setIsCheckingHealth(false);
        }
      }
    }

    loadHealth();

    return () => {
      isActive = false;
    };
  }, []);

  if (isAuthenticated) {
    return <Redirect href={routes.dashboard} />;
  }

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.home);
  };

  const handleSubmit = async ({
    email,
    password,
  }: LoginCardSubmitValues) => {
    setErrorMessage(null);

    try {
      await login({ email, password });
      router.replace(routes.dashboard);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    }
  };

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <BackgroundAccents />
      <BrandHeader actionLabel="Back" compact onActionPress={handleBack} />

      <View style={styles.heroCopy}>
        <ThemedText style={styles.kicker}>AUTHENTICATION</ThemedText>
        <ThemedText style={styles.headline} type="title">
          Unified login for every role.
        </ThemedText>
        <ThemedText style={[styles.description, { color: palette.mutedText }]}>
          Switch between advertiser and provider access from the same polished
          auth surface.
        </ThemedText>
      </View>

      <LoginCard
        errorMessage={errorMessage}
        initialRole={initialRole as UserRole}
        onCreateAccountPress={(role) =>
          router.push({
            pathname: routePaths.register,
            params: { role },
          })
        }
        onSubmit={handleSubmit}
        submitting={isLoading}
      />

      <Card
        containerStyle={[
          styles.footerCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <ThemedText style={styles.footerTitle} type="defaultSemiBold">
          Need help getting started?
        </ThemedText>
        <ThemedText style={[styles.footerBody, { color: palette.mutedText }]}>
          The live API health endpoint is checked from this screen so you can
          tell whether the Render server is warm before signing in.
        </ThemedText>
        <ThemedText style={[styles.healthText, { color: palette.mutedText }]}>
          {isCheckingHealth
            ? "Checking live server status..."
            : healthInfo
              ? `Server ${healthInfo.status} on ${healthInfo.service} at ${new Date(healthInfo.timestamp).toLocaleString()}.`
              : `Server check failed: ${healthError ?? "Unknown error"}`}
        </ThemedText>
        <Button
          onPress={() =>
            router.push({
              pathname: routePaths.register,
              params: { role: initialRole },
            })
          }
          title="Create a live account"
        />
        <Button
          onPress={() => router.replace(routes.campaigns)}
          title="Open live campaigns"
          titleStyle={{ color: palette.text }}
          type="outline"
        />
        <Button
          loading={isCheckingHealth}
          onPress={async () => {
            setIsCheckingHealth(true);
            setHealthError(null);

            try {
              setHealthInfo(await fetchHealth());
            } catch (error) {
              setHealthInfo(null);
              setHealthError(getApiErrorMessage(error));
            } finally {
              setIsCheckingHealth(false);
            }
          }}
          title="Recheck server"
          titleStyle={{ color: palette.text }}
          type="clear"
        />
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: AppSpacing.xl,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  footerBody: {
    fontSize: 13,
    lineHeight: 19,
  },
  footerCard: {
    gap: AppSpacing.md,
  },
  healthText: {
    fontSize: 13,
    lineHeight: 19,
  },
  footerTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  headline: {
    fontSize: 34,
    lineHeight: 38,
  },
  heroCopy: {
    gap: AppSpacing.sm,
  },
  kicker: {
    color: "#2f80ed",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
