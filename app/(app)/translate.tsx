import { LanguagePicker } from "@/components/LanguagePicker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PageHeader } from "@/components/ui/Badge";
import { Button, IconButton } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import { LANGUAGES } from "@/constants/Languages";
import { layout, radius, spacing } from "@/constants/Theme";
import { useToast } from "@/contexts/ToastContext";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  addTranslation,
  getTranslations,
  type TranslationEntry,
} from "@/lib/storage";

export default function TranslateScreen() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [fromLanguage, setFromLanguage] = useState("en-GB");
  const [toLanguage, setToLanguage] = useState("ko-KR");
  const [loading, setLoading] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"from" | "to" | null>(null);
  const [history, setHistory] = useState<TranslationEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const { isWide } = useBreakpoint();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();

  const loadHistory = useCallback(async () => {
    setHistory(await getTranslations());
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const swap = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    setText(translated);
    setTranslated(text);
  };

  const translateText = async () => {
    if (!text.trim()) return;
    setTranslated("");
    setLoading(true);
    try {
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLanguage}|${toLanguage}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      const result = data.responseData?.translatedText ?? "";
      setTranslated(result);
      await addTranslation({ source: text, result, fromLanguage, toLanguage });
      loadHistory();
    } catch {
      setTranslated("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (!translated) return;
    await Clipboard.setStringAsync(translated);
    showToast("Copied to clipboard");
  };

  const clearAll = () => {
    setText("");
    setTranslated("");
  };

  const applyHistory = (entry: TranslationEntry) => {
    setText(entry.source);
    setTranslated(entry.result);
    setFromLanguage(entry.fromLanguage);
    setToLanguage(entry.toLanguage);
    setShowHistory(false);
  };

  const LangSelect = ({
    code,
    onPress,
  }: {
    code: string;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.langSelect,
        { backgroundColor: c.card, borderColor: c.border },
      ]}
    >
      <ThemedText type="bodySm">{LANGUAGES[code]}</ThemedText>
      <MaterialIcons name="expand-more" size={18} color={c.icon} />
    </Pressable>
  );

  const panels = (
    <View style={[styles.panels, isWide && styles.panelsWide]}>
      <View
        style={[
          styles.panel,
          { backgroundColor: c.card, borderColor: c.border },
        ]}
      >
        <ThemedText type="label" style={styles.panelLabel}>
          Source
        </ThemedText>
        <TextArea
          value={text}
          onChangeText={setText}
          placeholder="Enter text to translate…"
        />
        <ThemedText
          type="caption"
          style={{ color: c.textSecondary, marginTop: spacing.sm }}
        >
          {text.length} characters
        </ThemedText>
      </View>
      <View
        style={[
          styles.panel,
          { backgroundColor: c.card, borderColor: c.border },
        ]}
      >
        <ThemedText type="label" style={styles.panelLabel}>
          Translation
        </ThemedText>
        {loading ? (
          <View style={styles.skeletonWrap}>
            <Skeleton height={16} width="90%" />
            <Skeleton height={16} width="75%" style={{ marginTop: 8 }} />
            <Skeleton height={16} width="60%" style={{ marginTop: 8 }} />
          </View>
        ) : (
          <TextArea
            value={translated}
            editable={false}
            placeholder="Translation appears here…"
          />
        )}
      </View>
    </View>
  );

  return (
    <ThemedView style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        <PageHeader
          title="Translate"
          subtitle="Professional-grade translation between Korean and 15+ languages"
          action={
            <IconButton
              icon={showHistory ? "close" : "history"}
              onPress={() => setShowHistory(!showHistory)}
            />
          }
        />

        <View
          style={[
            styles.langBar,
            { backgroundColor: c.card, borderColor: c.border },
          ]}
        >
          <LangSelect
            code={fromLanguage}
            onPress={() => setPickerTarget("from")}
          />
          <Pressable
            onPress={swap}
            style={[styles.swapBtn, { backgroundColor: c.accentMuted }]}
          >
            <MaterialIcons name="swap-horiz" size={20} color={c.tint} />
          </Pressable>
          <LangSelect code={toLanguage} onPress={() => setPickerTarget("to")} />
        </View>

        <View style={isWide ? styles.mainWide : undefined}>
          {panels}
          {showHistory && (
            <View
              style={[
                styles.history,
                { backgroundColor: c.card, borderColor: c.border },
              ]}
            >
              <ThemedText type="label" style={{ marginBottom: spacing.md }}>
                History
              </ThemedText>
              {history.length === 0 ? (
                <ThemedText type="bodySm" style={{ color: c.textSecondary }}>
                  No history yet
                </ThemedText>
              ) : (
                history.map((entry) => (
                  <Pressable
                    key={entry.id}
                    onPress={() => applyHistory(entry)}
                    style={[styles.historyItem, { borderColor: c.border }]}
                  >
                    <ThemedText type="bodySm" numberOfLines={1}>
                      {entry.source}
                    </ThemedText>
                    <ThemedText
                      type="caption"
                      korean
                      style={{ color: c.textSecondary }}
                      numberOfLines={1}
                    >
                      {entry.result}
                    </ThemedText>
                  </Pressable>
                ))
              )}
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            label="Translate"
            icon="translate"
            onPress={translateText}
            disabled={!text.trim() || loading}
            loading={loading}
          />
          <Button
            label="Copy"
            variant="secondary"
            icon="content-copy"
            onPress={copyResult}
            disabled={!translated}
          />
          <Button
            label="Clear"
            variant="ghost"
            onPress={clearAll}
            disabled={!text && !translated}
          />
        </View>
      </ScrollView>

      <LanguagePicker
        visible={pickerTarget === "from"}
        selected={fromLanguage}
        exclude={toLanguage}
        onSelect={setFromLanguage}
        onClose={() => setPickerTarget(null)}
      />
      <LanguagePicker
        visible={pickerTarget === "to"}
        selected={toLanguage}
        exclude={fromLanguage}
        onSelect={setToLanguage}
        onClose={() => setPickerTarget(null)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.xl,
    maxWidth: layout.maxWidthForm,
    alignSelf: "center",
    width: "100%",
  },
  langBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  langSelect: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  mainWide: { flexDirection: "row", gap: spacing.lg },
  panels: { gap: spacing.lg, flex: 1 },
  panelsWide: { flexDirection: "row" },
  panel: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  panelLabel: { marginBottom: spacing.md },
  skeletonWrap: { minHeight: 120, padding: spacing.md },
  history: {
    width: 280,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    maxHeight: 400,
  },
  historyItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
