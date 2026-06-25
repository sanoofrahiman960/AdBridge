import React, { createContext, useContext, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

type ColorScheme = "light" | "dark";
type ThemePreference = ColorScheme | "system";

interface ThemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
  palette: typeof Colors.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("system");

  const colorScheme: ColorScheme =
    preference === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : preference;

  const setColorScheme = (scheme: ColorScheme) => {
    setPreference(scheme);
  };

  const toggleColorScheme = () => {
    setPreference((currentPreference) => {
      const resolvedScheme =
        currentPreference === "system" ? colorScheme : currentPreference;

      return resolvedScheme === "light" ? "dark" : "light";
    });
  };

  const palette = Colors[colorScheme];

  return (
    <ThemeContext.Provider
      value={{ colorScheme, setColorScheme, toggleColorScheme, palette }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  const systemColorScheme = useSystemColorScheme();

  if (context === undefined) {
    const colorScheme: ColorScheme =
      systemColorScheme === "dark" ? "dark" : "light";

    return {
      colorScheme,
      palette: Colors[colorScheme],
      setColorScheme: () => {
        // No-op fallback for components rendered outside the provider tree.
      },
      toggleColorScheme: () => {
        // No-op fallback for components rendered outside the provider tree.
      },
    };
  }

  return context;
}
