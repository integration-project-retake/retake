'use client';

import Link from 'next/link';

import {
  useLanguage,
} from '@/context/LanguageContext';

import SubmitReportForm from '@/components/SubmitReportForm';

import {
  getGenreColor,
} from '@/utils/genreColors';

import {
  getGenreLabel,
} from '@/utils/genreLabels';

import {
  getTierLabel,
} from '@/utils/tierLabels';

import type {
  ReportDto,
  GameDto,
} from '@/types';

const tierColors:
  Record<string, string> = {
    Platinum:
      'bg-blue-200 text-blue-900',
    Gold:
      'bg-yellow-400 text-yellow-900',
    Silver:
      'bg-gray-300 text-gray-900',
    Bronze:
      'bg-orange-500 text-orange-950',
    Borked:
      'bg-red-600 text-white',
    Pending:
      'bg-gray-600 text-gray-300',
  };

interface GameReportsProps {
  game: GameDto;
  reports: ReportDto[];
  relatedGames:
    GameDto[];
}

export default function GameReports({
  game,
  reports,
  relatedGames,
}: GameReportsProps) {
  const {
    language,
    t,
  } = useLanguage();

  const dateLocale =
    language === 'es'
      ? 'es-ES'
      : 'en-GB';

  const relatedGamesTitle =
    language === 'es'
      ? 'Juegos relacionados'
      : 'Related Games';

  const noRelatedGames =
    language === 'es'
      ? 'No se encontraron juegos relacionados.'
      : 'No related games found.';

  const genresLabel =
    language === 'es'
      ? 'Géneros'
      : 'Genres';

  const gameHeaderUrl =
    game.headerUrl ||
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppid}/header.jpg`;

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Main game card */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
          <img
            src={
              gameHeaderUrl
            }
            alt={`${game.name} banner`}
            className="aspect-[460/215] w-full object-cover"
          />

          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                {
                  game.name
                }
              </h1>

              <p className="mt-2 text-gray-400">
                {t(
                  'steamAppId'
                )}
                :{' '}
                {
                  game.steamAppid
                }
              </p>

              {game.genres &&
                game
                  .genres
                  .length >
                  0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm text-gray-400">
                      {
                        genresLabel
                      }
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {game.genres.map(
                        (
                          genre
                        ) => (
                          <span
                            key={
                              genre
                            }
                            className={`rounded-full px-3 py-1 text-sm ${getGenreColor(
                              genre
                            )}`}
                          >
                            {getGenreLabel(
                              genre,
                              language
                            )}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div
              className={`shrink-0 rounded px-4 py-2 text-lg font-bold ${
                game.tier
                  ? tierColors[
                      game
                        .tier
                    ]
                  : tierColors.Pending
              }`}
            >
              {getTierLabel(
                game.tier ||
                  'Pending',
                t
              )}
            </div>
          </div>
        </div>

        {/* Report submission */}
        <div className="mb-8">
          <SubmitReportForm
            gameId={
              game.id
            }
          />
        </div>

        {/* Reports */}
        <h2 className="mb-4 text-2xl font-bold">
          {t(
            'reports'
          )}
        </h2>

        <div className="mb-12 flex flex-col gap-4">
          {reports.map(
            (
              report
            ) => (
              <div
                key={
                  report.id
                }
                className="flex flex-col gap-2 rounded-lg border border-gray-700 bg-gray-800 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-gray-400">
                    <Link
                      href={`/users/${report.user_id}`}
                      className="font-bold underline transition-colors hover:text-pink-600"
                    >
                      {
                        report.username
                      }
                    </Link>

                    {' '}
                    •{' '}
                    {
                      report.distribution
                    }{' '}
                    •{' '}

                    {report.protonVersion
                      ? `Proton ${report.protonVersion} • `
                      : ''}

                    {new Date(
                      report.createdAt
                    ).toLocaleDateString(
                      dateLocale
                    )}
                  </p>

                  <div
                    className={`rounded px-4 py-1.5 font-bold ${
                      tierColors[
                        report
                          .tier
                      ]
                    }`}
                  >
                    {getTierLabel(
                      report.tier,
                      t
                    )}
                  </div>
                </div>

                {report.comment && (
                  <div className="mt-2 whitespace-pre-line rounded bg-gray-900 p-3 text-sm text-gray-300">
                    {
                      report.comment
                    }
                  </div>
                )}
              </div>
            )
          )}

          {reports.length ===
            0 && (
            <div className="rounded-lg border border-gray-700 p-4 text-center text-gray-400">
              {t(
                'noReports'
              )}
            </div>
          )}
        </div>

        {/* Related games */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">
            {
              relatedGamesTitle
            }
          </h2>

          {relatedGames.length >
          0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedGames.map(
                (
                  relatedGame
                ) => (
                  <Link
                    key={
                      relatedGame.id
                    }
                    href={`/games/${relatedGame.steamAppid}`}
                    className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 transition-colors hover:border-gray-500"
                  >
                    <img
                      src={
                        relatedGame.headerUrl ||
                        `https://cdn.cloudflare.steamstatic.com/steam/apps/${relatedGame.steamAppid}/header.jpg`
                      }
                      alt={
                        relatedGame.name
                      }
                      className="aspect-[460/215] w-full object-cover"
                      loading="lazy"
                    />

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">
                            {
                              relatedGame.name
                            }
                          </h3>

                          <p className="mt-1 text-sm text-gray-400">
                            {t(
                              'steamAppId'
                            )}
                            :{' '}
                            {
                              relatedGame.steamAppid
                            }
                          </p>
                        </div>

                        <div
                          className={`shrink-0 rounded px-2 py-1 text-xs font-bold ${
                            relatedGame.tier
                              ? tierColors[
                                  relatedGame
                                    .tier
                                ]
                              : tierColors.Pending
                          }`}
                        >
                          {getTierLabel(
                            relatedGame.tier ||
                              'Pending',
                            t
                          )}
                        </div>
                      </div>

                      {relatedGame.genres &&
                        relatedGame
                          .genres
                          .length >
                          0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {relatedGame.genres.map(
                              (
                                genre
                              ) => (
                                <span
                                  key={
                                    genre
                                  }
                                  className={`rounded-full px-2 py-1 text-xs ${getGenreColor(
                                    genre
                                  )}`}
                                >
                                  {getGenreLabel(
                                    genre,
                                    language
                                  )}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </Link>
                )
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-700 p-4 text-center text-gray-400">
              {
                noRelatedGames
              }
            </div>
          )}
        </section>
      </div>
    </main>
  );
}