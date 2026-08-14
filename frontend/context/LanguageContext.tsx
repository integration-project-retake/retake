'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export const LANGUAGES = [
  'en',
  'es',
  'nl',
  'de',
  'fr',
  'zh',
  'ja',
  'tr',
] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  nl: 'Nederlands',
  de: 'Deutsch',
  fr: 'Français',
  zh: '中文',
  ja: '日本語',
  tr: 'Türkçe',
};

export function isLanguage(value: unknown): value is Language {
  switch (value) {
    case 'en':
    case 'es':
    case 'nl':
    case 'de':
    case 'fr':
    case 'zh':
    case 'ja':
    case 'tr':
      return true;
    default:
      return false;
  }
}


export function getLocale(language: Language): string {
  switch (language) {
    case 'es':
      return 'es-ES';
    case 'nl':
      return 'nl-BE';
    case 'de':
      return 'de-DE';
    case 'fr':
      return 'fr-FR';
    case 'zh':
      return 'zh-CN';
    case 'ja':
      return 'ja-JP';
    case 'tr':
      return 'tr-TR';
    case 'en':
    default:
      return 'en-GB';
  }
}

const en = {
  // Navigation & account
  home: 'Home',
  games: 'Games',
  login: 'Login',
  register: 'Register',
  logout: 'Logout',
  welcome: 'Welcome',
  profile: 'Profile',

  // Registration
  createAccount: 'Create an Account',
  username: 'Username',
  email: 'Email',
  password: 'Password',
  alreadyHaveAccount: 'Already have an account?',
  registrationError: 'An error occurred during registration.',
  usernameRequired: 'Username is required.',
  emailRequired: 'Email is required.',
  invalidEmail: 'Please enter a valid email address.',
  passwordRequired: 'Password is required.',
  passwordTooShort: 'Password must be at least 6 characters long.',
  usernameTaken: 'This username is already taken.',
  registrationFailed: 'Registration failed. Please try again.',

  // Login
  loginFailed: 'Login failed.',
  invalidCredentials: 'Invalid username or password.',

  // Search
  searchPlaceholder: 'Enter game name or Steam ID',
  searchError: 'Failed to search games.',
  noGames: 'No games found.',
  noGamesMatchFilters: 'No games match the selected filters.',
  grid: 'Grid',
  list: 'List',
  steamAppId: 'Steam App ID',

  // Filters & ordering
  allGenres: 'All Genres',
  genreCountOne: '{count} Genre',
  genreCountMany: '{count} Genres',
  allTiers: 'All Tiers',
  tierCountOne: '{count} Tier',
  tierCountMany: '{count} Tiers',
  defaultOrdering: 'Default',
  orderingOptions: 'Ordering Options',
  reset: 'Reset',
  close: 'Close',
  genres: 'Genres',
  compatibilityTiers: 'Compatibility Tiers',
  ordering: 'Ordering',
  orderingHint: 'You can combine non-conflicting ordering categories.',
  name: 'Name',
  nameAsc: 'Name A → Z',
  nameDesc: 'Name Z → A',
  clearNameOrdering: 'Clear name ordering',
  steamAsc: 'Low → High',
  steamDesc: 'High → Low',
  clearSteamOrdering: 'Clear Steam ordering',
  compatibility: 'Compatibility',
  tierBest: 'Best → Worst',
  tierWorst: 'Worst → Best',
  clearTierOrdering: 'Clear compatibility ordering',

  // Pagination
  previous: 'Previous',
  next: 'Next',
  pageOf: 'Page {current} of {total}',

  // Reports
  reports: 'Reports',
  noReports: 'No reports found for this Steam App ID.',
  submitReport: 'Submit a Report',
  loginRequiredForReport:
    'You must be logged in to submit a compatibility report.',
  compatibilityRating: 'Compatibility Rating',
  linuxDistribution: 'Linux Distribution',
  distributionPlaceholder: 'e.g. Ubuntu, Fedora, Arch',
  distributionRequired: 'Distribution is required.',
  protonVersion: 'Proton Version',
  protonVersionPlaceholder: 'e.g. 9.0-3',
  protonVersionRequired: 'Proton version is required.',
  comment: 'Comment',
  commentPlaceholder: 'Describe your experience running this game...',
  commentRequired: 'Comment is required.',
  submitReportButton: 'Submit Report',
  submittingReport: 'Submitting...',
  reportSubmittedSuccessfully: 'Report submitted successfully.',
  reportSubmissionFailed: 'Failed to submit report.',

  // Language selector
  language: 'Language',
  english: 'English',
  spanish: 'Spanish',
  flemish: 'Flemish',
  german: 'German',
  french: 'French',
  chinese: 'Chinese',
  japanese: 'Japanese',
  turkish: 'Turkish',

  // Tiers
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
  borked: 'Borked',
  pending: 'Pending',
  platinumDescription: 'Works perfectly out of the box',
  goldDescription: 'Works perfectly after tweaks',
  silverDescription: 'Playable with minor issues',
  bronzeDescription: 'Playable but has severe issues',
  borkedDescription: 'Completely unplayable',
  pendingDescription: 'Not enough reports yet',

  // Shared actions
  edit: 'Edit',
  delete: 'Delete',
  deleting: 'Deleting...',
  saveChanges: 'Save Changes',
  saving: 'Saving...',
  cancel: 'Cancel',
  showMore: 'Show more',
  allFieldsRequired: 'All fields are required.',
  updateReportFailed: 'Failed to update report.',
  deleteReportFailed: 'Failed to delete report.',
  deleteReportTitle: 'Delete Report',
  deleteReportConfirm:
    'Are you sure you want to delete this report? This action is permanent and cannot be undone.',
  deleteReportButton: 'Delete Report',

  // Profile
  noContributionsTitle: 'No contributions yet',
  noContributionsOwn:
    'You have not submitted any compatibility reports yet. Browse the catalogue and share your experience.',
  noContributionsOther:
    'This user has not submitted any compatibility reports yet.',
  browseGames: 'Browse Games',

  // Game detail page
  compatibilityBreakdown: 'Compatibility Breakdown',
  relatedGames: 'Related Games',
  noRelatedGames: 'No related games found.',
  noReportsTitle: 'No compatibility reports yet',
  noReportsDescription:
    'No reports have been submitted for this game yet. Compatibility information will appear once users start contributing.',
  loginToContribute: 'Log in to contribute',


  
  // Dashboard
  dashboard: 'Dashboard',
  dashboardDescription:
    'Compatibility and community statistics across ProtonDB Clone.',
  users: 'Users',
  gamesByGenre: 'Games by Genre',
  gamesByGenreDescription:
    'Number of catalogue games belonging to each genre.',
  compatibilityOverview: 'Compatibility Overview',
  compatibilityOverviewDescription:
    'Overall compatibility tier distribution across the game catalogue.',
  compatibilityByGenre: 'Compatibility by Genre',
  compatibilityByGenreDescription:
    'Select a genre to explore its compatibility distribution.',
  mostReportedGames: 'Most Reported Games',
  topContributors: 'Top Contributors',
  reportsPerGame: 'Reports / Game',
  numberOfGames: 'Number of games',
  genre: 'Genre',
  game: 'game',
  gamePlural: 'games',
  reportPlural: 'reports',
  noGenreData: 'No genre compatibility data available.',
  noReportsYet: 'No reports yet.',
  noContributorsYet: 'No contributors yet.',
  backToTop: 'Back to top',
  loadingDashboard: 'Loading dashboard...',
  dashboardLoadFailed: 'Failed to load dashboard.',
  dashboardBackendHint:
    'Make sure the backend is running and the /dashboard endpoint is available.',
  noDashboardStats: 'No dashboard statistics available.',
} as const;

export type TranslationKey = keyof typeof en;

