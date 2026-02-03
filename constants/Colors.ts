/**
 * Pastel color palette for Korean language learning app (Lingoistics).
 * Light and dark modes use soft pastels for a calm, study-friendly look.
 */

// Pastel accent colors
const tintLight = '#c4a7e7';   // pastel lavender
const tintDark = '#e8d5f2';    // lighter lavender for dark mode

export const Colors = {
  light: {
    text: '#5c4d6d',
    background: '#faf5ff',       // very light lavender
    tint: tintLight,
    icon: '#8b7a9e',
    tabIconDefault: '#b8a9c4',
    tabIconSelected: tintLight,
    border: '#e9d5ff',
    placeholder: '#b8a9c4',
    card: '#ffffff',
    cardBorder: '#f3e8ff',
    pastelPink: '#fce7f3',
    pastelMint: '#d1fae5',
    pastelPeach: '#ffedd5',
    pastelSky: '#e0f2fe',
  },
  dark: {
    text: '#e9d5ff',
    background: '#2e1065',      // deep lavender
    tint: tintDark,
    icon: '#c4b5fd',
    tabIconDefault: '#7c6ea8',
    tabIconSelected: tintDark,
    border: '#5b21b6',
    placeholder: '#7c6ea8',
    card: '#3b0764',
    cardBorder: '#5b21b6',
    pastelPink: '#831843',
    pastelMint: '#064e3b',
    pastelPeach: '#9a3412',
    pastelSky: '#0c4a6e',
  },
};
