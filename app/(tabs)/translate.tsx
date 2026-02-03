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

const languages: Record<string, string> = {
  'en-GB': 'English',
  'ko-KR': '한국어',
  'ja-JP': '日本語',
  'zh-CN': '中文',
  'es-ES': 'Spanish',
  'fr-FR': 'French',
  'de-DE': 'German',
  'tr-TR': 'Turkish',
  'ru-RU': 'Russian',
  'pt-PT': 'Portuguese',
  'it-IT': 'Italian',
  'vi-VN': 'Vietnamese',
  'th-TH': 'Thai',
  'id-ID': 'Indonesian',
  'ar-SA': 'Arabic',
  'hi-IN': 'Hindi',
};

export default function TranslateScreen() {
  const [text, setText] = useState('');
  const [translated, setTranslated] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en-GB');
  const [toLanguage, setToLanguage] = useState('ko-KR');
  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme() ?? 'light';
  const c = Colors[colorScheme];
  const cardBg = c.card;
  const borderColor = c.border;
  const tint = c.tint;
  const pastelPink = c.pastelPink;
  const pastelMint = c.pastelMint;

  const swap = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    setText(translated);
    setTranslated(text);
  };

  const translateText = () => {
    if (!text.trim()) return;
    setTranslated('');
    setLoading(true);
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLanguage}|${toLanguage}`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setTranslated(data.responseData?.translatedText ?? '');
        setLoading(false);
      })
      .catch(() => {
        setTranslated('Translation failed. Please try again.');
        setLoading(false);
      });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f3e8ff', dark: '#3b0764' }}
      headerImage={
        <View style={styles.headerBadge}>
          <ThemedText style={styles.headerLabel}>Korean learning</ThemedText>
          <ThemedText style={styles.headerSub}>Translate & learn</ThemedText>
        </View>
      }>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Translate</ThemedText>
        <ThemedText style={styles.subtitle}>Translate between Korean and other languages</ThemedText>
      </ThemedView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}>
        <ThemedView style={[styles.card, { backgroundColor: pastelPink, borderColor }]}>
          <View style={styles.langRow}>
            <View style={[styles.langChip, { backgroundColor: tint }]}>
              <ThemedText style={styles.langChipText}>{languages[fromLanguage]}</ThemedText>
            </View>
          </View>
          <TextInput
            style={[styles.textInput, { backgroundColor: cardBg, borderColor, color: c.text }]}
            value={text}
            onChangeText={setText}
            placeholder="Type or paste text here..."
            placeholderTextColor={c.placeholder}
            multiline
          />
        </ThemedView>

        <TouchableOpacity onPress={swap} style={[styles.swapBtn, { backgroundColor: tint }]} activeOpacity={0.85}>
          <MaterialIcons name="swap-vert" size={22} color="#fff" />
          <ThemedText style={styles.swapLabel}>Swap</ThemedText>
        </TouchableOpacity>

        <ThemedView style={[styles.card, { backgroundColor: pastelMint, borderColor }]}>
          <View style={styles.langRow}>
            <View style={[styles.langChip, { backgroundColor: tint }]}>
              <ThemedText style={styles.langChipText}>{languages[toLanguage]}</ThemedText>
            </View>
          </View>
          {loading ? (
            <ThemedView style={[styles.loadingBox, { backgroundColor: cardBg, borderColor }]}>
              <ActivityIndicator size="small" color={tint} />
              <ThemedText style={styles.loadingText}>Translating…</ThemedText>
            </ThemedView>
          ) : (
            <TextInput
              style={[styles.textInput, styles.outputInput, { backgroundColor: cardBg, borderColor, color: c.text }]}
              value={translated}
              editable={false}
              multiline
              placeholder="Translation appears here"
              placeholderTextColor={c.placeholder}
            />
          )}
        </ThemedView>

        <TouchableOpacity
          onPress={translateText}
          disabled={!text.trim() || loading}
          style={[styles.translateBtn, { backgroundColor: text.trim() && !loading ? tint : borderColor }]}
          activeOpacity={0.85}>
          <MaterialIcons name="translate" size={20} color="#fff" />
          <ThemedText style={styles.translateBtnText}>Translate</ThemedText>
        </TouchableOpacity>
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
    marginBottom: 14,
  },
  langRow: {
    marginBottom: 10,
  },
  langChip: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  langChipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  textInput: {
    minHeight: 100,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 17,
    textAlignVertical: 'top',
  },
  outputInput: {
    minHeight: 100,
  },
  loadingBox: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 15,
  },
  swapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 20,
    marginBottom: 14,
    gap: 8,
  },
  swapLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  translateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 6,
    gap: 10,
  },
  translateBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
});
