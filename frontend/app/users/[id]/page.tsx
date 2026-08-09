import { fetchUser } from '@/services/userService';
import { fetchReportsByUser } from '@/services/reportService';
import Link from 'next/link';

export default async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  const user = await fetchUser(id);
  const reports = await fetchReportsByUser(id);

  const tierColors: Record<string, string> = {
    Platinum: 'bg-blue-200 text-blue-900',
    Gold: 'bg-yellow-400 text-yellow-900',
    Silver: 'bg-gray-300 text-gray-900',
    Bronze: 'bg-orange-500 text-orange-950',
    Borked: 'bg-red-600 text-white',
    Pending: 'bg-gray-600 text-gray-300',
  };
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 transition-colors duration-200 hover:text-pink-500">{user.username}</h1>
        <p className="text-gray-400 mb-6">{reports.length} reports contributed</p>

        {reports.length === 0 ? (
          <div className="text-gray-400 p-6 text-center border border-gray-700 rounded-lg">
            No reports yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold underline">
                    <Link href={`/games/${report.steamAppid}`} className='transition-colors duration-300 hover:text-lime-400'>
                      {report.gameName}
                    </Link>
                  </h2>
                  <div className="flex items-center gap-3">
                        <div
                          className={`shrink-0 rounded px-2 py-1 text-xs font-bold ${
                            report.tier
                              ? tierColors[
                                  report.tier
                                ]
                              : tierColors.Pending
                          }`}
                        >
                          {report.tier}
                        </div>
                    <span className="text-gray-500 text-sm italic">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  {report.distribution} • {report.protonVersion ?? 'N/A'}
                </p>
                {report.comment && (
                  <p className="text-gray-300 whitespace-pre-line">{report.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}