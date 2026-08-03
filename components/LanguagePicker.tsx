import { ThemedText } from '@/components/ThemedText';
import { LANGUAGES, LANGUAGE_CODES } from '@/constants/Languages';
import { Colors } from '@/constants/Colors';
import { radius, spacing } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Input } from '@/components/ui/Input';

type LanguagePickerProps = {
  visible: boolean;
  selected: string;
  onSelect: (code: string) => void;
  onClose: () => void;
  exclude?: string;
};

export function LanguagePicker({ visible, selected, onSelect, onClose, exclude }: LanguagePickerProps) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const codes = useMemo(() => {
    const base = exclude ? LANGUAGE_CODES.filter((code) => code !== exclude) : LANGUAGE_CODES;
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter((code) => LANGUAGES[code].toLowerCase().includes(q) || code.toLowerCase().includes(q));
  }, [exclude, search]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { backgroundColor: c.overlay }]} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: c.card, paddingBottom: insets.bottom + spacing.lg }]}
          onPress={(e) => e.stopPropagation()}>
          <View style={[styles.handle, { backgroundColor: c.border }]} />
          <ThemedText type="h2" style={styles.sheetTitle}>Choose language</ThemedText>
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Search languages…"
            style={{ marginBottom: spacing.md }}
          />
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {codes.map((code) => {
              const isSelected = code === selected;
              return (
                <Pressable
                  key={code}
                  onPress={() => {
                    onSelect(code);
                    setSearch('');
                    onClose();
                  }}
                  style={[
                    styles.row,
                    { backgroundColor: isSelected ? c.accentMuted : 'transparent' },
                  ]}>
                  <ThemedText type="body" style={isSelected ? { color: c.tint, fontWeight: '600' } : undefined}>
                    {LANGUAGES[code]}
                  </ThemedText>
                  {isSelected ? <MaterialIcons name="check" size={20} color={c.tint} /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.md,
    maxHeight: '75%',
    paddingHorizontal: spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  sheetTitle: { marginBottom: spacing.md },
  list: { maxHeight: 400 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
});