const es: Record<TranslationKey, string> = {
  home: 'Inicio',
  games: 'Juegos',
  login: 'Iniciar sesión',
  register: 'Registrarse',
  logout: 'Cerrar sesión',
  welcome: 'Bienvenido',
  profile: 'Perfil',

  createAccount: 'Crear una cuenta',
  username: 'Nombre de usuario',
  email: 'Correo electrónico',
  password: 'Contraseña',
  alreadyHaveAccount: '¿Ya tienes una cuenta?',
  registrationError: 'Se produjo un error durante el registro.',
  usernameRequired: 'El nombre de usuario es obligatorio.',
  emailRequired: 'El correo electrónico es obligatorio.',
  invalidEmail: 'Introduce una dirección de correo electrónico válida.',
  passwordRequired: 'La contraseña es obligatoria.',
  passwordTooShort: 'La contraseña debe tener al menos 6 caracteres.',
  usernameTaken: 'Este nombre de usuario ya está en uso.',
  registrationFailed: 'El registro falló. Inténtalo de nuevo.',

  loginFailed: 'Error al iniciar sesión.',
  invalidCredentials: 'Nombre de usuario o contraseña incorrectos.',

  searchPlaceholder: 'Introduce el nombre del juego o el ID de Steam',
  searchError: 'No se pudieron buscar los juegos.',
  noGames: 'No se encontraron juegos.',
  noGamesMatchFilters: 'Ningún juego coincide con los filtros seleccionados.',
  grid: 'Cuadrícula',
  list: 'Lista',
  steamAppId: 'ID de aplicación de Steam',

  allGenres: 'Todos los géneros',
  genreCountOne: '{count} género',
  genreCountMany: '{count} géneros',
  allTiers: 'Todos los niveles',
  tierCountOne: '{count} nivel',
  tierCountMany: '{count} niveles',
  defaultOrdering: 'Predeterminado',
  orderingOptions: 'Opciones de orden',
  reset: 'Restablecer',
  close: 'Cerrar',
  genres: 'Géneros',
  compatibilityTiers: 'Niveles de compatibilidad',
  ordering: 'Orden',
  orderingHint:
    'Puedes combinar categorías de orden que no entren en conflicto.',
  name: 'Nombre',
  nameAsc: 'Nombre A → Z',
  nameDesc: 'Nombre Z → A',
  clearNameOrdering: 'Borrar orden por nombre',
  steamAsc: 'De menor a mayor',
  steamDesc: 'De mayor a menor',
  clearSteamOrdering: 'Borrar orden por Steam',
  compatibility: 'Compatibilidad',
  tierBest: 'Mejor → Peor',
  tierWorst: 'Peor → Mejor',
  clearTierOrdering: 'Borrar orden por compatibilidad',

  previous: 'Anterior',
  next: 'Siguiente',
  pageOf: 'Página {current} de {total}',

  reports: 'Informes',
  noReports: 'No se encontraron informes para este ID de Steam.',
  submitReport: 'Enviar un informe',
  loginRequiredForReport:
    'Debes iniciar sesión para enviar un informe de compatibilidad.',
  compatibilityRating: 'Clasificación de compatibilidad',
  linuxDistribution: 'Distribución de Linux',
  distributionPlaceholder: 'p. ej. Ubuntu, Fedora, Arch',
  distributionRequired: 'La distribución de Linux es obligatoria.',
  protonVersion: 'Versión de Proton',
  protonVersionPlaceholder: 'p. ej. 9.0-3',
  protonVersionRequired: 'La versión de Proton es obligatoria.',
  comment: 'Comentario',
  commentPlaceholder: 'Describe tu experiencia ejecutando este juego...',
  commentRequired: 'El comentario es obligatorio.',
  submitReportButton: 'Enviar informe',
  submittingReport: 'Enviando...',
  reportSubmittedSuccessfully: 'Informe enviado correctamente.',
  reportSubmissionFailed: 'No se pudo enviar el informe.',

  language: 'Idioma',
  english: 'Inglés',
  spanish: 'Español',
  flemish: 'Flamenco',
  german: 'Alemán',
  french: 'Francés',
  chinese: 'Chino',
  japanese: 'Japonés',
  turkish: 'Turco',

  platinum: 'Platino',
  gold: 'Oro',
  silver: 'Plata',
  bronze: 'Bronce',
  borked: 'No funciona',
  pending: 'Pendiente',
  platinumDescription: 'Funciona perfectamente sin ajustes',
  goldDescription: 'Funciona perfectamente después de algunos ajustes',
  silverDescription: 'Jugable con problemas menores',
  bronzeDescription: 'Jugable pero con problemas graves',
  borkedDescription: 'Completamente injugable',
  pendingDescription: 'Todavía no hay suficientes informes',

  edit: 'Editar',
  delete: 'Eliminar',
  deleting: 'Eliminando...',
  saveChanges: 'Guardar cambios',
  saving: 'Guardando...',
  cancel: 'Cancelar',
  showMore: 'Mostrar más',
  allFieldsRequired: 'Todos los campos son obligatorios.',
  updateReportFailed: 'No se pudo actualizar el informe.',
  deleteReportFailed: 'No se pudo eliminar el informe.',
  deleteReportTitle: 'Eliminar informe',
  deleteReportConfirm:
    '¿Seguro que quieres eliminar este informe? Esta acción es permanente y no se puede deshacer.',
  deleteReportButton: 'Eliminar informe',

  noContributionsTitle: 'Aún no hay contribuciones',
  noContributionsOwn:
    'Todavía no has enviado ningún informe de compatibilidad. Explora los juegos y comparte tu experiencia.',
  noContributionsOther:
    'Este usuario todavía no ha enviado ningún informe de compatibilidad.',
  browseGames: 'Explorar juegos',

  compatibilityBreakdown: 'Desglose de compatibilidad',
  relatedGames: 'Juegos relacionados',
  noRelatedGames: 'No se encontraron juegos relacionados.',
  noReportsTitle: 'Aún no hay informes de compatibilidad',
  noReportsDescription:
    'Todavía no se ha enviado ningún informe para este juego. La información de compatibilidad aparecerá cuando los usuarios comiencen a contribuir.',
  loginToContribute: 'Iniciar sesión para contribuir',

  // Dashboard
  dashboard: 'Panel',
  dashboardDescription:
    'Estadísticas de compatibilidad y comunidad de ProtonDB Clone.',
  users: 'Usuarios',
  gamesByGenre: 'Juegos por género',
  gamesByGenreDescription:
    'Número de juegos del catálogo pertenecientes a cada género.',
  compatibilityOverview: 'Resumen de compatibilidad',
  compatibilityOverviewDescription:
    'Distribución general de los niveles de compatibilidad del catálogo.',
  compatibilityByGenre: 'Compatibilidad por género',
  compatibilityByGenreDescription:
    'Selecciona un género para explorar su distribución de compatibilidad.',
  mostReportedGames: 'Juegos con más informes',
  topContributors: 'Principales colaboradores',
  reportsPerGame: 'Informes / Juego',
  numberOfGames: 'Número de juegos',
  genre: 'Género',
  game: 'juego',
  gamePlural: 'juegos',
  reportPlural: 'informes',
  noGenreData: 'No hay datos de compatibilidad por género.',
  noReportsYet: 'Aún no hay informes.',
  noContributorsYet: 'Aún no hay colaboradores.',
  backToTop: 'Volver arriba',
  loadingDashboard: 'Cargando panel...',
  dashboardLoadFailed: 'No se pudo cargar el panel.',
  dashboardBackendHint:
    'Asegúrate de que el backend esté funcionando y que el endpoint /dashboard esté disponible.',
  noDashboardStats: 'No hay estadísticas disponibles.',
};

