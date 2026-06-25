import { Button, Card, Divider, Icon, Input } from "@rneui/themed";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppRadius, AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";
import { SocialAuthButtons } from "./social-auth-buttons";

export type UserRole = "advertiser" | "provider";

type LoginCardProps = {
  initialRole?: UserRole;
  onSubmit: (role: UserRole) => void;
};

export function LoginCard({
  initialRole = "advertiser",
  onSubmit,
}: LoginCardProps) {
  const { palette } = useTheme();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState("alex@adbridge.co");
  const [password, setPassword] = useState("password");

  const ctaTitle = useMemo(() => {
    return role === "advertiser" ? "Login as Advertiser" : "Login as Provider";
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
          onPress={() => onSubmit(role)}
          title={ctaTitle}
        />
        <Button
          buttonStyle={[styles.secondaryCta, { borderColor: palette.border }]}
          onPress={() => onSubmit(role)}
          title="Preview dashboard"
          titleStyle={{ color: palette.text }}
          type="outline"
        />
      </View>

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
        <ThemedText style={[styles.footerLink, { color: palette.primary }]}>
          Create an account
        </ThemedText>
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
