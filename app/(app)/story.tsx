import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Clipboard from 'expo-clipboard';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PageHeader } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Colors } from '@/constants/Colors';
import { layout, radius, spacing } from '@/constants/Theme';
import { useToast } from '@/contexts/ToastContext';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useColorScheme } from '@/hooks/useColorScheme';
import { fetchStory } from '@/lib/api';
import { getSavedStories, saveStory, type SavedStory } from '@/lib/storage';

const PRESETS: Record<string, string[]> = {
  Beginner: ['안녕', '사랑', '학교', '친구'],
  Travel: ['여행', '공항', '호텔', '지도'],
  Food: ['음식', '김치', '맛있', '레스토랑'],
};

export default function StoryScreen() {
  const [words, setWords] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<SavedStory[]>([]);

  const insets = useSafeAreaInsets();
  const { isWide } = useBreakpoint();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  const { showToast } = useToast();

  const wordChips = useMemo(
    () => words.split(/[,،、\s]+/).map((w) => w.trim()).filter(Boolean),
    [words]
  );

  const loadSaved = useCallback(async () => {
    setSaved(await getSavedStories());
  }, []);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const generate = async () => {
    if (wordChips.length === 0) return;
    setLoading(true);
    setStory('');
    try {
      const result = await fetchStory(wordChips);
      setStory(result);
    } catch {
      setStory('Something went wrong. Check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const saveCurrent = async () => {
    if (!story || wordChips.length === 0) return;
    await saveStory({ words: wordChips, story });
    showToast('Story saved');
    loadSaved();
  };

  const copyStory = async () => {
    await Clipboard.setStringAsync(story);
    showToast('Copied to clipboard');
  };

  const removeChip = (word: string) => {
    setWords(wordChips.filter((w) => w !== word).join(', '));
  };

  const addPreset = (preset: string[]) => {
    setWords(preset.join(', '));
  };

  return (
    <ThemedView style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}>
        <PageHeader title="Story Studio" subtitle="Weave vocabulary into memorable Korean narratives" />

        <View style={[isWide && styles.columns]}>
          <View style={styles.col}>
            <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
              <ThemedText type="label">Word bank</ThemedText>
              <TextArea
                value={words}
                onChangeText={setWords}
                placeholder="Enter words separated by commas or spaces…"
                editable={!loading}
              />
              {wordChips.length > 0 && (
                <View style={styles.chips}>
                  {wordChips.map((word) => (
                    <Pressable
                      key={word}
                      onPress={() => removeChip(word)}
                      style={[styles.chip, { backgroundColor: c.accentMuted }]}>
                      <ThemedText type="bodySm" korean style={{ color: c.tint }}>{word}</ThemedText>
                      <MaterialIcons name="close" size={14} color={c.tint} />
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <ThemedText type="label" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>Presets</ThemedText>
            <View style={styles.presets}>
              {Object.entries(PRESETS).map(([name, preset]) => (
                <Button key={name} label={name} variant="secondary" size="sm" onPress={() => addPreset(preset)} />
              ))}
            </View>

            <Button
              label={loading ? 'Generating…' : 'Generate story'}
              icon="auto-stories"
              onPress={generate}
              disabled={loading || wordChips.length === 0}
              loading={loading}
              style={{ marginTop: spacing.lg }}
            />
          </View>

          <View style={[styles.col, styles.outputCol]}>
            <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
              <ThemedText type="label">Your story</ThemedText>
              {loading ? (
                <View style={{ marginTop: spacing.lg }}>
                  <Skeleton height={16} />
                  <Skeleton height={16} style={{ marginTop: 8 }} />
                  <Skeleton height={16} style={{ marginTop: 8 }} width="80%" />
                </View>
              ) : story ? (
                <>
                  <ThemedText korean style={[styles.storyText, { color: c.text }]}>{story}</ThemedText>
                  <View style={styles.storyActions}>
                    <Button label="Save" variant="secondary" icon="bookmark" onPress={saveCurrent} size="sm" />
                    <Button label="Copy" variant="ghost" icon="content-copy" onPress={copyStory} size="sm" />
                  </View>
                </>
              ) : (
                <ThemedText type="bodySm" style={{ color: c.textSecondary, marginTop: spacing.lg }}>
                  Add words and generate a story to see it here.
                </ThemedText>
              )}
            </View>

            {saved.length > 0 && (
              <>
                <ThemedText type="label" style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>Saved stories</ThemedText>
                {saved.slice(0, 5).map((s) => (
                  <View key={s.id} style={[styles.savedItem, { backgroundColor: c.card, borderColor: c.border }]}>
                    <ThemedText type="caption" style={{ color: c.textSecondary }}>
                      {new Date(s.createdAt).toLocaleDateString()} · {s.words.join(', ')}
                    </ThemedText>
                    <ThemedText type="bodySm" korean numberOfLines={2} style={{ marginTop: spacing.xs }}>{s.story}</ThemedText>
                  </View>
                ))}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.xl,
    maxWidth: layout.maxWidthForm,
    alignSelf: 'center',
    width: '100%',
  },
  columns: { flexDirection: 'row', gap: spacing.xl },
  col: { flex: 1 },
  outputCol: { marginTop: 0 },
  section: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  storyText: { fontSize: 17, lineHeight: 28, marginTop: spacing.lg },
  storyActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  savedItem: {
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
});
