export const genreColors: Record<string, string> = {
  Action: 'bg-red-900 text-red-200',
  Adventure: 'bg-green-900 text-green-200',
  RPG: 'bg-purple-900 text-purple-200',
  Strategy: 'bg-blue-900 text-blue-200',
  MOBA: 'bg-orange-900 text-orange-200',
  Roguelike: 'bg-pink-900 text-pink-200',
  'Open World': 'bg-teal-900 text-teal-200',
  Metroidvania: 'bg-cyan-900 text-cyan-200',
  Simulation: 'bg-lime-900 text-lime-200',
};

export function getGenreColor(genre: string): string {
  return genreColors[genre] ?? 'bg-gray-700 text-gray-200';
}