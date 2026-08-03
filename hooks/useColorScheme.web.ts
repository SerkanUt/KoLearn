import { useAppTheme } from '@/contexts/ThemeContext';

export function useColorScheme(): 'light' | 'dark' {
  return useAppTheme().colorScheme;
}

export { useAppTheme } from '@/contexts/ThemeContext';
