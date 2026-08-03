import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { fonts, layout, radius, spacing } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

const NAV_ITEMS = [
  { href: '/home', label: 'Home', icon: 'home' as const },
  { href: '/translate', label: 'Translate', icon: 'translate' as const },
  { href: '/daily', label: 'Daily', icon: 'newspaper' as const },
  { href: '/story', label: 'Story', icon: 'auto-stories' as const },
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
        <View style={[styles.logoMark, { backgroundColor: c.tint }]}>
          <ThemedText style={styles.logoKr} korean>가</ThemedText>
        </View>
        <View>
          <ThemedText style={[styles.logoText, { fontFamily: fonts.sansBold }]}>KoLearn</ThemedText>
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
                active && { backgroundColor: c.sidebarActive, borderLeftColor: c.tint },
              ]}>
              <MaterialIcons name={item.icon} size={20} color={active ? c.tint : c.icon} />
              <ThemedText
                type="bodySm"
                style={{ color: active ? c.tint : c.text, fontFamily: active ? fonts.sansSemiBold : fonts.sans }}>
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
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoKr: { color: '#fff', fontSize: 20, fontWeight: '700' },
  logoText: { fontSize: 18, fontWeight: '700' },
  nav: { flex: 1, gap: spacing.xs, paddingHorizontal: spacing.sm },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
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
