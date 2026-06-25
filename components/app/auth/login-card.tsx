import { Button, Card, Divider, Icon, Input } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { demoCredentialsByRole, getRoleLabel } from "@/constants/auth";
import { AppRadius, AppSpacing } from "@/constants/theme";
import type { AppUserRole } from "@/types/api";
import { useTheme } from "@/contexts/theme-context";
import { SocialAuthButtons } from "./social-auth-buttons";

export type UserRole = AppUserRole;

export type LoginCardSubmitValues = {
  email: string;
  password: string;
  role: UserRole;
};

type LoginCardProps = {
  errorMessage?: string | null;
  initialRole?: UserRole;
  onCreateAccountPress?: (role: UserRole) => void;
  onSubmit: (values: LoginCardSubmitValues) => void;
  submitting?: boolean;
};

export function LoginCard({
  errorMessage,
  initialRole = "advertiser",
  onCreateAccountPress,
  onSubmit,
  submitting = false,
}: LoginCardProps) {
  const { palette } = useTheme();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState(demoCredentialsByRole[initialRole].email);
  const [password, setPassword] = useState(
    demoCredentialsByRole[initialRole].password,
  );

  useEffect(() => {
    setEmail(demoCredentialsByRole[role].email);
    setPassword(demoCredentialsByRole[role].password);
  }, [role]);

  return (
    <Card
      containerStyle={[
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <View style={styles.copy}>
        <ThemedText style={styles.heading} type="title">
          Welcome back
        </ThemedText>
        <ThemedText style={[styles.body, { color: palette.mutedText }]}>
          Enter your credentials to manage campaigns, bids, and live
          performance.
        </ThemedText>
      </View>

      <View style={[styles.roleRow, { backgroundColor: palette.primaryMuted }]}>
        {(["advertiser", "provider"] as UserRole[]).map((item) => {
          const selected = role === item;

          return (
            <Button
              buttonStyle={[
                styles.roleButton,
                selected && { backgroundColor: palette.primary },
              ]}
              key={item}
              onPress={() => setRole(item)}
              title={item === "advertiser" ? "Advertiser" : "Provider"}
              titleStyle={[
                styles.roleLabel,
                { color: selected ? "#ffffff" : palette.text },
              ]}
              type={selected ? "solid" : "clear"}
            />
          );
        })}
      </View>

      <View style={styles.inputStack}>
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
          leftIcon={<Icon color={palette.mutedText} name="mail-outline" />}
          onChangeText={setEmail}
          placeholder="Email address"
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
          leftIcon={<Icon color={palette.mutedText} name="lock-outline" />}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={palette.mutedText}
          rightIcon={<Icon color={palette.mutedText} name="visibility-off" />}
          secureTextEntry
          value={password}
        />
      </View>

      <Pressable accessibilityRole="button" style={styles.forgotButton}>
        <ThemedText style={[styles.forgotLabel, { color: palette.primary }]}>
          Forgot your password?
        </ThemedText>
      </Pressable>

      <View style={styles.ctaStack}>
        <Button
          buttonStyle={styles.primaryCta}
          loading={submitting}
          onPress={() => onSubmit({ email, password, role })}
          title={`Login as ${getRoleLabel(role)}`}
        />
        <Button
          buttonStyle={[styles.secondaryCta, { borderColor: palette.border }]}
          onPress={() => {
            setEmail(demoCredentialsByRole[role].email);
            setPassword(demoCredentialsByRole[role].password);
          }}
          title="Reset demo login"
          titleStyle={{ color: palette.text }}
          type="outline"
        />
      </View>

      <ThemedText style={[styles.demoHint, { color: palette.mutedText }]}>
        Demo credentials are loaded for the selected role. Switch roles to swap
        between the advertiser and provider accounts.
      </ThemedText>

      {errorMessage ? (
        <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
      ) : null}

      <View style={styles.dividerRow}>
        <Divider style={styles.divider} width={1} />
        <ThemedText style={[styles.dividerLabel, { color: palette.mutedText }]}>
          or continue with
        </ThemedText>
        <Divider style={styles.divider} width={1} />
      </View>

      <SocialAuthButtons />

      <View style={styles.footer}>
        <ThemedText style={[styles.footerText, { color: palette.mutedText }]}>
          New to AdBridge?
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => onCreateAccountPress?.(role)}
        >
          <ThemedText style={[styles.footerLink, { color: palette.primary }]}>
            Create an account
          </ThemedText>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 14,
    lineHeight: 21,
  },
  card: {
    gap: AppSpacing.lg,
    padding: AppSpacing.lg,
  },
  copy: {
    gap: AppSpacing.xs,
  },
  ctaStack: {
    gap: AppSpacing.sm,
  },
  demoHint: {
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    flex: 1,
  },
  dividerLabel: {
    fontSize: 13,
  },
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: AppSpacing.sm,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  errorText: {
    color: "#c74545",
    fontSize: 13,
    lineHeight: 18,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 18,
  },
  forgotButton: {
    alignSelf: "flex-start",
  },
  forgotLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  heading: {
    fontSize: 30,
    lineHeight: 34,
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
  inputStack: {
    gap: 2,
  },
  inputText: {
    fontSize: 15,
  },
  primaryCta: {
    minHeight: 54,
  },
  roleButton: {
    borderRadius: AppRadius.pill,
    flex: 1,
    minHeight: 46,
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
