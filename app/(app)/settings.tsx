import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Badge, PageHeader } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { layout, radius, spacing } from '@/constants/Theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { pingBackend } from '@/lib/api';
import {
  clearAllData,
  getSettings,
  saveSettings,
  type AppSettings,
} from '@/lib/storage';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  const { appearance, setAppearance } = useAppTheme();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    const s = await getSettings();
    setSettings(s);
    setBackendOk(await pingBackend());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (patch: Partial<AppSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    await saveSettings(next);
    showToast('Settings saved');
    if (patch.apiBaseUrl) setBackendOk(await pingBackend());
  };

  const appearanceOptions: AppSettings['appearance'][] = ['system', 'light', 'dark'];

  return (
    <ThemedView style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}>
        <PageHeader tone="mint" title="Settings" subtitle="Configure your learning environment" />

        <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
          <ThemedText type="label">Connection</ThemedText>
          <ThemedText type="caption" style={{ color: c.textSecondary, marginTop: spacing.xs, marginBottom: spacing.md }}>
            Backend API URL (use your LAN IP on physical devices)
          </ThemedText>
          <Input
            value={settings?.apiBaseUrl ?? ''}
            onChangeText={(v) => setSettings((s) => (s ? { ...s, apiBaseUrl: v } : s))}
            onBlur={() => settings && update({ apiBaseUrl: settings.apiBaseUrl })}
            placeholder="http://localhost:3000"
            autoCapitalize="none"
          />
          <View style={styles.statusRow}>
            <ThemedText type="bodySm" style={{ color: c.textSecondary }}>Backend status</ThemedText>
            <Badge
              label={backendOk === null ? 'Checking…' : backendOk ? 'Connected' : 'Offline'}
              variant={backendOk ? 'success' : 'warning'}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
          <ThemedText type="label">Profile</ThemedText>
          <Input
            value={settings?.learnerName ?? ''}
            onChangeText={(v) => setSettings((s) => (s ? { ...s, learnerName: v } : s))}
            onBlur={() => settings && update({ learnerName: settings.learnerName })}
            placeholder="Your name"
            style={{ marginTop: spacing.md }}
          />
        </View>

        <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
          <ThemedText type="label">Appearance</ThemedText>
          <View style={styles.appearanceRow}>
            {appearanceOptions.map((opt) => (
              <Button
                key={opt}
                label={opt.charAt(0).toUpperCase() + opt.slice(1)}
                variant={appearance === opt ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => setAppearance(opt)}
              />
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
          <ThemedText type="label">Data</ThemedText>
          <ThemedText type="caption" style={{ color: c.textSecondary, marginTop: spacing.xs, marginBottom: spacing.md }}>
            Clear locally stored history, bookmarks, and progress
          </ThemedText>
          <Button
            label="Clear all data"
            variant="secondary"
            onPress={async () => {
              await clearAllData();
              showToast('All data cleared');
            }}
          />
        </View>

        <ThemedText type="caption" style={{ color: c.textSecondary, textAlign: 'center', marginTop: spacing.xl }}>
          KoLearn v1.0.0
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.xl,
    maxWidth: layout.maxWidthReader,
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  appearanceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: 'wrap',
  },
});
