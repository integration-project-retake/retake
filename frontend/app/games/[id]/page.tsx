import { fetchReportsBySteamAppid } from '@/services/reportService';
import GameReports from '@/components/GameReports';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  const steamAppid = Number(id);

  const reports = await fetchReportsBySteamAppid(steamAppid);

  return <GameReports reports={reports} steamAppid={steamAppid} />;
}