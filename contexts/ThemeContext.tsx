import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { getSettings, saveSettings, type AppSettings } from '@/lib/storage';

type ColorScheme = 'light' | 'dark';

type ThemeContextValue = {
  colorScheme: ColorScheme;
  appearance: AppSettings['appearance'];
  setAppearance: (appearance: AppSettings['appearance']) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [appearance, setAppearanceState] = useState<AppSettings['appearance']>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSettings().then((s) => {
      setAppearanceState(s.appearance);
      setLoaded(true);
    });
  }, []);

  const colorScheme: ColorScheme =
    appearance === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : appearance;

  const setAppearance = async (next: AppSettings['appearance']) => {
    setAppearanceState(next);
    const settings = await getSettings();
    await saveSettings({ ...settings, appearance: next });
  };

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ colorScheme, appearance, setAppearance }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
}
