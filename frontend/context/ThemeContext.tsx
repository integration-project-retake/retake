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
  | 'witcher';

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

  useEffect(() => {
    const savedTheme =
      localStorage.getItem('theme') as Theme | null;

    if (
      savedTheme === 'dark' ||
      savedTheme === 'light' ||
      savedTheme === 'scenic' ||
      savedTheme === 'witcher'
    ) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  function setTheme(newTheme: Theme) {
    setThemeState(newTheme);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
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