import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Linking,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

type Article = { title?: string; link?: string; content?: string };

export default function DailyScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const c = Colors[colorScheme];
  const cardBg = c.card;
  const borderColor = c.border;
  const tint = c.tint;
  const pastelSky = c.pastelSky;
  const pastelPeach = c.pastelPeach;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://192.168.1.181:3000/news')
      .then((res) => res.json())
      .then((data) => setArticles(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setError('Could not load articles. Check your connection.');
        setArticles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const openLink = (url?: string) => {
    if (url) Linking.openURL(url);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#e0f2fe', dark: '#0c4a6e' }}
      headerImage={
        <View style={styles.headerBadge}>
          <ThemedText style={styles.headerLabel}>Daily reading</ThemedText>
          <ThemedText style={styles.headerSub}>Read & learn Korean</ThemedText>
        </View>
      }>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Daily</ThemedText>
        <ThemedText style={styles.subtitle}>Practice with new articles every day</ThemedText>
      </ThemedView>

      {loading ? (
        <ThemedView style={styles.centerBox}>
          <ActivityIndicator size="large" color={tint} />
          <ThemedText style={styles.loadingText}>Loading articles…</ThemedText>
        </ThemedView>
      ) : error ? (
        <ThemedView style={[styles.card, styles.errorCard, { backgroundColor: pastelPeach, borderColor }]}>
          <MaterialIcons name="wifi-off" size={44} color={c.icon} />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </ThemedView>
      ) : articles.length === 0 ? (
        <ThemedView style={[styles.card, { backgroundColor: pastelSky, borderColor }]}>
          <MaterialIcons name="menu-book" size={40} color={c.icon} />
          <ThemedText style={styles.emptyText}>No articles yet. Check back later!</ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.list}>
          {articles.map((article, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.85}
              onPress={() => openLink(article.link)}
              style={[
                styles.card,
                {
                  backgroundColor: index % 2 === 0 ? pastelSky : pastelPeach,
                  borderColor,
                },
              ]}>
              <ThemedText type="defaultSemiBold" style={styles.articleTitle} numberOfLines={2}>
                {article.title || 'Untitled'}
              </ThemedText>
              {article.content ? (
                <ThemedText style={styles.articleExcerpt} numberOfLines={3}>
                  {article.content}
                </ThemedText>
              ) : null}
              {article.link ? (
                <View style={[styles.linkRow, { backgroundColor: tint }]}>
                  <MaterialIcons name="open-in-new" size={16} color="#fff" />
                  <ThemedText style={styles.linkText}>Read article</ThemedText>
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerBadge: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 13,
    opacity: 0.85,
    marginTop: 2,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.85,
    marginTop: 6,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    gap: 20,
  },
  loadingText: {
    fontSize: 15,
    opacity: 0.9,
  },
  list: {
    gap: 14,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  errorCard: {
    alignItems: 'center',
    gap: 14,
    paddingVertical: 36,
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.95,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 12,
  },
  articleTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  articleExcerpt: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
    marginBottom: 14,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 6,
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
