'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Language = 'en' | 'es';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const translations = {
  en: {
    games: 'Games',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    welcome: 'Welcome',
    searchPlaceholder: 'Enter game name or Steam ID',
    searchError: 'Failed to search games.',
    noGames: 'No games found.',
    steamAppId: 'Steam App ID',
    reports: 'Reports',
    noReports: 'No reports found for this Steam App ID.',
    language: 'Language',
    english: 'English',
    spanish: 'Spanish',
  },
  es: {
    games: 'Juegos',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    logout: 'Cerrar sesión',
    welcome: 'Bienvenido',
    searchPlaceholder: 'Introduce el nombre del juego o el ID de Steam',
    searchError: 'No se pudieron buscar los juegos.',
    noGames: 'No se encontraron juegos.',
    steamAppId: 'ID de aplicación de Steam',
    reports: 'Informes',
    noReports: 'No se encontraron informes para este ID de Steam.',
    language: 'Idioma',
    english: 'Inglés',
    spanish: 'Español',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');

    if (storedLanguage === 'en' || storedLanguage === 'es') {
      setLanguageState(storedLanguage);
      document.documentElement.lang = storedLanguage;
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.lang = newLanguage;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used inside a LanguageProvider');
  }

  return context;
}