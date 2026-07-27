import Link from 'next/link';
import { fetchGames } from '@/services/gameService';

export default async function Home() {
  const games = await fetchGames();

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Games</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="bg-gray-800 border border-gray-700 p-4 rounded-lg hover:border-gray-500 transition-colors flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{game.name}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Steam App ID: {game.steamAppid}
                </p>
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
    </main>
  );
}
