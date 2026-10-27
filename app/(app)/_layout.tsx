import { Tabs, Slot } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageContainer } from '@/components/layout/PageContainer';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors, toolStripe } from '@/constants/Colors';
import { spacing } from '@/constants/Theme';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useColorScheme } from '@/hooks/useColorScheme';

function MobileTabs() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.text,
        tabBarInactiveTintColor: c.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: c.card,
          borderTopColor: c.border,
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingTop: spacing.sm,
          ...Platform.select({ ios: { position: 'absolute' }, default: {} }),
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarActiveBackgroundColor: c[toolStripe.home],
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="translate"
        options={{
          tabBarActiveBackgroundColor: c[toolStripe.translate],
          title: 'Translate',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="translate" color={color} />,
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          tabBarActiveBackgroundColor: c[toolStripe.daily],
          title: 'Daily',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="story"
        options={{
          tabBarActiveBackgroundColor: c[toolStripe.story],
          title: 'Story',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="book.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarActiveBackgroundColor: c[toolStripe.settings],
          title: 'More',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="chevron.right" color={color} />,
        }}
      />
    </Tabs>
  );
}

function WideLayout() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wideRoot, { backgroundColor: c.background }]}>
      <Sidebar />
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <PageContainer style={styles.page}>
          <Slot />
        </PageContainer>
      </View>
    </View>
  );
}

export default function AppLayout() {
  const { isWide } = useBreakpoint();
  if (isWide) return <WideLayout />;
  return <MobileTabs />;
}

const styles = StyleSheet.create({
  wideRoot: { flex: 1, flexDirection: 'row' },
  content: {
    flex: 1,
    width: '100%',
  },
  page: { flex: 1 },
});
