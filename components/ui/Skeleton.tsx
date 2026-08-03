import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';
import { radius } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export function Skeleton({ width, height, style }: { width?: number | `${number}%`; height: number; style?: ViewStyle }) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  return (
    <View
      style={[
        styles.base,
        { width: width ?? '100%', height, backgroundColor: c.border },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
      <Skeleton height={14} width="40%" />
      <Skeleton height={20} width="90%" style={{ marginTop: 12 }} />
      <Skeleton height={20} width="70%" style={{ marginTop: 8 }} />
      <Skeleton height={14} width="30%" style={{ marginTop: 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.sm, opacity: 0.5 },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 20,
  },
});
