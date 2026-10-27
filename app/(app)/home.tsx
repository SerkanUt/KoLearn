import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { MeaningChip } from "@/components/ui/MeaningChip";
import { StripeBand } from "@/components/ui/StripeBand";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Colors, toolStripe } from "@/constants/Colors";
import { layout, radius, spacing } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { fetchNews, translateWord } from "@/lib/api";
import { setArticles } from "@/lib/articles";
import {
  computeStreak,
  getActivity,
  getSettings,
  getTranslations,
  type TranslationEntry,
} from "@/lib/storage";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// Key words are the two longest Hangul tokens in the headline.
function pickKeyWords(title: string): string[] {
  const tokens = title
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter((t) => /[가-힣]/.test(t) && t.length >= 2);
  return [...new Set(tokens)].sort((a, b) => b.length - a.length).slice(0, 2);
}

function HighlightedTitle({ title, keys }: { title: string; keys: string[] }) {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const parts = title.split(/(\s+)/);
  return (
    <ThemedText type="display" numberOfLines={5} style={styles.headline}>
      {parts.map((part, i) => {
        const hit = keys.some((k) => part.includes(k));
        return hit ? (
          <ThemedText
            key={i}
            type="display"
            style={[styles.headline, { backgroundColor: c.highlight, color: c.highlightText }]}
          >
            {part}
          </ThemedText>
        ) : (
          part
        );
      })}
    </ThemedText>
  );
}

const destinations = [
  { title: "Translate", desc: "Any of 16 languages", icon: "translate" as const, href: "/translate", tone: toolStripe.translate },
  { title: "Daily news", desc: "More articles to read", icon: "newspaper" as const, href: "/daily", tone: toolStripe.daily },
  { title: "Story", desc: "Turn your words into a story", icon: "auto-stories" as const, href: "/story", tone: toolStripe.story },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];

  const [name, setName] = useState("Guest");
  const [streak, setStreak] = useState(0);
  const [dates, setDates] = useState<string[]>([]);
  const [recentTranslations, setRecentTranslations] = useState<TranslationEntry[]>([]);
  const [featuredTitle, setFeaturedTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [meaning, setMeaning] = useState<string | null>(null);
  const [meaningLoading, setMeaningLoading] = useState(false);
  const [meaningFailed, setMeaningFailed] = useState(false);

  const keys = featuredTitle ? pickKeyWords(featuredTitle) : [];
  const primaryKey = keys[0];

  const loadMeaning = useCallback(async (word: string) => {
    setMeaningLoading(true);
    setMeaningFailed(false);
    try {
      const text = await translateWord(word);
      if (text) setMeaning(text);
      else setMeaningFailed(true);
    } catch {
      setMeaningFailed(true);
    } finally {
      setMeaningLoading(false);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settings, activity, history, articles] = await Promise.all([
        getSettings(),
        getActivity(),
        getTranslations(),
        fetchNews().catch(() => []),
      ]);
      setArticles(articles);
      setName(settings.learnerName);
      setStreak(computeStreak(activity.dates));
      setDates(activity.dates);
      setRecentTranslations(history.slice(0, 3));
      setFeaturedTitle(articles[0]?.title ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (primaryKey) loadMeaning(primaryKey);
  }, [primaryKey, loadMeaning]);

  return (
    <ThemedView style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}>
        <ThemedText type="bodySm" style={{ color: c.textSecondary }}>
          {greeting()}, {name}
          {streak > 0 ? ` · ${streak}-day streak` : ""}
        </ThemedText>
        <ThemedText type="hero" style={styles.title}>
          오늘 <ThemedText type="hero" style={{ color: c.textSecondary }}>Today</ThemedText>
        </ThemedText>
        <StripeBand dates={dates} />

        {loading ? (
          <SkeletonCard />
        ) : featuredTitle ? (
          <View style={styles.today}>
            <HighlightedTitle title={featuredTitle} keys={keys} />
            {primaryKey ? (
              <View style={styles.reveal}>
                <MeaningChip
                  word={primaryKey}
                  meaning={meaning}
                  loading={meaningLoading}
                  failed={meaningFailed}
                  onRetry={() => loadMeaning(primaryKey)}
                />
              </View>
            ) : null}
            <Button
              label="Continue reading"
              icon="arrow-forward"
              onPress={() => router.push("/daily/0" as never)}
              style={styles.cta}
            />
          </View>
        ) : (
          <View style={[styles.empty, { borderColor: c.border }]}>
            <ThemedText type="h2">No article today</ThemedText>
            <ThemedText type="bodySm" style={{ color: c.textSecondary, marginTop: spacing.xs }}>
              Check that the backend is running, then try again.
            </ThemedText>
            <Button label="Try again" variant="secondary" onPress={load} style={{ marginTop: spacing.lg }} />
          </View>
        )}

        <View style={styles.list}>
          {destinations.map((d, i) => (
            <Pressable
              key={d.href}
              accessibilityRole="link"
              accessibilityLabel={`${d.title}. ${d.desc}`}
              onPress={() => router.push(d.href as never)}
              style={({ pressed }) => [
                styles.listRow,
                {
                  borderTopColor: c.border,
                  borderTopWidth: i === 0 ? StyleSheet.hairlineWidth : 0,
                  borderBottomColor: c.border,
                  opacity: pressed ? 0.6 : 1,
                },
              ]}>
              <View style={[styles.iconDisc, { backgroundColor: c[d.tone] }]}>
                <MaterialIcons name={d.icon} size={22} color={c.text} />
              </View>
              <View style={styles.listText}>
                <ThemedText type="body" style={{ fontWeight: "600" }}>
                  {d.title}
                </ThemedText>
                <ThemedText type="caption" style={{ color: c.textSecondary }}>
                  {d.desc}
                </ThemedText>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={c.icon} />
            </Pressable>
          ))}
        </View>

        {recentTranslations.length > 0 ? (
          <View style={styles.recent}>
            <ThemedText type="label" style={{ color: c.textSecondary, marginBottom: spacing.sm }}>
              Recently translated
            </ThemedText>
            {recentTranslations.map((entry) => (
              <View key={entry.id} style={[styles.recentItem, { borderBottomColor: c.border }]}>
                <ThemedText type="bodySm" numberOfLines={1} style={{ color: c.textSecondary }}>
                  {entry.source}
                </ThemedText>
                <ThemedText type="body" korean numberOfLines={1}>
                  {entry.result}
                </ThemedText>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.xl,
    maxWidth: layout.maxWidthReader,
    alignSelf: "center",
    width: "100%",
  },
  title: { marginTop: spacing.xs, marginBottom: spacing.lg },
  today: { marginBottom: spacing.xxl },
  headline: { fontSize: 34, lineHeight: 52 },
  reveal: { marginTop: spacing.xl },
  cta: { marginTop: spacing.xl },
  empty: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.xxl,
  },
  list: { marginBottom: spacing.xl },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: 56,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listText: { flex: 1 },
  iconDisc: { width: 44, height: 44, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  recent: { marginTop: spacing.lg },
  recentItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
