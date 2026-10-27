import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { radius, spacing } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
  word: string;
  meaning: string | null;
  loading?: boolean;
  failed?: boolean;
  onRetry?: () => void;
};

/** A key word on butter marker with its English meaning beside it. */
export function MeaningChip({ word, meaning, loading, failed, onRetry }: Props) {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const text = failed ? 'Could not load the meaning. Tap to retry.' : loading ? 'Looking up…' : meaning ?? '';

  return (
    <Pressable
      accessibilityRole={failed ? 'button' : 'text'}
      accessibilityLabel={`${word} means ${text}`}
      disabled={!failed}
      onPress={onRetry}
      style={[styles.row, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={[styles.word, { backgroundColor: c.highlight }]}>
        <ThemedText type="h2" korean style={{ color: c.highlightText }}>
          {word}
        </ThemedText>
      </View>
      <ThemedText type="body" style={styles.meaning} numberOfLines={2}>
        {text}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    paddingRight: spacing.lg,
    minHeight: 56,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  word: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.full },
  meaning: { flex: 1, fontWeight: '500' },
});
