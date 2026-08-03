import { StyleSheet, View, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { radius, spacing } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export function Badge({ label, variant = 'default' }: { label: string; variant?: 'default' | 'success' | 'warning' }) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  const bg =
    variant === 'success' ? c.successMuted : variant === 'warning' ? c.warningMuted : c.accentMuted;
  const color =
    variant === 'success' ? c.success : variant === 'warning' ? c.warning : c.tint;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <ThemedText style={[styles.text, { color }]}>{label}</ThemedText>
    </View>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
  style,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];

  return (
    <View style={[styles.header, style]}>
      <View style={styles.textCol}>
        <ThemedText type="h1">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="bodySm" style={{ color: c.textSecondary, marginTop: spacing.xs }}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {action}
    </View>
  );
}

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];

  return (
    <View style={[styles.stat, { backgroundColor: c.card, borderColor: c.border }]}>
      {icon}
      <ThemedText type="h2" style={{ marginTop: spacing.sm }}>{value}</ThemedText>
      <ThemedText type="caption" style={{ color: c.textSecondary, marginTop: 2 }}>{label}</ThemedText>
    </View>
  );
}

export function FeatureCard({
  title,
  description,
  icon,
  onPress,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];

  return (
    <View style={[styles.feature, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={[styles.featureIcon, { backgroundColor: c.accentMuted }]}>{icon}</View>
      <ThemedText type="label" style={{ marginTop: spacing.md }}>{title}</ThemedText>
      <ThemedText type="caption" style={{ color: c.textSecondary, marginTop: spacing.xs }}>{description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '600' },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  textCol: { flex: 1 },
  stat: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    minWidth: 120,
  },
  feature: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    minWidth: 140,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
