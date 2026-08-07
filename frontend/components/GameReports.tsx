'use client';

import { useLanguage } from '@/context/LanguageContext';
import SubmitReportForm from '@/components/SubmitReportForm';
import type { ReportDto, GameDto, Tier } from '@/types';

const tierColors: Record<string, string> = {
  Platinum: 'bg-blue-200 text-blue-900',
  Gold: 'bg-yellow-400 text-yellow-900',
  Silver: 'bg-gray-300 text-gray-900',
  Bronze: 'bg-orange-500 text-orange-950',
  Borked: 'bg-red-600 text-white',
  Pending: 'bg-gray-600 text-gray-300',
};

interface GameReportsProps {
  game: GameDto;
  reports: ReportDto[];
}

export default function GameReports({
  game,
  reports,
}: GameReportsProps) {
  const { language, t } = useLanguage();
  const dateLocale = language === 'es' ? 'es-ES' : 'en-GB';

  return (
    <main className="min-h-screen bg-gray-900 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
          <img
            src={game.headerUrl}
            alt={game.name}
            className="h-64 w-full object-cover"
          />
          <div className="flex items-end justify-between p-6">
            <div>
              <h1 className="text-4xl font-bold">{game.name}</h1>
              <p className="mt-2 text-gray-400">
                {t('steamAppId')}: {game.steamAppid}
              </p>
            </div>
            <div
              className={`rounded px-4 py-2 text-lg font-bold ${
                game.tier ? tierColors[game.tier] : tierColors.Pending
              }`}
            >
              {game.tier || 'Pending'}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <SubmitReportForm gameId={game.id} />
        </div>

        <h2 className="mb-4 text-2xl font-bold">{t('reports')}</h2>

        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col gap-2 rounded-lg border border-gray-700 bg-gray-800 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-gray-400">
                  {report.username} • {report.distribution} •{' '}
                  {report.protonVersion
                    ? `Proton ${report.protonVersion} • `
                    : ''}
                  {new Date(report.createdAt).toLocaleDateString(dateLocale)}
                </p>

                <div
                  className={`rounded px-4 py-1.5 font-bold ${
                    tierColors[report.tier]
                  }`}
                >
                  {report.tier}
                </div>
              </div>

              {report.comment && (
                <div className="mt-2 whitespace-pre-line rounded bg-gray-900 p-3 text-sm text-gray-300">
                  {report.comment}
                </div>
              )}
            </div>
          ))}

          {reports.length === 0 && (
            <div className="rounded-lg border border-gray-700 p-4 text-center text-gray-400">
              {t('noReports')}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
