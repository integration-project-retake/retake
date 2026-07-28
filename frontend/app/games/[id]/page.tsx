import { fetchReportsByGameId } from '@/services/reportService';
import { Tier } from '@/types';

const tierColors: Record<Tier, string> = {
  Platinum: 'bg-blue-200 text-blue-900',
  Gold: 'bg-yellow-400 text-yellow-900',
  Silver: 'bg-gray-300 text-gray-900',
  Bronze: 'bg-orange-500 text-orange-950',
  Borked: 'bg-red-600 text-white',
};

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  const gameId = Number(id);
  const reports = await fetchReportsByGameId(gameId);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {reports.length > 0 ? reports[0].gameName : `Game #${gameId}`} Reports
        </h1>

        <div className="flex flex-col gap-4">
          {reports.map((report) => (
                      <div key={report.id} className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">
                              {report.username} • {report.distribution} • Proton {report.protonVersion} • {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`px-4 py-1.5 font-bold rounded ${tierColors[report.tier]}`}>
                            {report.tier}
                          </div>
                        </div>
                        {report.comment && (
                          <div className="text-gray-300 mt-2 bg-gray-900 p-3 rounded text-sm whitespace-pre-line">
                            {report.comment}
                          </div>
                        )}
                      </div>
                    ))}

          {reports.length === 0 && (
            <div className="text-gray-400 p-4 text-center border border-gray-700 rounded-lg">
              No reports found for this game ID.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
