import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Badge, StatCard } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import { layout, radius, spacing } from "@/constants/Theme";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useColorScheme } from "@/hooks/useColorScheme";
import { fetchNews } from "@/lib/api";
import { setArticles } from "@/lib/articles";
import {
  computeStreak,
  getActivity,
  getSavedStories,
  getSettings,
  getTranslations,
  type TranslationEntry
} from "@/lib/storage";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isWide } = useBreakpoint();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];

  const [name, setName] = useState("Guest");
  const [streak, setStreak] = useState(0);
  const [translations, setTranslationsCount] = useState(0);
  const [articlesRead, setArticlesRead] = useState(0);
  const [recentTranslations, setRecentTranslations] = useState<
    TranslationEntry[]
  >([]);
  const [featuredTitle, setFeaturedTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settings, activity, history, stories, articles] =
        await Promise.all([
          getSettings(),
          getActivity(),
          getTranslations(),
          getSavedStories(),
          fetchNews().catch(() => []),
        ]);
      setArticles(articles);
      setName(settings.learnerName);
      setStreak(computeStreak(activity.dates));
      setTranslationsCount(activity.translationsCount);
      setArticlesRead(activity.articlesReadCount);
      setRecentTranslations(history.slice(0, 3));
      if (articles[0]) {
        setFeaturedTitle(articles[0].title ?? null);
      }
      if (stories[0] && history.length === 0) {
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const quickActions = [
    {
      title: "Translate",
      desc: "Instant translation",
      icon: "translate" as const,
      href: "/translate",
    },
    {
      title: "Daily News",
      desc: "Read in Korean",
      icon: "newspaper" as const,
      href: "/daily",
    },
    {
      title: "Story",
      desc: "Build vocabulary",
      icon: "auto-stories" as const,
      href: "/story",
    },
  ];

  return (
    <ThemedView style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View>
            <ThemedText type="bodySm" style={{ color: c.textSecondary }}>
              {greeting()}
            </ThemedText>
            <ThemedText type="hero" style={{ marginTop: spacing.xs }}>
              {name}
            </ThemedText>
            <ThemedText
              type="bodySm"
              korean
              style={{ color: c.textSecondary, marginTop: spacing.xs }}
            >
              오늘도 한국어 공부 화이팅!
            </ThemedText>
          </View>
          <View
            style={[styles.streakBadge, { backgroundColor: c.accentMuted }]}
          >
            <MaterialIcons
              name="local-fire-department"
              size={22}
              color={c.tint}
            />
            <ThemedText type="h2" style={{ color: c.tint }}>
              {streak}
            </ThemedText>
            <ThemedText type="caption" style={{ color: c.tint }}>
              day streak
            </ThemedText>
          </View>
        </View>

        <View style={[styles.statsRow, isWide && styles.statsRowWide]}>
          <StatCard
            label="Translations"
            value={translations}
            icon={<MaterialIcons name="translate" size={20} color={c.tint} />}
          />
          <StatCard
            label="Articles read"
            value={articlesRead}
            icon={<MaterialIcons name="menu-book" size={20} color={c.tint} />}
          />
        </View>

        <ThemedText type="label" style={styles.sectionTitle}>
          Quick actions
        </ThemedText>
        <View style={[styles.actionsRow, isWide && styles.actionsRowWide]}>
          {quickActions.map((action) => (
            <Pressable
              key={action.href}
              onPress={() => router.push(action.href as never)}
              style={[
                styles.actionCard,
                { backgroundColor: c.card, borderColor: c.border },
              ]}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: c.accentMuted }]}
              >
                <MaterialIcons name={action.icon} size={22} color={c.tint} />
              </View>
              <ThemedText type="label">{action.title}</ThemedText>
              <ThemedText type="caption" style={{ color: c.textSecondary }}>
                {action.desc}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {loading ? (
          <SkeletonCard />
        ) : featuredTitle ? (
          <>
            <ThemedText type="label" style={styles.sectionTitle}>
              Featured article
            </ThemedText>
            <Pressable
              onPress={() => router.push("/daily/0" as never)}
              style={[
                styles.featured,
                { backgroundColor: c.card, borderColor: c.border },
              ]}
            >
              <Badge label="Today's pick" />
              <ThemedText
                type="h2"
                korean
                style={{ marginTop: spacing.md }}
                numberOfLines={2}
              >
                {featuredTitle}
              </ThemedText>
              <View style={styles.featuredFooter}>
                <ThemedText type="bodySm" style={{ color: c.tint }}>
                  Read now
                </ThemedText>
                <MaterialIcons name="arrow-forward" size={16} color={c.tint} />
              </View>
            </Pressable>
          </>
        ) : null}

        <ThemedText type="label" style={styles.sectionTitle}>
          Recent activity
        </ThemedText>
        {recentTranslations.length === 0 ? (
          <View
            style={[
              styles.emptyRecent,
              { backgroundColor: c.card, borderColor: c.border },
            ]}
          >
            <ThemedText type="bodySm" style={{ color: c.textSecondary }}>
              No translations yet. Start with a quick phrase!
            </ThemedText>
            <Button
              label="Open Translate"
              onPress={() => router.push("/translate" as never)}
              style={{ marginTop: spacing.md }}
              size="sm"
            />
          </View>
        ) : (
          recentTranslations.map((entry) => (
            <View
              key={entry.id}
              style={[
                styles.recentItem,
                { backgroundColor: c.card, borderColor: c.border },
              ]}
            >
              <ThemedText type="bodySm" numberOfLines={1}>
                {entry.source}
              </ThemedText>
              <ThemedText
                type="bodySm"
                korean
                style={{ color: c.textSecondary, marginTop: spacing.xs }}
                numberOfLines={1}
              >
                {entry.result}
              </ThemedText>
            </View>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.xl,
    maxWidth: layout.maxWidthDashboard,
    alignSelf: "center",
    width: "100%",
  },
  hero: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xl,
  },
  streakBadge: {
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: radius.lg,
    minWidth: 90,
  },
  statsRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.xl },
  statsRowWide: { maxWidth: 400 },
  sectionTitle: { marginBottom: spacing.md },
  actionsRow: {
    flexDirection: "column",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionsRowWide: { flexDirection: "row" },
  actionCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  featured: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  featuredFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  emptyRecent: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  recentItem: {
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
});
