export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const typography = {
  hero: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
  h1: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  h2: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
} as const;

export const layout = {
  sidebarWidth: 240,
  breakpoint: 768,
  maxWidthDashboard: 1200,
  maxWidthReader: 720,
  maxWidthForm: 960,
} as const;

export const fonts = {
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
  korean: 'NotoSansKR_400Regular',
  koreanMedium: 'NotoSansKR_500Medium',
  koreanBold: 'NotoSansKR_700Bold',
} as const;
