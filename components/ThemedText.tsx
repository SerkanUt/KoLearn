import { StyleSheet, Text, type TextProps } from 'react-native';

import { fonts, typography } from '@/constants/Theme';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'hero' | 'h1' | 'h2' | 'body' | 'bodySm' | 'caption' | 'label' | 'defaultSemiBold' | 'title' | 'subtitle' | 'link';
  korean?: boolean;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  korean = false,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const fontFamily = korean ? fonts.korean : fonts.sans;

  return (
    <Text
      style={[
        { color, fontFamily },
        type === 'default' ? styles.default : undefined,
        type === 'hero' ? styles.hero : undefined,
        type === 'h1' ? styles.h1 : undefined,
        type === 'h2' ? styles.h2 : undefined,
        type === 'body' ? styles.body : undefined,
        type === 'bodySm' ? styles.bodySm : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'label' ? styles.label : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: { ...typography.body, fontFamily: fonts.sans },
  hero: { ...typography.hero, fontFamily: fonts.sansBold },
  h1: { ...typography.h1, fontFamily: fonts.sansBold },
  h2: { ...typography.h2, fontFamily: fonts.sansSemiBold },
  body: { ...typography.body, fontFamily: fonts.sans },
  bodySm: { ...typography.bodySm, fontFamily: fonts.sans },
  caption: { ...typography.caption, fontFamily: fonts.sans },
  label: { ...typography.label, fontFamily: fonts.sansSemiBold },
  defaultSemiBold: { ...typography.body, fontFamily: fonts.sansSemiBold, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '700', lineHeight: 32, fontFamily: fonts.sansBold },
  subtitle: { fontSize: 20, fontWeight: '600', fontFamily: fonts.sansSemiBold },
  link: { ...typography.body, fontFamily: fonts.sansMedium, color: '#4338CA' },
});
