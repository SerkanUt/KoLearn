// Saekdong pastels: five sleeve stripes on a warm cream ground.
// Stripes are flat fills and never tappable; the one saturated plum (tint) marks what you can press.
export const stripes = {
  light: { rose: "#FFC9D6", butter: "#FFE9A8", mint: "#BFEBD6", sky: "#BCDFFF", lilac: "#D9C8FF" },
  dark: { rose: "#7A3F55", butter: "#7A6A2E", mint: "#2F6B55", sky: "#2F5F8A", lilac: "#5B4A8F" },
};

export type StripeName = keyof typeof stripes.light;

export const toolStripe = {
  home: "butter",
  translate: "sky",
  daily: "rose",
  story: "lilac",
  settings: "mint",
} as const satisfies Record<string, StripeName>;

export const Colors = {
  light: {
    text: "#2B2540",
    textSecondary: "#625B7A",
    background: "#FFF9F2",
    tint: "#5B3FD0",
    tintLight: "#7A62E0",
    icon: "#7C7596",
    tabIconDefault: "#7C7596",
    tabIconSelected: "#5B3FD0",
    border: "#EADFD3",
    placeholder: "#7C7596",
    card: "#FFFFFF",
    cardBorder: "#EADFD3",
    accent: "#5B3FD0",
    accentMuted: "#EFE9FF",
    highlight: "#FFE9A8",
    highlightText: "#2B2540",
    onTint: "#FFFFFF",
    ...stripes.light,
    success: "#12775A",
    successMuted: "#DDF5EA",
    warning: "#9A5A00",
    warningMuted: "#FFF0CC",
    error: "#B3261E",
    errorMuted: "#FFE0E0",
    sidebar: "#FFFFFF",
    sidebarActive: "#EFE9FF",
    shadow: "rgba(91, 63, 208, 0.10)",
    overlay: "rgba(43, 37, 64, 0.40)",
  },
  dark: {
    text: "#F4EFFF",
    textSecondary: "#B9B1D3",
    background: "#221D33",
    tint: "#B7A6FF",
    tintLight: "#CFC3FF",
    icon: "#948BB3",
    tabIconDefault: "#948BB3",
    tabIconSelected: "#B7A6FF",
    border: "#3A3354",
    placeholder: "#948BB3",
    card: "#2D2744",
    cardBorder: "#3A3354",
    accent: "#B7A6FF",
    accentMuted: "#3A3160",
    highlight: "#7A6A2E",
    highlightText: "#FFF6D6",
    onTint: "#221D33",
    ...stripes.dark,
    success: "#5FD3A8",
    successMuted: "#1E4A3B",
    warning: "#F5B35A",
    warningMuted: "#4A3512",
    error: "#FF9A92",
    errorMuted: "#4F1F24",
    sidebar: "#2D2744",
    sidebarActive: "#3A3160",
    shadow: "rgba(0, 0, 0, 0.35)",
    overlay: "rgba(10, 8, 20, 0.6)",
  },
};

export type ThemeColors = typeof Colors.light;
