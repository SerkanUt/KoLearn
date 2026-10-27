import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Badge, PageHeader } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Colors } from '@/constants/Colors';
import type { Article } from '@/constants/Api';
import { layout, radius, spacing } from '@/constants/Theme';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useColorScheme } from '@/hooks/useColorScheme';
import { setArticles } from '@/lib/articles';
import { fetchNews } from '@/lib/api';
import { articleId, getBookmarks, getReadArticles, toggleBookmark } from '@/lib/storage';

type Filter = 'all' | 'unread' | 'bookmarked';

function readTime(content?: string) {
  if (!content) return '2 min';
  return `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min`;
}

export default function DailyIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isWide } = useBreakpoint();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];

  const [articles, setArticlesList] = useState<Article[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const [data, bm, read] = await Promise.all([fetchNews(), getBookmarks(), getReadArticles()]);
      setArticles(data);
      setArticlesList(data);
      setBookmarks(bm);
      setReadIds(read);
    } catch {
      setError('Could not load articles. Check backend in Settings.');
      setArticlesList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return articles.filter((a, i) => {
      const id = articleId(a, i);
      if (filter === 'bookmarked') return bookmarks.includes(id);
      if (filter === 'unread') return !readIds.includes(id);
      return true;
    });
  }, [articles, bookmarks, readIds, filter]);

  const handleBookmark = async (a: Article, index: number, e?: { stopPropagation?: () => void }) => {
    e?.stopPropagation?.();
    const id = articleId(a, index);
    await toggleBookmark(id);
    setBookmarks(await getBookmarks());
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'bookmarked', label: 'Saved' },
  ];

  return (
    <ThemedView style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={c.tint} />}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}>
        <PageHeader tone="rose" title="Daily News" subtitle="Read real Korean articles and build comprehension" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          {filters.map((f) => (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === f.key ? c.tint : c.card,
                  borderColor: c.border,
                },
              ]}>
              <ThemedText
                type="bodySm"
                style={{ color: filter === f.key ? '#fff' : c.text, fontWeight: filter === f.key ? '600' : '400' }}>
                {f.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : error ? (
          <EmptyState icon="cloud-off" title="Connection issue" description={error} actionLabel="Retry" onAction={() => load()} />
        ) : filtered.length === 0 ? (
          <EmptyState icon="newspaper" title="No articles" description="Try a different filter or refresh the feed." />
        ) : (
          <View style={[styles.grid, isWide && styles.gridWide]}>
            {filtered.map((article) => {
              const realIndex = articles.indexOf(article);
              const id = articleId(article, realIndex);
              const isBookmarked = bookmarks.includes(id);
              const isRead = readIds.includes(id);

              return (
                <Pressable
                  key={id}
                  onPress={() => router.push(`/daily/${realIndex}` as never)}
                  style={[
                    styles.card,
                    isWide && styles.cardWide,
                    { backgroundColor: c.card, borderColor: c.border },
                  ]}>
                  <View style={[styles.thumb, { backgroundColor: c.accentMuted }]}>
                    <MaterialIcons name="article" size={28} color={c.tint} />
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.cardMeta}>
                      <Badge label="국제" />
                      <ThemedText type="caption" style={{ color: c.textSecondary }}>{readTime(article.content)}</ThemedText>
                    </View>
                    <ThemedText type="label" korean numberOfLines={2} style={{ marginTop: spacing.sm }}>
                      {article.title || 'Untitled'}
                    </ThemedText>
                    {article.content ? (
                      <ThemedText type="bodySm" style={{ color: c.textSecondary, marginTop: spacing.sm }} numberOfLines={2}>
                        {article.content}
                      </ThemedText>
                    ) : null}
                    <View style={styles.cardFooter}>
                      {isRead ? <Badge label="Read" variant="success" /> : <View />}
                      <Pressable onPress={() => handleBookmark(article, realIndex)}>
                        <MaterialIcons
                          name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                          size={22}
                          color={isBookmarked ? c.tint : c.icon}
                        />
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
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
    alignSelf: 'center',
    width: '100%',
  },
  filters: { marginBottom: spacing.lg },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  grid: { gap: spacing.lg },
  gridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardWide: {
    width: '48%',
  },
  thumb: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { padding: spacing.lg },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
});
