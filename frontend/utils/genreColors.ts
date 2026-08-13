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

  Shooter: 'bg-slate-600 text-slate-100',
  Multiplayer: 'bg-indigo-900 text-indigo-200',
  Horror: 'bg-stone-800 text-stone-200',
  'Battle Royale': 'bg-amber-800 text-amber-100',
  Platformer: 'bg-sky-800 text-sky-100',
  Puzzle: 'bg-violet-800 text-violet-100',
  Sports: 'bg-emerald-800 text-emerald-100',
};

export function getGenreColor(genre: string): string {
  return genreColors[genre] ?? 'bg-gray-700 text-gray-200';
}