const nl: Record<TranslationKey, string> = {
  home: 'Home',
  games: 'Games',
  login: 'Inloggen',
  register: 'Registreren',
  logout: 'Uitloggen',
  welcome: 'Welkom',
  profile: 'Profiel',

  createAccount: 'Een account aanmaken',
  username: 'Gebruikersnaam',
  email: 'E-mailadres',
  password: 'Wachtwoord',
  alreadyHaveAccount: 'Heb je al een account?',
  registrationError: 'Er is een fout opgetreden tijdens het registreren.',
  usernameRequired: 'Gebruikersnaam is verplicht.',
  emailRequired: 'E-mailadres is verplicht.',
  invalidEmail: 'Voer een geldig e-mailadres in.',
  passwordRequired: 'Wachtwoord is verplicht.',
  passwordTooShort: 'Het wachtwoord moet minstens 6 tekens lang zijn.',
  usernameTaken: 'Deze gebruikersnaam is al in gebruik.',
  registrationFailed: 'Registratie mislukt. Probeer het opnieuw.',

  loginFailed: 'Inloggen mislukt.',
  invalidCredentials: 'Ongeldige gebruikersnaam of wachtwoord.',

  searchPlaceholder: 'Voer een spelnaam of Steam-ID in',
  searchError: 'Zoeken naar games is mislukt.',
  noGames: 'Geen games gevonden.',
  noGamesMatchFilters: 'Geen games komen overeen met de gekozen filters.',
  grid: 'Raster',
  list: 'Lijst',
  steamAppId: 'Steam App-ID',

  allGenres: 'Alle genres',
  genreCountOne: '{count} genre',
  genreCountMany: '{count} genres',
  allTiers: 'Alle niveaus',
  tierCountOne: '{count} niveau',
  tierCountMany: '{count} niveaus',
  defaultOrdering: 'Standaard',
  orderingOptions: 'Sorteeropties',
  reset: 'Wissen',
  close: 'Sluiten',
  genres: 'Genres',
  compatibilityTiers: 'Compatibiliteitsniveaus',
  ordering: 'Sortering',
  orderingHint:
    'Je kan sorteercategorieën combineren zolang ze elkaar niet tegenspreken.',
  name: 'Naam',
  nameAsc: 'Naam A → Z',
  nameDesc: 'Naam Z → A',
  clearNameOrdering: 'Naamsortering wissen',
  steamAsc: 'Laag → Hoog',
  steamDesc: 'Hoog → Laag',
  clearSteamOrdering: 'Steam-sortering wissen',
  compatibility: 'Compatibiliteit',
  tierBest: 'Best → Slechtst',
  tierWorst: 'Slechtst → Best',
  clearTierOrdering: 'Compatibiliteitssortering wissen',

  previous: 'Vorige',
  next: 'Volgende',
  pageOf: 'Pagina {current} van {total}',

  reports: 'Rapporten',
  noReports: 'Geen rapporten gevonden voor deze Steam App-ID.',
  submitReport: 'Een rapport indienen',
  loginRequiredForReport:
    'Je moet ingelogd zijn om een compatibiliteitsrapport in te dienen.',
  compatibilityRating: 'Compatibiliteitsbeoordeling',
  linuxDistribution: 'Linux-distributie',
  distributionPlaceholder: 'bv. Ubuntu, Fedora, Arch',
  distributionRequired: 'Distributie is verplicht.',
  protonVersion: 'Proton-versie',
  protonVersionPlaceholder: 'bv. 9.0-3',
  protonVersionRequired: 'Proton-versie is verplicht.',
  comment: 'Opmerking',
  commentPlaceholder: 'Beschrijf je ervaring met dit spel...',
  commentRequired: 'Opmerking is verplicht.',
  submitReportButton: 'Rapport indienen',
  submittingReport: 'Bezig met indienen...',
  reportSubmittedSuccessfully: 'Rapport succesvol ingediend.',
  reportSubmissionFailed: 'Rapport indienen mislukt.',

  language: 'Taal',
  english: 'Engels',
  spanish: 'Spaans',
  flemish: 'Vlaams',
  german: 'Duits',
  french: 'Frans',
  chinese: 'Chinees',
  japanese: 'Japans',
  turkish: 'Turks',

  platinum: 'Platina',
  gold: 'Goud',
  silver: 'Zilver',
  bronze: 'Brons',
  borked: 'Kapot',
  pending: 'In afwachting',
  platinumDescription: 'Werkt meteen perfect',
  goldDescription: 'Werkt perfect na wat aanpassingen',
  silverDescription: 'Speelbaar met kleine problemen',
  bronzeDescription: 'Speelbaar maar met ernstige problemen',
  borkedDescription: 'Volledig onspeelbaar',
  pendingDescription: 'Nog niet genoeg rapporten',

  edit: 'Bewerken',
  delete: 'Verwijderen',
  deleting: 'Bezig met verwijderen...',
  saveChanges: 'Wijzigingen opslaan',
  saving: 'Bezig met opslaan...',
  cancel: 'Annuleren',
  showMore: 'Meer tonen',
  allFieldsRequired: 'Alle velden zijn verplicht.',
  updateReportFailed: 'Rapport bijwerken mislukt.',
  deleteReportFailed: 'Rapport verwijderen mislukt.',
  deleteReportTitle: 'Rapport verwijderen',
  deleteReportConfirm:
    'Weet je zeker dat je dit rapport wil verwijderen? Deze actie is permanent en kan niet ongedaan gemaakt worden.',
  deleteReportButton: 'Rapport verwijderen',

  noContributionsTitle: 'Nog geen bijdragen',
  noContributionsOwn:
    'Je hebt nog geen compatibiliteitsrapporten ingediend. Bekijk de catalogus en deel je ervaring.',
  noContributionsOther:
    'Deze gebruiker heeft nog geen compatibiliteitsrapporten ingediend.',
  browseGames: 'Games bekijken',

  compatibilityBreakdown: 'Compatibiliteitsoverzicht',
  relatedGames: 'Gerelateerde games',
  noRelatedGames: 'Geen gerelateerde games gevonden.',
  noReportsTitle: 'Nog geen compatibiliteitsrapporten',
  noReportsDescription:
    'Er zijn nog geen rapporten ingediend voor dit spel. Compatibiliteitsinformatie verschijnt zodra gebruikers beginnen bij te dragen.',
  loginToContribute: 'Inloggen om bij te dragen',

  // Dashboard
  dashboard: 'Dashboard',
  dashboardDescription:
    'Compatibiliteits- en communitystatistieken van ProtonDB Clone.',
  users: 'Gebruikers',
  gamesByGenre: 'Games per genre',
  gamesByGenreDescription:
    'Aantal games in de catalogus per genre.',
  compatibilityOverview: 'Compatibiliteitsoverzicht',
  compatibilityOverviewDescription:
    'Algemene verdeling van compatibiliteitsniveaus in de gamecatalogus.',
  compatibilityByGenre: 'Compatibiliteit per genre',
  compatibilityByGenreDescription:
    'Selecteer een genre om de compatibiliteitsverdeling te bekijken.',
  mostReportedGames: 'Games met de meeste rapporten',
  topContributors: 'Topbijdragers',
  reportsPerGame: 'Rapporten / Game',
  numberOfGames: 'Aantal games',
  genre: 'Genre',
  game: 'game',
  gamePlural: 'games',
  reportPlural: 'rapporten',
  noGenreData: 'Geen compatibiliteitsgegevens per genre beschikbaar.',
  noReportsYet: 'Nog geen rapporten.',
  noContributorsYet: 'Nog geen bijdragers.',
  backToTop: 'Terug naar boven',
  loadingDashboard: 'Dashboard laden...',
  dashboardLoadFailed: 'Dashboard kon niet worden geladen.',
  dashboardBackendHint:
    'Controleer of de backend actief is en het /dashboard-endpoint beschikbaar is.',
  noDashboardStats: 'Geen dashboardstatistieken beschikbaar.',
};

