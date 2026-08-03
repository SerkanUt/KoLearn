import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { radius, spacing } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

type EmptyStateProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];

  return (
    <View style={[styles.wrap, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: c.accentMuted }]}>
        <MaterialIcons name={icon} size={32} color={c.tint} />
      </View>
      <ThemedText type="h2" style={styles.title}>{title}</ThemedText>
      {description ? (
        <ThemedText type="bodySm" style={{ color: c.textSecondary, textAlign: 'center' }}>{description}</ThemedText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={{ marginTop: spacing.lg }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    padding: spacing.xxl,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { marginBottom: spacing.sm, textAlign: 'center' },
});
