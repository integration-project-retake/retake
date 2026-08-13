'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Theme =
  | 'dark'
  | 'light'
  | 'scenic'
  | 'witcher'
  | 'rdr2'
  | 'gow';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext =
  createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem('theme') as Theme | null;

    if (
      savedTheme === 'dark' ||
      savedTheme === 'light' ||
      savedTheme === 'scenic' ||
      savedTheme === 'witcher' ||
      savedTheme === 'rdr2' ||
      savedTheme === 'gow'
    ) {
      setThemeState(savedTheme);
    }

    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (!themeLoaded) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme, themeLoaded]);

  function setTheme(newTheme: Theme) {
    setThemeState(newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider'
    );
  }

  return context;
}