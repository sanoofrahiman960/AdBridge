import { Button, Icon } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

import { AppSpacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

export function SocialAuthButtons() {
  const { palette } = useTheme();

  return (
    <View style={styles.row}>
      <Button
        buttonStyle={[styles.button, { borderColor: palette.border }]}
        icon={<Icon color={palette.text} name="language" size={18} />}
        title="Google"
        titleStyle={[styles.label, { color: palette.text }]}
        type="outline"
      />
      <Button
        buttonStyle={[styles.button, { borderColor: palette.border }]}
        icon={<Icon color={palette.text} name="business-center" size={18} />}
        title="LinkedIn"
        titleStyle={[styles.label, { color: palette.text }]}
        type="outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 50,
  },
  label: {
    fontSize: 14,
    marginLeft: 6,
  },
  row: {
    flexDirection: "row",
    gap: AppSpacing.sm,
  },
});