const de: Record<TranslationKey, string> = {
  home: 'Start',
  games: 'Spiele',
  login: 'Anmelden',
  register: 'Registrieren',
  logout: 'Abmelden',
  welcome: 'Willkommen',
  profile: 'Profil',

  createAccount: 'Konto erstellen',
  username: 'Benutzername',
  email: 'E-Mail',
  password: 'Passwort',
  alreadyHaveAccount: 'Hast du schon ein Konto?',
  registrationError: 'Bei der Registrierung ist ein Fehler aufgetreten.',
  usernameRequired: 'Benutzername ist erforderlich.',
  emailRequired: 'E-Mail ist erforderlich.',
  invalidEmail: 'Bitte gib eine gültige E-Mail-Adresse ein.',
  passwordRequired: 'Passwort ist erforderlich.',
  passwordTooShort: 'Das Passwort muss mindestens 6 Zeichen lang sein.',
  usernameTaken: 'Dieser Benutzername ist bereits vergeben.',
  registrationFailed:
    'Registrierung fehlgeschlagen. Bitte versuche es erneut.',

  loginFailed: 'Anmeldung fehlgeschlagen.',
  invalidCredentials: 'Ungültiger Benutzername oder ungültiges Passwort.',

  searchPlaceholder: 'Spielname oder Steam-ID eingeben',
  searchError: 'Die Spielsuche ist fehlgeschlagen.',
  noGames: 'Keine Spiele gefunden.',
  noGamesMatchFilters: 'Keine Spiele entsprechen den gewählten Filtern.',
  grid: 'Raster',
  list: 'Liste',
  steamAppId: 'Steam-App-ID',

  allGenres: 'Alle Genres',
  genreCountOne: '{count} Genre',
  genreCountMany: '{count} Genres',
  allTiers: 'Alle Stufen',
  tierCountOne: '{count} Stufe',
  tierCountMany: '{count} Stufen',
  defaultOrdering: 'Standard',
  orderingOptions: 'Sortieroptionen',
  reset: 'Zurücksetzen',
  close: 'Schließen',
  genres: 'Genres',
  compatibilityTiers: 'Kompatibilitätsstufen',
  ordering: 'Sortierung',
  orderingHint:
    'Du kannst Sortierkategorien kombinieren, solange sie sich nicht widersprechen.',
  name: 'Name',
  nameAsc: 'Name A → Z',
  nameDesc: 'Name Z → A',
  clearNameOrdering: 'Namenssortierung zurücksetzen',
  steamAsc: 'Niedrig → Hoch',
  steamDesc: 'Hoch → Niedrig',
  clearSteamOrdering: 'Steam-Sortierung zurücksetzen',
  compatibility: 'Kompatibilität',
  tierBest: 'Beste → Schlechteste',
  tierWorst: 'Schlechteste → Beste',
  clearTierOrdering: 'Kompatibilitätssortierung zurücksetzen',

  previous: 'Zurück',
  next: 'Weiter',
  pageOf: 'Seite {current} von {total}',

  reports: 'Berichte',
  noReports: 'Keine Berichte für diese Steam-App-ID gefunden.',
  submitReport: 'Bericht einreichen',
  loginRequiredForReport:
    'Du musst angemeldet sein, um einen Kompatibilitätsbericht einzureichen.',
  compatibilityRating: 'Kompatibilitätsbewertung',
  linuxDistribution: 'Linux-Distribution',
  distributionPlaceholder: 'z. B. Ubuntu, Fedora, Arch',
  distributionRequired: 'Distribution ist erforderlich.',
  protonVersion: 'Proton-Version',
  protonVersionPlaceholder: 'z. B. 9.0-3',
  protonVersionRequired: 'Proton-Version ist erforderlich.',
  comment: 'Kommentar',
  commentPlaceholder: 'Beschreibe deine Erfahrung mit diesem Spiel...',
  commentRequired: 'Kommentar ist erforderlich.',
  submitReportButton: 'Bericht senden',
  submittingReport: 'Wird gesendet...',
  reportSubmittedSuccessfully: 'Bericht erfolgreich gesendet.',
  reportSubmissionFailed: 'Bericht konnte nicht gesendet werden.',

  language: 'Sprache',
  english: 'Englisch',
  spanish: 'Spanisch',
  flemish: 'Flämisch',
  german: 'Deutsch',
  french: 'Französisch',
  chinese: 'Chinesisch',
  japanese: 'Japanisch',
  turkish: 'Türkisch',

  platinum: 'Platin',
  gold: 'Gold',
  silver: 'Silber',
  bronze: 'Bronze',
  borked: 'Kaputt',
  pending: 'Ausstehend',
  platinumDescription: 'Funktioniert sofort einwandfrei',
  goldDescription: 'Funktioniert nach Anpassungen einwandfrei',
  silverDescription: 'Spielbar mit kleineren Problemen',
  bronzeDescription: 'Spielbar, aber mit schweren Problemen',
  borkedDescription: 'Völlig unspielbar',
  pendingDescription: 'Noch nicht genug Berichte',

  edit: 'Bearbeiten',
  delete: 'Löschen',
  deleting: 'Wird gelöscht...',
  saveChanges: 'Änderungen speichern',
  saving: 'Wird gespeichert...',
  cancel: 'Abbrechen',
  showMore: 'Mehr anzeigen',
  allFieldsRequired: 'Alle Felder sind erforderlich.',
  updateReportFailed: 'Bericht konnte nicht aktualisiert werden.',
  deleteReportFailed: 'Bericht konnte nicht gelöscht werden.',
  deleteReportTitle: 'Bericht löschen',
  deleteReportConfirm:
    'Möchtest du diesen Bericht wirklich löschen? Diese Aktion ist endgültig und kann nicht rückgängig gemacht werden.',
  deleteReportButton: 'Bericht löschen',

  noContributionsTitle: 'Noch keine Beiträge',
  noContributionsOwn:
    'Du hast noch keine Kompatibilitätsberichte eingereicht. Sieh dir den Katalog an und teile deine Erfahrung.',
  noContributionsOther:
    'Dieser Benutzer hat noch keine Kompatibilitätsberichte eingereicht.',
  browseGames: 'Spiele durchsuchen',

  compatibilityBreakdown: 'Kompatibilitätsübersicht',
  relatedGames: 'Ähnliche Spiele',
  noRelatedGames: 'Keine ähnlichen Spiele gefunden.',
  noReportsTitle: 'Noch keine Kompatibilitätsberichte',
  noReportsDescription:
    'Für dieses Spiel wurden noch keine Berichte eingereicht. Kompatibilitätsinformationen erscheinen, sobald Benutzer beitragen.',
  loginToContribute: 'Zum Beitragen anmelden',


  // Dashboard
  dashboard: 'Dashboard',
  dashboardDescription:
    'Kompatibilitäts- und Community-Statistiken von ProtonDB Clone.',
  users: 'Benutzer',
  gamesByGenre: 'Spiele nach Genre',
  gamesByGenreDescription:
    'Anzahl der Katalogspiele pro Genre.',
  compatibilityOverview: 'Kompatibilitätsübersicht',
  compatibilityOverviewDescription:
    'Gesamtverteilung der Kompatibilitätsstufen im Spielekatalog.',
  compatibilityByGenre: 'Kompatibilität nach Genre',
  compatibilityByGenreDescription:
    'Wähle ein Genre aus, um dessen Kompatibilitätsverteilung anzuzeigen.',
  mostReportedGames: 'Spiele mit den meisten Berichten',
  topContributors: 'Top-Mitwirkende',
  reportsPerGame: 'Berichte / Spiel',
  numberOfGames: 'Anzahl der Spiele',
  genre: 'Genre',
  game: 'Spiel',
  gamePlural: 'Spiele',
  reportPlural: 'Berichte',
  noGenreData: 'Keine Kompatibilitätsdaten für Genres verfügbar.',
  noReportsYet: 'Noch keine Berichte.',
  noContributorsYet: 'Noch keine Mitwirkenden.',
  backToTop: 'Nach oben',
  loadingDashboard: 'Dashboard wird geladen...',
  dashboardLoadFailed: 'Dashboard konnte nicht geladen werden.',
  dashboardBackendHint:
    'Stelle sicher, dass das Backend läuft und der /dashboard-Endpunkt verfügbar ist.',
  noDashboardStats: 'Keine Dashboard-Statistiken verfügbar.',
};

