import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { ThemeProvider as RNEThemeProvider, createTheme } from "@rneui/themed";
import "react-native-reanimated";

import { Colors } from "@/constants/theme";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import Root from "./Root";

function RootLayoutContent() {
  const { colorScheme, palette } = useTheme();
  const navigationTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const rneTheme = createTheme({
    mode: colorScheme === "dark" ? "dark" : "light",
    lightColors: {
      primary: Colors.light.primary,
      background: Colors.light.background,
      white: Colors.light.card,
      black: Colors.light.text,
      greyOutline: Colors.light.border,
      divider: Colors.light.border,
      searchBg: Colors.light.primaryMuted,
    },
    darkColors: {
      primary: Colors.dark.primary,
      background: Colors.dark.background,
      white: Colors.dark.card,
      black: Colors.dark.text,
      greyOutline: Colors.dark.border,
      divider: Colors.dark.border,
      searchBg: Colors.dark.primaryMuted,
    },
    components: {
      Button: {
        buttonStyle: {
          borderRadius: 16,
          paddingVertical: 14,
        },
        titleStyle: {
          fontWeight: "600",
        },
      },
      Card: {
        containerStyle: {
          backgroundColor: palette.card,
          borderColor: palette.border,
          borderRadius: 24,
          borderWidth: 1,
          margin: 0,
          padding: 20,
        },
      },
    },
  });

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <RNEThemeProvider theme={rneTheme}>
        <Root />
      </RNEThemeProvider>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

//  <Stack>
//         <Stack.Screen name="Root" options={{ headerShown: false }} />
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
//       </Stack>
//       <StatusBar style="auto" />
