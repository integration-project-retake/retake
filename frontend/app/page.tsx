import { fetchGames } from '@/services/gameService';
import GameSearch from '@/components/GameSearch';

export default async function Home() {
  const games = await fetchGames();

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Games</h1>
        <GameSearch initialGames={games} />
      </div>
    </main>
  );
}