const fr: Record<TranslationKey, string> = {
  home: 'Accueil',
  games: 'Jeux',
  login: 'Connexion',
  register: 'S’inscrire',
  logout: 'Déconnexion',
  welcome: 'Bienvenue',
  profile: 'Profil',

  createAccount: 'Créer un compte',
  username: 'Nom d’utilisateur',
  email: 'Adresse e-mail',
  password: 'Mot de passe',
  alreadyHaveAccount: 'Vous avez déjà un compte ?',
  registrationError: 'Une erreur s’est produite lors de l’inscription.',
  usernameRequired: 'Le nom d’utilisateur est obligatoire.',
  emailRequired: 'L’adresse e-mail est obligatoire.',
  invalidEmail: 'Veuillez saisir une adresse e-mail valide.',
  passwordRequired: 'Le mot de passe est obligatoire.',
  passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères.',
  usernameTaken: 'Ce nom d’utilisateur est déjà pris.',
  registrationFailed: 'L’inscription a échoué. Veuillez réessayer.',

  loginFailed: 'Échec de la connexion.',
  invalidCredentials: 'Nom d’utilisateur ou mot de passe incorrect.',

  searchPlaceholder: 'Saisissez le nom du jeu ou l’ID Steam',
  searchError: 'La recherche de jeux a échoué.',
  noGames: 'Aucun jeu trouvé.',
  noGamesMatchFilters: 'Aucun jeu ne correspond aux filtres sélectionnés.',
  grid: 'Grille',
  list: 'Liste',
  steamAppId: 'ID d’application Steam',

  allGenres: 'Tous les genres',
  genreCountOne: '{count} genre',
  genreCountMany: '{count} genres',
  allTiers: 'Tous les niveaux',
  tierCountOne: '{count} niveau',
  tierCountMany: '{count} niveaux',
  defaultOrdering: 'Par défaut',
  orderingOptions: 'Options de tri',
  reset: 'Réinitialiser',
  close: 'Fermer',
  genres: 'Genres',
  compatibilityTiers: 'Niveaux de compatibilité',
  ordering: 'Tri',
  orderingHint:
    'Vous pouvez combiner des critères de tri qui ne se contredisent pas.',
  name: 'Nom',
  nameAsc: 'Nom A → Z',
  nameDesc: 'Nom Z → A',
  clearNameOrdering: 'Effacer le tri par nom',
  steamAsc: 'Croissant',
  steamDesc: 'Décroissant',
  clearSteamOrdering: 'Effacer le tri Steam',
  compatibility: 'Compatibilité',
  tierBest: 'Meilleur → Pire',
  tierWorst: 'Pire → Meilleur',
  clearTierOrdering: 'Effacer le tri par compatibilité',

  previous: 'Précédent',
  next: 'Suivant',
  pageOf: 'Page {current} sur {total}',

  reports: 'Rapports',
  noReports: 'Aucun rapport trouvé pour cet ID d’application Steam.',
  submitReport: 'Envoyer un rapport',
  loginRequiredForReport:
    'Vous devez être connecté pour envoyer un rapport de compatibilité.',
  compatibilityRating: 'Évaluation de compatibilité',
  linuxDistribution: 'Distribution Linux',
  distributionPlaceholder: 'p. ex. Ubuntu, Fedora, Arch',
  distributionRequired: 'La distribution est obligatoire.',
  protonVersion: 'Version de Proton',
  protonVersionPlaceholder: 'p. ex. 9.0-3',
  protonVersionRequired: 'La version de Proton est obligatoire.',
  comment: 'Commentaire',
  commentPlaceholder: 'Décrivez votre expérience avec ce jeu...',
  commentRequired: 'Le commentaire est obligatoire.',
  submitReportButton: 'Envoyer le rapport',
  submittingReport: 'Envoi en cours...',
  reportSubmittedSuccessfully: 'Rapport envoyé avec succès.',
  reportSubmissionFailed: 'Échec de l’envoi du rapport.',

  language: 'Langue',
  english: 'Anglais',
  spanish: 'Espagnol',
  flemish: 'Flamand',
  german: 'Allemand',
  french: 'Français',
  chinese: 'Chinois',
  japanese: 'Japonais',
  turkish: 'Turc',

  platinum: 'Platine',
  gold: 'Or',
  silver: 'Argent',
  bronze: 'Bronze',
  borked: 'Cassé',
  pending: 'En attente',
  platinumDescription: 'Fonctionne parfaitement sans réglages',
  goldDescription: 'Fonctionne parfaitement après quelques réglages',
  silverDescription: 'Jouable avec des problèmes mineurs',
  bronzeDescription: 'Jouable mais avec de graves problèmes',
  borkedDescription: 'Complètement injouable',
  pendingDescription: 'Pas encore assez de rapports',

  edit: 'Modifier',
  delete: 'Supprimer',
  deleting: 'Suppression...',
  saveChanges: 'Enregistrer les modifications',
  saving: 'Enregistrement...',
  cancel: 'Annuler',
  showMore: 'Afficher plus',
  allFieldsRequired: 'Tous les champs sont obligatoires.',
  updateReportFailed: 'Échec de la mise à jour du rapport.',
  deleteReportFailed: 'Échec de la suppression du rapport.',
  deleteReportTitle: 'Supprimer le rapport',
  deleteReportConfirm:
    'Voulez-vous vraiment supprimer ce rapport ? Cette action est définitive et irréversible.',
  deleteReportButton: 'Supprimer le rapport',

  noContributionsTitle: 'Aucune contribution pour l’instant',
  noContributionsOwn:
    'Vous n’avez pas encore envoyé de rapport de compatibilité. Parcourez le catalogue et partagez votre expérience.',
  noContributionsOther:
    'Cet utilisateur n’a pas encore envoyé de rapport de compatibilité.',
  browseGames: 'Parcourir les jeux',

  compatibilityBreakdown: 'Répartition de la compatibilité',
  relatedGames: 'Jeux similaires',
  noRelatedGames: 'Aucun jeu similaire trouvé.',
  noReportsTitle: 'Aucun rapport de compatibilité pour l’instant',
  noReportsDescription:
    'Aucun rapport n’a encore été envoyé pour ce jeu. Les informations de compatibilité apparaîtront dès que les utilisateurs commenceront à contribuer.',
  loginToContribute: 'Connectez-vous pour contribuer',


  // Dashboard
  dashboard: 'Tableau de bord',
  dashboardDescription:
    'Statistiques de compatibilité et de communauté de ProtonDB Clone.',
  users: 'Utilisateurs',
  gamesByGenre: 'Jeux par genre',
  gamesByGenreDescription:
    'Nombre de jeux du catalogue appartenant à chaque genre.',
  compatibilityOverview: 'Aperçu de la compatibilité',
  compatibilityOverviewDescription:
    'Répartition globale des niveaux de compatibilité du catalogue de jeux.',
  compatibilityByGenre: 'Compatibilité par genre',
  compatibilityByGenreDescription:
    'Sélectionnez un genre pour explorer sa répartition de compatibilité.',
  mostReportedGames: 'Jeux avec le plus de rapports',
  topContributors: 'Meilleurs contributeurs',
  reportsPerGame: 'Rapports / Jeu',
  numberOfGames: 'Nombre de jeux',
  genre: 'Genre',
  game: 'jeu',
  gamePlural: 'jeux',
  reportPlural: 'rapports',
  noGenreData: 'Aucune donnée de compatibilité par genre disponible.',
  noReportsYet: 'Aucun rapport pour le moment.',
  noContributorsYet: 'Aucun contributeur pour le moment.',
  backToTop: 'Retour en haut',
  loadingDashboard: 'Chargement du tableau de bord...',
  dashboardLoadFailed: 'Échec du chargement du tableau de bord.',
  dashboardBackendHint:
    'Assurez-vous que le backend fonctionne et que le endpoint /dashboard est disponible.',
  noDashboardStats: 'Aucune statistique disponible.',
};

