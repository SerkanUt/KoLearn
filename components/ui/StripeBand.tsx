import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Colors, type StripeName } from '@/constants/Colors';
import { radius, spacing } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

const ORDER: StripeName[] = ['rose', 'butter', 'mint', 'sky', 'lilac', 'rose', 'butter'];
const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** The week as a saekdong sleeve: a studied day fills its stripe, today is ringed, the rest stay outlined. */
export function StripeBand({ dates }: { dates: string[] }) {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const mondayOffset = (now.getDay() + 6) % 7;
  const done = new Set(dates);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - mondayOffset + i);
    return { key: isoDay(d), isToday: i === mondayOffset, future: i > mondayOffset };
  });
  const count = days.filter((d) => done.has(d.key)).length;

  return (
    <View
      accessible
      accessibilityLabel={`${count} of 7 days studied this week`}
      style={styles.wrap}>
      <View style={styles.band}>
        {days.map((d, i) => {
          const filled = done.has(d.key);
          return (
            <View key={d.key} style={styles.col}>
              <View
                style={[
                  styles.stripe,
                  filled
                    ? { backgroundColor: c[ORDER[i]] }
                    : { borderColor: c.border, borderWidth: 2, backgroundColor: 'transparent' },
                  d.isToday && { borderColor: c.tint, borderWidth: 2 },
                ]}
              />
              <ThemedText
                type="caption"
                korean
                style={{ color: d.isToday ? c.tint : c.textSecondary, opacity: d.future ? 0.6 : 1 }}>
                {DAY_LABELS[i]}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.xl },
  band: { flexDirection: 'row', gap: spacing.sm },
  col: { flex: 1, alignItems: 'center', gap: spacing.xs },
  stripe: { height: 44, width: '100%', borderRadius: radius.sm },
});
