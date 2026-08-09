import {
  fetchGameBySteamAppid,
  fetchRelatedGames,
} from '@/services/gameService';

import { fetchReportsBySteamAppid } from '@/services/reportService';

import GameReports from '@/components/GameReports';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default async function GamePage({
  params,
}: GamePageProps) {
  const { id } = await params;

  const steamAppid = Number(id);
  fetchGameBySteamAppid(steamAppid);
  fetchReportsBySteamAppid(steamAppid);

  const [game, reports] = await Promise.all([
    fetchGameBySteamAppid(steamAppid),
    fetchReportsBySteamAppid(steamAppid),
  ]);

  const relatedGames =
    await fetchRelatedGames(game.id);

  return (
    <GameReports
      game={game}
      reports={reports}
      relatedGames={relatedGames}
    />
  );
}