/*
 * Chinese has no grammatical plural, so genreCountOne and genreCountMany
 * are deliberately identical. Same for Japanese and Turkish below — the
 * duplication is correct, not an oversight.
 */
const zh: Record<TranslationKey, string> = {
  home: '首页',
  games: '游戏',
  login: '登录',
  register: '注册',
  logout: '退出登录',
  welcome: '欢迎',
  profile: '个人资料',

  createAccount: '创建账户',
  username: '用户名',
  email: '电子邮箱',
  password: '密码',
  alreadyHaveAccount: '已经有账户了？',
  registrationError: '注册过程中发生错误。',
  usernameRequired: '请输入用户名。',
  emailRequired: '请输入电子邮箱。',
  invalidEmail: '请输入有效的电子邮箱地址。',
  passwordRequired: '请输入密码。',
  passwordTooShort: '密码长度至少为 6 个字符。',
  usernameTaken: '该用户名已被使用。',
  registrationFailed: '注册失败，请重试。',

  loginFailed: '登录失败。',
  invalidCredentials: '用户名或密码不正确。',

  searchPlaceholder: '输入游戏名称或 Steam ID',
  searchError: '搜索游戏失败。',
  noGames: '未找到游戏。',
  noGamesMatchFilters: '没有游戏符合所选筛选条件。',
  grid: '网格',
  list: '列表',
  steamAppId: 'Steam 应用 ID',

  allGenres: '所有类型',
  genreCountOne: '{count} 个类型',
  genreCountMany: '{count} 个类型',
  allTiers: '所有等级',
  tierCountOne: '{count} 个等级',
  tierCountMany: '{count} 个等级',
  defaultOrdering: '默认',
  orderingOptions: '排序选项',
  reset: '重置',
  close: '关闭',
  genres: '类型',
  compatibilityTiers: '兼容性等级',
  ordering: '排序',
  orderingHint: '你可以组合互不冲突的排序方式。',
  name: '名称',
  nameAsc: '名称 A → Z',
  nameDesc: '名称 Z → A',
  clearNameOrdering: '清除名称排序',
  steamAsc: '从低到高',
  steamDesc: '从高到低',
  clearSteamOrdering: '清除 Steam 排序',
  compatibility: '兼容性',
  tierBest: '最佳 → 最差',
  tierWorst: '最差 → 最佳',
  clearTierOrdering: '清除兼容性排序',

  previous: '上一页',
  next: '下一页',
  pageOf: '第 {current} 页，共 {total} 页',

  reports: '报告',
  noReports: '未找到该 Steam 应用 ID 的报告。',
  submitReport: '提交报告',
  loginRequiredForReport: '你需要登录才能提交兼容性报告。',
  compatibilityRating: '兼容性评级',
  linuxDistribution: 'Linux 发行版',
  distributionPlaceholder: '例如 Ubuntu、Fedora、Arch',
  distributionRequired: '请填写发行版。',
  protonVersion: 'Proton 版本',
  protonVersionPlaceholder: '例如 9.0-3',
  protonVersionRequired: '请填写 Proton 版本。',
  comment: '评论',
  commentPlaceholder: '描述你运行这款游戏的体验……',
  commentRequired: '请填写评论。',
  submitReportButton: '提交报告',
  submittingReport: '提交中……',
  reportSubmittedSuccessfully: '报告提交成功。',
  reportSubmissionFailed: '提交报告失败。',

  language: '语言',
  english: '英语',
  spanish: '西班牙语',
  flemish: '弗拉芒语',
  german: '德语',
  french: '法语',
  chinese: '中文',
  japanese: '日语',
  turkish: '土耳其语',

  platinum: '白金',
  gold: '黄金',
  silver: '白银',
  bronze: '青铜',
  borked: '无法运行',
  pending: '待定',
  platinumDescription: '无需调整即可完美运行',
  goldDescription: '经过调整后可完美运行',
  silverDescription: '可以游玩，存在小问题',
  bronzeDescription: '可以游玩，但存在严重问题',
  borkedDescription: '完全无法游玩',
  pendingDescription: '报告数量还不够',

  edit: '编辑',
  delete: '删除',
  deleting: '删除中……',
  saveChanges: '保存更改',
  saving: '保存中……',
  cancel: '取消',
  showMore: '显示更多',
  allFieldsRequired: '所有字段均为必填项。',
  updateReportFailed: '更新报告失败。',
  deleteReportFailed: '删除报告失败。',
  deleteReportTitle: '删除报告',
  deleteReportConfirm: '确定要删除这份报告吗？此操作不可撤销。',
  deleteReportButton: '删除报告',

  noContributionsTitle: '还没有贡献',
  noContributionsOwn:
    '你还没有提交任何兼容性报告。浏览游戏目录，分享你的体验吧。',
  noContributionsOther: '该用户还没有提交任何兼容性报告。',
  browseGames: '浏览游戏',

  compatibilityBreakdown: '兼容性分布',
  relatedGames: '相关游戏',
  noRelatedGames: '未找到相关游戏。',
  noReportsTitle: '还没有兼容性报告',
  noReportsDescription:
    '这款游戏还没有收到任何报告。当用户开始贡献后，兼容性信息就会显示在这里。',
  loginToContribute: '登录以贡献报告',

  // Dashboard
  dashboard: '仪表板',
  dashboardDescription:
    'ProtonDB Clone 的兼容性和社区统计信息。',
  users: '用户',
  gamesByGenre: '按类型分类的游戏',
  gamesByGenreDescription:
    '目录中属于各个类型的游戏数量。',
  compatibilityOverview: '兼容性概览',
  compatibilityOverviewDescription:
    '游戏目录中兼容性等级的总体分布。',
  compatibilityByGenre: '按类型查看兼容性',
  compatibilityByGenreDescription:
    '选择一个游戏类型以查看其兼容性分布。',
  mostReportedGames: '报告最多的游戏',
  topContributors: '贡献最多的用户',
  reportsPerGame: '报告 / 游戏',
  numberOfGames: '游戏数量',
  genre: '类型',
  game: '个游戏',
  gamePlural: '个游戏',
  reportPlural: '份报告',
  noGenreData: '暂无游戏类型兼容性数据。',
  noReportsYet: '暂无报告。',
  noContributorsYet: '暂无贡献者。',
  backToTop: '返回顶部',
  loadingDashboard: '正在加载仪表板...',
  dashboardLoadFailed: '无法加载仪表板。',
  dashboardBackendHint:
    '请确保后端正在运行，并且 /dashboard 端点可用。',
  noDashboardStats: '暂无仪表板统计数据。',
};

