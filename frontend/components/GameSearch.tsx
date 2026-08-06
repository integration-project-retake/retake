'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { searchGames } from '@/services/gameService';
import { useLanguage } from '@/context/LanguageContext';
import type { GameDto } from '@/types';

interface GameSearchProps {
  initialGames: GameDto[];
}

export default function GameSearch({
  initialGames,
}: GameSearchProps) {
  const { t } = useLanguage();

  const [query, setQuery] = useState('');
  const [games, setGames] = useState(initialGames);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
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
  }, [query, t]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('searchPlaceholder')}
        className="mb-6 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950 p-3 text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.steamAppid}`}
            className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 transition-colors hover:border-gray-500"
          >
            <img
              src={
                game.headerUrl ||
                `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppid}/header.jpg`
              }
              alt={game.name}
              className="aspect-[460/215] w-full object-cover"
              loading="lazy"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold">{game.name}</h2>

              <p className="mt-1 text-sm text-gray-400">
                {t('steamAppId')}: {game.steamAppid}
              </p>
            </div>
          </Link>
        ))}

        {games.length === 0 && !error && (
          <div className="col-span-full rounded-lg border border-gray-700 p-4 text-center text-gray-400">
            {t('noGames')}
          </div>
        )}
      </div>
    </div>
  );
}