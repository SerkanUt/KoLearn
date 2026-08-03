import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { fonts, radius, spacing } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  disabled,
  loading,
  icon,
  variant = 'primary',
  size = 'md',
  style,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  const isDisabled = disabled || loading;
  const pad = size === 'sm' ? spacing.sm : spacing.lg;

  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.ghost,
          { paddingVertical: pad, opacity: isDisabled ? 0.5 : pressed ? 0.7 : 1 },
          style,
        ]}>
        {loading ? <ActivityIndicator size="small" color={c.tint} /> : null}
        {!loading && icon ? <MaterialIcons name={icon} size={18} color={c.tint} /> : null}
        <ThemedText type="label" style={{ color: c.tint }}>{label}</ThemedText>
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.secondary,
          {
            paddingVertical: pad,
            borderColor: c.border,
            backgroundColor: c.card,
            opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          },
          style,
        ]}>
        {loading ? <ActivityIndicator size="small" color={c.tint} /> : null}
        {!loading && icon ? <MaterialIcons name={icon} size={18} color={c.text} /> : null}
        <ThemedText type="label">{label}</ThemedText>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [styles.wrapper, { opacity: isDisabled ? 0.5 : pressed ? 0.9 : 1 }, style]}>
      <LinearGradient
        colors={[c.tint, colorScheme === 'light' ? '#3730A3' : '#6366F1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.primary, { paddingVertical: pad }]}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : null}
        {!loading && icon ? <MaterialIcons name={icon} size={20} color="#fff" /> : null}
        <ThemedText style={styles.primaryText}>{label}</ThemedText>
      </LinearGradient>
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  color,
  size = 22,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  color?: string;
  size?: number;
}) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}>
      <MaterialIcons name={icon} size={size} color={color ?? c.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: radius.md, overflow: 'hidden' },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '600', fontFamily: fonts.sansSemiBold },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  ghost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  iconBtn: {
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
});