const ja: Record<TranslationKey, string> = {
  home: 'ホーム',
  games: 'ゲーム',
  login: 'ログイン',
  register: '登録',
  logout: 'ログアウト',
  welcome: 'ようこそ',
  profile: 'プロフィール',

  createAccount: 'アカウントを作成',
  username: 'ユーザー名',
  email: 'メールアドレス',
  password: 'パスワード',
  alreadyHaveAccount: 'すでにアカウントをお持ちですか？',
  registrationError: '登録中にエラーが発生しました。',
  usernameRequired: 'ユーザー名を入力してください。',
  emailRequired: 'メールアドレスを入力してください。',
  invalidEmail: '有効なメールアドレスを入力してください。',
  passwordRequired: 'パスワードを入力してください。',
  passwordTooShort: 'パスワードは6文字以上で入力してください。',
  usernameTaken: 'このユーザー名はすでに使用されています。',
  registrationFailed: '登録に失敗しました。もう一度お試しください。',

  loginFailed: 'ログインに失敗しました。',
  invalidCredentials: 'ユーザー名またはパスワードが正しくありません。',

  searchPlaceholder: 'ゲーム名または Steam ID を入力',
  searchError: 'ゲームの検索に失敗しました。',
  noGames: 'ゲームが見つかりませんでした。',
  noGamesMatchFilters: '選択したフィルターに一致するゲームはありません。',
  grid: 'グリッド',
  list: 'リスト',
  steamAppId: 'Steam アプリ ID',

  allGenres: 'すべてのジャンル',
  genreCountOne: 'ジャンル {count} 件',
  genreCountMany: 'ジャンル {count} 件',
  allTiers: 'すべてのランク',
  tierCountOne: 'ランク {count} 件',
  tierCountMany: 'ランク {count} 件',
  defaultOrdering: 'デフォルト',
  orderingOptions: '並び替えオプション',
  reset: 'リセット',
  close: '閉じる',
  genres: 'ジャンル',
  compatibilityTiers: '互換性ランク',
  ordering: '並び替え',
  orderingHint: '競合しない並び替え条件は組み合わせられます。',
  name: '名前',
  nameAsc: '名前 A → Z',
  nameDesc: '名前 Z → A',
  clearNameOrdering: '名前の並び替えを解除',
  steamAsc: '小さい順',
  steamDesc: '大きい順',
  clearSteamOrdering: 'Steam の並び替えを解除',
  compatibility: '互換性',
  tierBest: '良い → 悪い',
  tierWorst: '悪い → 良い',
  clearTierOrdering: '互換性の並び替えを解除',

  previous: '前へ',
  next: '次へ',
  pageOf: '{total} ページ中 {current} ページ目',

  reports: 'レポート',
  noReports: 'この Steam アプリ ID のレポートは見つかりませんでした。',
  submitReport: 'レポートを投稿',
  loginRequiredForReport:
    '互換性レポートを投稿するにはログインが必要です。',
  compatibilityRating: '互換性評価',
  linuxDistribution: 'Linux ディストリビューション',
  distributionPlaceholder: '例: Ubuntu、Fedora、Arch',
  distributionRequired: 'ディストリビューションを入力してください。',
  protonVersion: 'Proton バージョン',
  protonVersionPlaceholder: '例: 9.0-3',
  protonVersionRequired: 'Proton バージョンを入力してください。',
  comment: 'コメント',
  commentPlaceholder: 'このゲームを動かした体験を書いてください...',
  commentRequired: 'コメントを入力してください。',
  submitReportButton: 'レポートを投稿',
  submittingReport: '送信中...',
  reportSubmittedSuccessfully: 'レポートを投稿しました。',
  reportSubmissionFailed: 'レポートの投稿に失敗しました。',

  language: '言語',
  english: '英語',
  spanish: 'スペイン語',
  flemish: 'フラマン語',
  german: 'ドイツ語',
  french: 'フランス語',
  chinese: '中国語',
  japanese: '日本語',
  turkish: 'トルコ語',

  platinum: 'プラチナ',
  gold: 'ゴールド',
  silver: 'シルバー',
  bronze: 'ブロンズ',
  borked: '動作不可',
  pending: '保留中',
  platinumDescription: '設定不要で完璧に動作',
  goldDescription: '調整すれば完璧に動作',
  silverDescription: '軽微な問題はあるがプレイ可能',
  bronzeDescription: '重大な問題はあるがプレイ可能',
  borkedDescription: 'まったくプレイできない',
  pendingDescription: 'レポートがまだ足りません',

  edit: '編集',
  delete: '削除',
  deleting: '削除中...',
  saveChanges: '変更を保存',
  saving: '保存中...',
  cancel: 'キャンセル',
  showMore: 'もっと見る',
  allFieldsRequired: 'すべての項目を入力してください。',
  updateReportFailed: 'レポートの更新に失敗しました。',
  deleteReportFailed: 'レポートの削除に失敗しました。',
  deleteReportTitle: 'レポートを削除',
  deleteReportConfirm:
    'このレポートを削除しますか？この操作は取り消せません。',
  deleteReportButton: 'レポートを削除',

  noContributionsTitle: 'まだ投稿がありません',
  noContributionsOwn:
    'まだ互換性レポートを投稿していません。ゲーム一覧を見て体験を共有しましょう。',
  noContributionsOther:
    'このユーザーはまだ互換性レポートを投稿していません。',
  browseGames: 'ゲームを見る',

  compatibilityBreakdown: '互換性の内訳',
  relatedGames: '関連ゲーム',
  noRelatedGames: '関連ゲームは見つかりませんでした。',
  noReportsTitle: 'まだ互換性レポートがありません',
  noReportsDescription:
    'このゲームにはまだレポートが投稿されていません。ユーザーが投稿を始めると互換性情報が表示されます。',
  loginToContribute: 'ログインして投稿する',

  // Dashboard
  dashboard: 'ダッシュボード',
  dashboardDescription:
    'ProtonDB Clone の互換性とコミュニティの統計情報。',
  users: 'ユーザー',
  gamesByGenre: 'ジャンル別ゲーム',
  gamesByGenreDescription:
    '各ジャンルに属するカタログ内のゲーム数。',
  compatibilityOverview: '互換性の概要',
  compatibilityOverviewDescription:
    'ゲームカタログ全体の互換性ティア分布。',
  compatibilityByGenre: 'ジャンル別の互換性',
  compatibilityByGenreDescription:
    'ジャンルを選択して互換性の分布を確認できます。',
  mostReportedGames: 'レポート数の多いゲーム',
  topContributors: 'トップ貢献者',
  reportsPerGame: 'レポート / ゲーム',
  numberOfGames: 'ゲーム数',
  genre: 'ジャンル',
  game: 'ゲーム',
  gamePlural: 'ゲーム',
  reportPlural: 'レポート',
  noGenreData: 'ジャンル別の互換性データはありません。',
  noReportsYet: 'まだレポートはありません。',
  noContributorsYet: 'まだ貢献者はいません。',
  backToTop: 'トップへ戻る',
  loadingDashboard: 'ダッシュボードを読み込み中...',
  dashboardLoadFailed: 'ダッシュボードを読み込めませんでした。',
  dashboardBackendHint:
    'バックエンドが実行中で、/dashboard エンドポイントが利用可能であることを確認してください。',
  noDashboardStats: 'ダッシュボードの統計情報はありません。',
};

