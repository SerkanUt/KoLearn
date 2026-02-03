import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'rounded' | 'underline';
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextInputProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  return (
    <TextInput
      placeholderTextColor={useThemeColor({}, 'placeholder')}
      style={[
        {
          backgroundColor,
          color: textColor,
          borderColor,
        },
        type === 'default' ? styles.default : undefined,
        type === 'rounded' ? styles.rounded : undefined,
        type === 'underline' ? styles.underline : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  rounded: {
    height: 40,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  underline: {
    height: 40,
    borderBottomWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
});
