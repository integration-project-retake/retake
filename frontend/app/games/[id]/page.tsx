import { fetchReportsBySteamAppid } from '@/services/reportService';
import { fetchGameBySteamAppid } from '@/services/gameService';
import GameReports from '@/components/GameReports';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  const steamAppid = Number(id);

  const [game, reports] = await Promise.all([
    fetchGameBySteamAppid(steamAppid),
    fetchReportsBySteamAppid(steamAppid),
  ]);

  return (
    <GameReports
      reports={reports}
      steamAppid={steamAppid}
      gameId={game.id}
    />
  );
}