import { fetchGames } from '@/services/gameService';
import HomeContent from '@/components/HomeContent';

export default async function Home() {
  const games = await fetchGames();

  return <HomeContent games={games} />;
}