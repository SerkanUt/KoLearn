import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button, IconButton } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { fonts, layout, radius, spacing } from '@/constants/Theme';
import { useToast } from '@/contexts/ToastContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getArticleById } from '@/lib/articles';
import { articleId, getBookmarks, markArticleRead, toggleBookmark } from '@/lib/storage';

export default function ArticleReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  const { showToast } = useToast();

  const article = getArticleById(id ?? '0');
  const index = parseInt(id ?? '0', 10);
  const articleKey = article ? articleId(article, index) : '';

  const [bookmarked, setBookmarked] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordTranslation, setWordTranslation] = useState('');
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (articleKey) {
      markArticleRead(articleKey);
      getBookmarks().then((b) => setBookmarked(b.includes(articleKey)));
    }
  }, [articleKey]);

  const toggleBook = async () => {
    const next = await toggleBookmark(articleKey);
    setBookmarked(next);
    showToast(next ? 'Bookmarked' : 'Bookmark removed');
  };

  const translateWord = useCallback(async (word: string) => {
    setSelectedWord(word);
    setWordTranslation('');
    setTranslating(true);
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=ko|en`
      );
      const data = await res.json();
      setWordTranslation(data.responseData?.translatedText ?? 'No translation found');
    } catch {
      setWordTranslation('Translation failed');
    } finally {
      setTranslating(false);
    }
  }, []);

  if (!article) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="h2">Article not found</ThemedText>
        <Button label="Go back" onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
      </ThemedView>
    );
  }

  const words = (article.content ?? '').split(/(\s+)/);

  return (
    <ThemedView style={styles.root}>
      <View style={[styles.toolbar, { paddingTop: insets.top + spacing.sm, backgroundColor: c.card, borderBottomColor: c.border }]}>
        <IconButton icon="arrow-back" onPress={() => router.back()} />
        <View style={styles.toolbarActions}>
          <IconButton
            icon={bookmarked ? 'bookmark' : 'bookmark-border'}
            onPress={toggleBook}
            color={bookmarked ? c.tint : c.text}
          />
          {article.link ? (
            <IconButton icon="open-in-new" onPress={() => Linking.openURL(article.link!)} />
          ) : null}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxxl, maxWidth: layout.maxWidthReader }]}>
        <ThemedText type="caption" style={{ color: c.textSecondary }}>국제 뉴스</ThemedText>
        <ThemedText type="h1" korean style={[styles.title, { fontFamily: fonts.koreanBold }]}>
          {article.title}
        </ThemedText>
        <View style={[styles.divider, { backgroundColor: c.border }]} />
        <View style={styles.body}>
          {words.map((segment, i) => {
            const trimmed = segment.trim();
            if (!trimmed) return <ThemedText key={i}> </ThemedText>;
            return (
              <Pressable key={i} onPress={() => translateWord(trimmed)}>
                <ThemedText
                  korean
                  style={[
                    styles.word,
                    { fontFamily: fonts.korean, color: c.text },
                    selectedWord === trimmed && { backgroundColor: c.highlight, color: c.highlightText },
                  ]}>
                  {segment}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={!!selectedWord} transparent animationType="slide" onRequestClose={() => setSelectedWord(null)}>
        <Pressable style={[styles.modalBg, { backgroundColor: c.overlay }]} onPress={() => setSelectedWord(null)}>
          <Pressable style={[styles.sheet, { backgroundColor: c.card }]} onPress={(e) => e.stopPropagation()}>
            <ThemedText type="label" korean style={{ fontSize: 22 }}>{selectedWord}</ThemedText>
            <ThemedText type="body" style={{ color: c.textSecondary, marginTop: spacing.md }}>
              {translating ? 'Translating…' : wordTranslation}
            </ThemedText>
            <Button label="Close" variant="secondary" onPress={() => setSelectedWord(null)} style={{ marginTop: spacing.lg }} />
          </Pressable>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  toolbarActions: { flexDirection: 'row' },
  content: {
    padding: spacing.xl,
    alignSelf: 'center',
    width: '100%',
  },
  title: { marginTop: spacing.sm, lineHeight: 36 },
  divider: { height: 1, marginVertical: spacing.xl },
  body: { flexDirection: 'row', flexWrap: 'wrap' },
  word: { fontSize: 20, lineHeight: 36 },
  modalBg: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    padding: spacing.xl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
});
