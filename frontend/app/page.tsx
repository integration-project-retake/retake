import { fetchReports } from '@/services/reportService';
import { Tier } from '@/types';

const tierColors: Record<Tier, string> = {
  Platinum: 'bg-blue-200 text-blue-900',
  Gold: 'bg-yellow-400 text-yellow-900',
  Silver: 'bg-gray-300 text-gray-900',
  Bronze: 'bg-orange-500 text-orange-950',
  Borked: 'bg-red-600 text-white',
};

export default async function Home() {
  const reports = await fetchReports();

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Recent Reports</h1>

        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{report.gameName}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {report.username} • {report.distribution} • {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className={`px-4 py-1.5 font-bold rounded ${tierColors[report.tier]}`}>
                {report.tier}
              </div>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="text-gray-400 p-4 text-center border border-gray-700 rounded-lg">
              No reports found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
