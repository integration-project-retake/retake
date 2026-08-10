'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Language = 'en' | 'es';

const translations = {
  en: {
    games: 'Games',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    welcome: 'Welcome',

    createAccount: 'Create an Account',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    alreadyHaveAccount: 'Already have an account?',
    registrationError:
      'An error occurred during registration.',

    searchPlaceholder:
      'Enter game name or Steam ID',
    searchError:
      'Failed to search games.',
    noGames:
      'No games found.',

    grid: 'Grid',
    list: 'List',

    steamAppId:
      'Steam App ID',

    reports:
      'Reports',
    noReports:
      'No reports found for this Steam App ID.',

    language:
      'Language',
    english:
      'English',
    spanish:
      'Spanish',

    submitReport:
      'Submit a Report',
    loginRequiredForReport:
      'You must be logged in to submit a compatibility report.',

    compatibilityRating:
      'Compatibility Rating',
    linuxDistribution:
      'Linux Distribution',
    distributionPlaceholder:
      'e.g. Ubuntu, Fedora, Arch',

    protonVersion:
      'Proton Version',
    protonVersionPlaceholder:
      'e.g. 9.0-3',

    comment:
      'Comment',
    commentPlaceholder:
      'Describe your experience running this game...',

    submitReportButton:
      'Submit Report',
    submittingReport:
      'Submitting...',

    distributionRequired:
      'Distribution is required.',
    reportSubmittedSuccessfully:
      'Report submitted successfully.',
    reportSubmissionFailed:
      'Failed to submit report.',

    platinum: 'Platinum',
    gold: 'Gold',
    silver: 'Silver',
    bronze: 'Bronze',
    borked: 'Borked',
    pending: 'Pending',
  },

  es: {
    games: 'Juegos',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    logout: 'Cerrar sesión',
    welcome: 'Bienvenido',

    createAccount:
      'Crear una cuenta',
    username:
      'Nombre de usuario',
    email:
      'Correo electrónico',
    password:
      'Contraseña',
    alreadyHaveAccount:
      '¿Ya tienes una cuenta?',
    registrationError:
      'Se produjo un error durante el registro.',

    searchPlaceholder:
      'Introduce el nombre del juego o el ID de Steam',
    searchError:
      'No se pudieron buscar los juegos.',
    noGames:
      'No se encontraron juegos.',

    grid:
      'Cuadrícula',
    list:
      'Lista',

    steamAppId:
      'ID de aplicación de Steam',

    reports:
      'Informes',
    noReports:
      'No se encontraron informes para este ID de Steam.',

    language:
      'Idioma',
    english:
      'Inglés',
    spanish:
      'Español',

    submitReport:
      'Enviar un informe',
    loginRequiredForReport:
      'Debes iniciar sesión para enviar un informe de compatibilidad.',

    compatibilityRating:
      'Clasificación de compatibilidad',
    linuxDistribution:
      'Distribución de Linux',
    distributionPlaceholder:
      'p. ej. Ubuntu, Fedora, Arch',

    protonVersion:
      'Versión de Proton',
    protonVersionPlaceholder:
      'p. ej. 9.0-3',

    comment:
      'Comentario',
    commentPlaceholder:
      'Describe tu experiencia ejecutando este juego...',

    submitReportButton:
      'Enviar informe',
    submittingReport:
      'Enviando...',

    distributionRequired:
      'La distribución de Linux es obligatoria.',
    reportSubmittedSuccessfully:
      'Informe enviado correctamente.',
    reportSubmissionFailed:
      'No se pudo enviar el informe.',

    platinum:
      'Platino',
    gold:
      'Oro',
    silver:
      'Plata',
    bronze:
      'Bronce',
    borked:
      'No funciona',
    pending:
      'Pendiente',
  },
} as const;

export type TranslationKey =
  keyof typeof translations.en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (
    language: Language
  ) => void;
  t: (
    key: TranslationKey
  ) => string;
}

const LanguageContext =
  createContext<
    LanguageContextValue | undefined
  >(undefined);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    language,
    setLanguageState,
  ] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        'language'
      );

    if (
      savedLanguage === 'en' ||
      savedLanguage === 'es'
    ) {
      setLanguageState(
        savedLanguage
      );

      document.documentElement.lang =
        savedLanguage;
    }
  }, []);

  const setLanguage = (
    newLanguage: Language
  ) => {
    setLanguageState(
      newLanguage
    );

    localStorage.setItem(
      'language',
      newLanguage
    );

    document.documentElement.lang =
      newLanguage;
  };

  const t = (
    key: TranslationKey
  ): string => {
    return translations[
      language
    ][key];
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage():
  LanguageContextValue {
  const context =
    useContext(
      LanguageContext
    );

  if (!context) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider'
    );
  }

  return context;
}