'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { searchGames } from '@/services/gameService';
import { useLanguage } from '@/context/LanguageContext';
import type { GameDto } from '@/types';

const tierColors: Record<string, string> = {
  Platinum: 'bg-blue-200 text-blue-900',
  Gold: 'bg-yellow-400 text-yellow-900',
  Silver: 'bg-gray-300 text-gray-900',
  Bronze: 'bg-orange-500 text-orange-950',
  Borked: 'bg-red-600 text-white',
  Pending: 'bg-gray-600 text-gray-300',
};

interface GameSearchProps {
  initialGames: GameDto[];
}

type LayoutMode = 'grid' | 'list';

export default function GameSearch({
  initialGames,
}: GameSearchProps) {
  const { t } = useLanguage();

  const [query, setQuery] = useState('');
  const [games, setGames] = useState(initialGames);
  const [error, setError] = useState('');
  const [layout, setLayout] = useState<LayoutMode>('grid');

  // Restore the user's selected layout
  useEffect(() => {
    const savedLayout = localStorage.getItem('gameLayout');

    if (savedLayout === 'grid' || savedLayout === 'list') {
      setLayout(savedLayout);
    }
  }, []);

  // Persist layout preference
  useEffect(() => {
    localStorage.setItem('gameLayout', layout);
  }, [layout]);

  // Search games after a short debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setGames(initialGames);
        setError('');
        return;
      }

      try {
        setError('');

        const results = await searchGames(query);
        setGames(results);
      } catch (error) {
        console.error('Game search failed:', error);
        setError(t('searchError'));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, initialGames, t]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setLayout('grid')}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              layout === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Grid
          </button>

          <button
            type="button"
            onClick={() => setLayout('list')}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              layout === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950 p-3 text-red-200">
          {error}
        </div>
      )}

      <div
        className={
          layout === 'grid'
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col gap-4'
        }
      >
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.steamAppid}`}
            className={`overflow-hidden rounded-lg border border-gray-700 bg-gray-800 transition-colors hover:border-gray-500 ${
              layout === 'list'
                ? 'flex flex-col sm:flex-row'
                : 'flex flex-col'
            }`}
          >
            <img
              src={
                game.headerUrl ||
                `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppid}/header.jpg`
              }
              alt={game.name}
              className={
                layout === 'grid'
                  ? 'aspect-[460/215] w-full object-cover'
                  : 'aspect-[460/215] w-full object-cover sm:w-64'
              }
              loading="lazy"
            />

            <div className="flex flex-1 items-start justify-between p-4">
              <div>
                <h2 className="text-lg font-semibold">{game.name}</h2>

                <p className="mt-1 text-sm text-gray-400">
                  {t('steamAppId')}: {game.steamAppid}
                </p>
              </div>

              <div
                className={`ml-3 rounded px-2 py-1 text-xs font-bold ${
                  game.tier
                    ? tierColors[game.tier]
                    : tierColors.Pending
                }`}
              >
                {game.tier || 'Pending'}
              </div>
            </div>
          </Link>
        ))}

        {games.length === 0 && !error && (
          <div className="rounded-lg border border-gray-700 p-4 text-center text-gray-400">
            {t('noGames')}
          </div>
        )}
      </div>
    </div>
  );
}