import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function StoryScreen() {
  const [words, setWords] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const c = Colors[colorScheme];
  const cardBg = c.card;
  const borderColor = c.border;
  const tint = c.tint;
  const pastelPink = c.pastelPink;
  const pastelMint = c.pastelMint;

  const sendWords = async () => {
    const list = words
      .split(/[,،、\s]+/)
      .map((w) => w.trim())
      .filter(Boolean);
    if (list.length === 0) return;
    setLoading(true);
    setStory('');
    try {
      const res = await fetch('http://192.168.1.181:3000/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: list }),
      });
      const data = await res.json();
      setStory(data.story ?? '');
    } catch (err) {
      console.error(err);
      setStory('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#d1fae5', dark: '#064e3b' }}
      headerImage={
        <View style={styles.headerBadge}>
          <ThemedText style={styles.headerLabel}>Story maker</ThemedText>
          <ThemedText style={styles.headerSub}>Words → story</ThemedText>
        </View>
      }>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Story</ThemedText>
        <ThemedText style={styles.subtitle}>Generate a short story from your vocabulary words</ThemedText>
      </ThemedView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}>
        <ThemedView style={[styles.card, { backgroundColor: pastelPink, borderColor }]}>
          <ThemedText style={styles.label}>Enter words (comma or space separated)</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: cardBg, borderColor, color: c.text },
            ]}
            value={words}
            onChangeText={setWords}
            placeholder="e.g. 사랑, 친구, 학교 (love, friend, school)"
            placeholderTextColor={c.placeholder}
            multiline
            editable={!loading}
          />
        </ThemedView>

        <TouchableOpacity
          onPress={sendWords}
          disabled={loading || !words.trim()}
          style={[
            styles.generateBtn,
            { backgroundColor: words.trim() && !loading ? tint : borderColor },
          ]}
          activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="auto-stories" size={22} color="#fff" />
          )}
          <ThemedText style={styles.generateBtnText}>
            {loading ? 'Generating…' : 'Generate story'}
          </ThemedText>
        </TouchableOpacity>

        {story ? (
          <ThemedView style={[styles.storyCard, { backgroundColor: pastelMint, borderColor }]}>
            <View style={[styles.storyHeader, { backgroundColor: tint }]}>
              <MaterialIcons name="menu-book" size={20} color="#fff" />
              <ThemedText style={styles.storyTitle} lightColor="#fff" darkColor="#fff">Your story</ThemedText>
            </View>
            <ThemedText style={styles.storyText}>{story}</ThemedText>
          </ThemedView>
        ) : null}
      </KeyboardAvoidingView>
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
  keyboard: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    opacity: 0.95,
  },
  textInput: {
    minHeight: 100,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 20,
    gap: 10,
  },
  generateBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  storyCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 8,
    marginBottom: 14,
  },
  storyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  storyText: {
    fontSize: 16,
    lineHeight: 26,
    opacity: 0.95,
  },
});
