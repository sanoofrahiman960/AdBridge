/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const primaryLight = '#2f80ed';
const primaryDark = '#68a7ff';

export const Colors = {
  light: {
    text: '#12233f',
    background: '#f6f8fc',
    tint: primaryLight,
    icon: '#7e8ca3',
    tabIconDefault: '#91a0b4',
    tabIconSelected: primaryLight,
    primary: primaryLight,
    mutedText: '#67758a',
    border: '#e5ebf4',
    card: '#ffffff',
    primaryMuted: '#ecf4ff',
    success: '#20b486',
    warning: '#f3b840',
    chip: '#eef3fa',
    shadow: 'rgba(14, 30, 62, 0.08)',
  },
  dark: {
    text: '#edf2fa',
    background: '#101723',
    tint: primaryDark,
    icon: '#9aa7b8',
    tabIconDefault: '#7f8da0',
    tabIconSelected: primaryDark,
    primary: primaryDark,
    mutedText: '#a6b1c2',
    border: '#202c3b',
    card: '#162132',
    primaryMuted: '#1f3047',
    success: '#33cc96',
    warning: '#f0c460',
    chip: '#1b2737',
    shadow: 'rgba(0, 0, 0, 0.25)',
  },
};

export const AppSpacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const AppRadius = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
