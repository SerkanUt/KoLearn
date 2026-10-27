import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Colors, toolStripe, type StripeName } from '@/constants/Colors';
import { fonts, layout, radius, spacing } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

const NAV_ITEMS = [
  { href: '/home', label: 'Home', icon: 'home' as const, tone: toolStripe.home as StripeName },
  { href: '/translate', label: 'Translate', icon: 'translate' as const, tone: toolStripe.translate as StripeName },
  { href: '/daily', label: 'Daily', icon: 'newspaper' as const, tone: toolStripe.daily as StripeName },
  { href: '/story', label: 'Story', icon: 'auto-stories' as const, tone: toolStripe.story as StripeName },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <View style={[styles.sidebar, { backgroundColor: c.sidebar, borderRightColor: c.border }]}>
      <View style={styles.logo}>
        <View style={[styles.logoMark, { backgroundColor: c.rose }]}>
          <ThemedText style={[styles.logoKr, { color: c.text }]} korean>가</ThemedText>
        </View>
        <View>
          <ThemedText style={[styles.logoText, { fontFamily: fonts.display }]}>KoLearn</ThemedText>
          <ThemedText type="caption" style={{ color: c.textSecondary }}>Learn Korean</ThemedText>
        </View>
      </View>

      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href as never)}
              style={[
                styles.navItem,
                active && { backgroundColor: c[item.tone] },
              ]}>
              <MaterialIcons name={item.icon} size={20} color={active ? c.text : c.icon} />
              <ThemedText
                type="bodySm"
                style={{ color: c.text, fontFamily: active ? fonts.sansSemiBold : fonts.sans }}>
                {item.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => router.push('/settings' as never)}
        style={[styles.settings, { borderTopColor: c.border }]}>
        <MaterialIcons name="settings" size={20} color={c.icon} />
        <ThemedText type="bodySm" style={{ color: c.textSecondary }}>Settings</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: layout.sidebarWidth,
    borderRightWidth: 1,
    paddingVertical: spacing.xl,
    justifyContent: 'space-between',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoKr: { fontSize: 20, fontWeight: '700' },
  logoText: { fontSize: 20 },
  nav: { flex: 1, gap: spacing.xs, paddingHorizontal: spacing.sm },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  settings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginHorizontal: spacing.sm,
    borderTopWidth: 1,
  },
});
