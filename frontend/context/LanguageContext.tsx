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

    usernameRequired:
      'Username is required.',
    emailRequired:
      'Email is required.',
    invalidEmail:
      'Please enter a valid email address.',
    passwordRequired:
      'Password is required.',
    passwordTooShort:
      'Password must be at least 6 characters long.',
    usernameTaken:
      'This username is already taken.',
    registrationFailed:
      'Registration failed. Please try again.',

    loginFailed:
      'Login failed.',
    invalidCredentials:
      'Invalid username or password.',

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
    distributionRequired:
      'Distribution is required.',

    protonVersion:
      'Proton Version',
    protonVersionPlaceholder:
      'e.g. 9.0-3',
    protonVersionRequired:
      'Proton version is required.',

    comment:
      'Comment',
    commentPlaceholder:
      'Describe your experience running this game...',
    commentRequired:
      'Comment is required.',

    submitReportButton:
      'Submit Report',
    submittingReport:
      'Submitting...',

    reportSubmittedSuccessfully:
      'Report submitted successfully.',
    reportSubmissionFailed:
      'Failed to submit report.',

    platinum:
      'Platinum',
    gold:
      'Gold',
    silver:
      'Silver',
    bronze:
      'Bronze',
    borked:
      'Borked',
    pending:
      'Pending',
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

    usernameRequired:
      'El nombre de usuario es obligatorio.',
    emailRequired:
      'El correo electrónico es obligatorio.',
    invalidEmail:
      'Introduce una dirección de correo electrónico válida.',
    passwordRequired:
      'La contraseña es obligatoria.',
    passwordTooShort:
      'La contraseña debe tener al menos 6 caracteres.',
    usernameTaken:
      'Este nombre de usuario ya está en uso.',
    registrationFailed:
      'El registro falló. Inténtalo de nuevo.',

    loginFailed:
      'Error al iniciar sesión.',
    invalidCredentials:
      'Nombre de usuario o contraseña incorrectos.',

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
    distributionRequired:
      'La distribución de Linux es obligatoria.',

    protonVersion:
      'Versión de Proton',
    protonVersionPlaceholder:
      'p. ej. 9.0-3',
    protonVersionRequired:
      'La versión de Proton es obligatoria.',

    comment:
      'Comentario',
    commentPlaceholder:
      'Describe tu experiencia ejecutando este juego...',
    commentRequired:
      'El comentario es obligatorio.',

    submitReportButton:
      'Enviar informe',
    submittingReport:
      'Enviando...',

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