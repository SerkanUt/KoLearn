import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { Colors } from '@/constants/Colors';
import { fonts, radius, spacing } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

type InputProps = TextInputProps & { label?: string };

export function Input({ style, label, ...props }: InputProps) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  return (
    <TextInput
      style={[
        styles.input,
        { backgroundColor: c.card, borderColor: c.border, color: c.text },
        style,
      ]}
      placeholderTextColor={c.placeholder}
      {...props}
    />
  );
}

export function TextArea({ style, ...props }: TextInputProps) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      style={[
        styles.textarea,
        { backgroundColor: c.card, borderColor: c.border, color: c.text },
        style,
      ]}
      placeholderTextColor={c.placeholder}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    fontFamily: fonts.sans,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    minHeight: 120,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.sans,
  },
});
