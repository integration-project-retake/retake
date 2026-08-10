import type { Language } from '@/context/LanguageContext';

const genreLabels: Record<
  string,
  Record<Language, string>
> = {
  Action: {
    en: 'Action',
    es: 'Acción',
  },
  Adventure: {
    en: 'Adventure',
    es: 'Aventura',
  },
  RPG: {
    en: 'RPG',
    es: 'RPG',
  },
  Strategy: {
    en: 'Strategy',
    es: 'Estrategia',
  },
  MOBA: {
    en: 'MOBA',
    es: 'MOBA',
  },
  Roguelike: {
    en: 'Roguelike',
    es: 'Roguelike',
  },
  'Open World': {
    en: 'Open World',
    es: 'Mundo abierto',
  },
  Metroidvania: {
    en: 'Metroidvania',
    es: 'Metroidvania',
  },
  Simulation: {
    en: 'Simulation',
    es: 'Simulación',
  },
};

export function getGenreLabel(
  genre: string,
  language: Language
): string {
  return genreLabels[genre]?.[language] ?? genre;
}