const tr: Record<TranslationKey, string> = {
  home: 'Ana sayfa',
  games: 'Oyunlar',
  login: 'Giriş yap',
  register: 'Kayıt ol',
  logout: 'Çıkış yap',
  welcome: 'Hoş geldin',
  profile: 'Profil',

  createAccount: 'Hesap oluştur',
  username: 'Kullanıcı adı',
  email: 'E-posta',
  password: 'Şifre',
  alreadyHaveAccount: 'Zaten hesabın var mı?',
  registrationError: 'Kayıt sırasında bir hata oluştu.',
  usernameRequired: 'Kullanıcı adı zorunludur.',
  emailRequired: 'E-posta adresi zorunludur.',
  invalidEmail: 'Geçerli bir e-posta adresi gir.',
  passwordRequired: 'Şifre zorunludur.',
  passwordTooShort: 'Şifre en az 6 karakter olmalıdır.',
  usernameTaken: 'Bu kullanıcı adı zaten alınmış.',
  registrationFailed: 'Kayıt başarısız oldu. Lütfen tekrar dene.',

  loginFailed: 'Giriş başarısız oldu.',
  invalidCredentials: 'Kullanıcı adı veya şifre hatalı.',

  searchPlaceholder: 'Oyun adı veya Steam kimliği gir',
  searchError: 'Oyunlar aranamadı.',
  noGames: 'Oyun bulunamadı.',
  noGamesMatchFilters: 'Seçilen filtrelerle eşleşen oyun yok.',
  grid: 'Izgara',
  list: 'Liste',
  steamAppId: 'Steam Uygulama Kimliği',

  allGenres: 'Tüm türler',
  genreCountOne: '{count} tür',
  genreCountMany: '{count} tür',
  allTiers: 'Tüm seviyeler',
  tierCountOne: '{count} seviye',
  tierCountMany: '{count} seviye',
  defaultOrdering: 'Varsayılan',
  orderingOptions: 'Sıralama seçenekleri',
  reset: 'Sıfırla',
  close: 'Kapat',
  genres: 'Türler',
  compatibilityTiers: 'Uyumluluk seviyeleri',
  ordering: 'Sıralama',
  orderingHint:
    'Birbiriyle çakışmayan sıralama ölçütlerini birlikte kullanabilirsin.',
  name: 'Ad',
  nameAsc: 'Ad A → Z',
  nameDesc: 'Ad Z → A',
  clearNameOrdering: 'Ad sıralamasını temizle',
  steamAsc: 'Düşük → Yüksek',
  steamDesc: 'Yüksek → Düşük',
  clearSteamOrdering: 'Steam sıralamasını temizle',
  compatibility: 'Uyumluluk',
  tierBest: 'En iyi → En kötü',
  tierWorst: 'En kötü → En iyi',
  clearTierOrdering: 'Uyumluluk sıralamasını temizle',

  previous: 'Önceki',
  next: 'Sonraki',
  pageOf: 'Sayfa {current} / {total}',

  reports: 'Raporlar',
  noReports: 'Bu Steam Uygulama Kimliği için rapor bulunamadı.',
  submitReport: 'Rapor gönder',
  loginRequiredForReport:
    'Uyumluluk raporu göndermek için giriş yapmalısın.',
  compatibilityRating: 'Uyumluluk derecesi',
  linuxDistribution: 'Linux dağıtımı',
  distributionPlaceholder: 'ör. Ubuntu, Fedora, Arch',
  distributionRequired: 'Dağıtım zorunludur.',
  protonVersion: 'Proton sürümü',
  protonVersionPlaceholder: 'ör. 9.0-3',
  protonVersionRequired: 'Proton sürümü zorunludur.',
  comment: 'Yorum',
  commentPlaceholder: 'Bu oyunu çalıştırma deneyimini anlat...',
  commentRequired: 'Yorum zorunludur.',
  submitReportButton: 'Raporu gönder',
  submittingReport: 'Gönderiliyor...',
  reportSubmittedSuccessfully: 'Rapor başarıyla gönderildi.',
  reportSubmissionFailed: 'Rapor gönderilemedi.',

  language: 'Dil',
  english: 'İngilizce',
  spanish: 'İspanyolca',
  flemish: 'Flamanca',
  german: 'Almanca',
  french: 'Fransızca',
  chinese: 'Çince',
  japanese: 'Japonca',
  turkish: 'Türkçe',

  platinum: 'Platin',
  gold: 'Altın',
  silver: 'Gümüş',
  bronze: 'Bronz',
  borked: 'Bozuk',
  pending: 'Beklemede',
  platinumDescription: 'Hiçbir ayar gerekmeden kusursuz çalışıyor',
  goldDescription: 'Birkaç ayardan sonra kusursuz çalışıyor',
  silverDescription: 'Küçük sorunlarla oynanabilir',
  bronzeDescription: 'Oynanabilir ama ciddi sorunları var',
  borkedDescription: 'Tamamen oynanamaz',
  pendingDescription: 'Henüz yeterli rapor yok',

  edit: 'Düzenle',
  delete: 'Sil',
  deleting: 'Siliniyor...',
  saveChanges: 'Değişiklikleri kaydet',
  saving: 'Kaydediliyor...',
  cancel: 'İptal',
  showMore: 'Daha fazla göster',
  allFieldsRequired: 'Tüm alanlar zorunludur.',
  updateReportFailed: 'Rapor güncellenemedi.',
  deleteReportFailed: 'Rapor silinemedi.',
  deleteReportTitle: 'Raporu sil',
  deleteReportConfirm:
    'Bu raporu silmek istediğine emin misin? Bu işlem kalıcıdır ve geri alınamaz.',
  deleteReportButton: 'Raporu sil',

  noContributionsTitle: 'Henüz katkı yok',
  noContributionsOwn:
    'Henüz uyumluluk raporu göndermedin. Kataloğa göz at ve deneyimini paylaş.',
  noContributionsOther:
    'Bu kullanıcı henüz uyumluluk raporu göndermedi.',
  browseGames: 'Oyunlara göz at',

  compatibilityBreakdown: 'Uyumluluk dağılımı',
  relatedGames: 'Benzer oyunlar',
  noRelatedGames: 'Benzer oyun bulunamadı.',
  noReportsTitle: 'Henüz uyumluluk raporu yok',
  noReportsDescription:
    'Bu oyun için henüz rapor gönderilmedi. Kullanıcılar katkıda bulunmaya başladığında uyumluluk bilgileri burada görünecek.',
  loginToContribute: 'Katkıda bulunmak için giriş yap',

  // Dashboard
  dashboard: 'Kontrol Paneli',
  dashboardDescription:
    'ProtonDB Clone genelindeki uyumluluk ve topluluk istatistikleri.',
  users: 'Kullanıcılar',
  gamesByGenre: 'Türe Göre Oyunlar',
  gamesByGenreDescription:
    'Her türe ait katalog oyunlarının sayısı.',
  compatibilityOverview: 'Uyumluluk Genel Bakışı',
  compatibilityOverviewDescription:
    'Oyun kataloğundaki genel uyumluluk seviyesi dağılımı.',
  compatibilityByGenre: 'Türe Göre Uyumluluk',
  compatibilityByGenreDescription:
    'Uyumluluk dağılımını görmek için bir tür seçin.',
  mostReportedGames: 'En Çok Raporlanan Oyunlar',
  topContributors: 'En Çok Katkıda Bulunanlar',
  reportsPerGame: 'Rapor / Oyun',
  numberOfGames: 'Oyun sayısı',
  genre: 'Tür',
  game: 'oyun',
  gamePlural: 'oyun',
  reportPlural: 'rapor',
  noGenreData: 'Tür uyumluluğu verisi mevcut değil.',
  noReportsYet: 'Henüz rapor yok.',
  noContributorsYet: 'Henüz katkıda bulunan yok.',
  backToTop: 'Başa dön',
  loadingDashboard: 'Kontrol paneli yükleniyor...',
  dashboardLoadFailed: 'Kontrol paneli yüklenemedi.',
  dashboardBackendHint:
    'Backend’in çalıştığından ve /dashboard endpointinin kullanılabilir olduğundan emin olun.',
  noDashboardStats: 'Kontrol paneli istatistikleri mevcut değil.',
};

const translations: Record<Language, Record<TranslationKey, string>> = {
  en,
  es,
  nl,
  de,
  fr,
  zh,
  ja,
  tr,
};

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

export type TranslateParams = Record<string, string | number>;

export type Translate = (
  key: TranslationKey,
  params?: TranslateParams
) => string;

interface LanguageContextValue {
  language: Language;
  locale: string;
  setLanguage: (language: Language) => void;
  t: Translate;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = 'language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] =
    useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);

    if (isLanguage(savedLanguage)) {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem(STORAGE_KEY, newLanguage);
    document.documentElement.lang = newLanguage;
  };

  /*
   * Placeholders are written as {name} and replaced at call time:
   *
   *   t('pageOf', { current: 2, total: 7 })  ->  "Page 2 of 7"
   *
   * This keeps sentences whole inside the translation files instead of
   * gluing fragments together in the components. It also lets languages
   * reorder the parts — Japanese puts {total} first.
   */
  const t: Translate = (key, params) => {
    const template = translations[language][key];

    if (!params) {
      return template;
    }

    return Object.entries(params).reduce(
      (text, [placeholder, value]) =>
        text.split(`{${placeholder}}`).join(String(value)),
      template
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        locale: getLocale(language),
        setLanguage,
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
    throw new Error('useLanguage must be used inside LanguageProvider');
  }

  return context;
}