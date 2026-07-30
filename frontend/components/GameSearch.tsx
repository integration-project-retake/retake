'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchGames } from '@/services/gameService';
import type { GameDto } from '@/types';

export default function GameSearch({ initialGames }: { initialGames: GameDto[] }) {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState(initialGames);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const results = await searchGames(query);
      setGames(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter game name or Steam ID"
        className="w-full mb-6 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-500 transition-colors overflow-hidden"
          >
            <img
              src={game.headerUrl}
              alt={game.name}
              className="w-full aspect-[460/215] object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{game.name}</h2>
              <p className="text-gray-400 text-sm mt-1">Steam App ID: {game.steamAppid}</p>
            </div>
          </Link>
        ))}

        {games.length === 0 && (
          <div className="text-gray-400 p-4 text-center border border-gray-700 rounded-lg col-span-full">
            No games found.
          </div>
        )}
      </div>
    </div>
  );
}