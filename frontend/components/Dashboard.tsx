'use client';

import Link from 'next/link';

import {
  getGenreColor,
} from '@/utils/genreColors';

import type {
  DashboardStatsDto,
} from '@/types';

interface DashboardProps {
  stats: DashboardStatsDto;
}

const tierColors: Record<string, string> = {
  Platinum: 'bg-blue-300',
  Gold: 'bg-yellow-400',
  Silver: 'bg-gray-300',
  Bronze: 'bg-orange-500',
  Borked: 'bg-red-600',
  Pending: 'bg-gray-600',
};

const tierBadgeColors: Record<
  string,
  string
> = {
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
    'bg-gray-600 text-gray-200',
};

export default function Dashboard({
  stats,
}: DashboardProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const largestGenre =
    Math.max(
      ...stats.genreDistribution.map(
        (genre) => genre.count
      ),
      1
    );

  const largestTier =
    Math.max(
      ...stats.tierDistribution.map(
        (tier) => tier.count
      ),
      1
    );

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="theme-primary-text text-4xl font-bold">
            Dashboard
          </h1>

          <p className="theme-secondary-text mt-2">
            Compatibility and community
            statistics across ProtonDB Clone.
          </p>
        </div>

        {/* SUMMARY */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Games"
            value={stats.totalGames}
          />

          <StatCard
            title="Reports"
            value={stats.totalReports}
          />

          <StatCard
            title="Users"
            value={stats.totalUsers}
          />

          <StatCard
            title="Reports / Game"
            value={
              stats.averageReportsPerGame
                .toFixed(1)
            }
          />
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* TIER DISTRIBUTION */}
          <section className="theme-surface rounded-xl border p-6">
            <h2 className="theme-primary-text text-2xl font-bold">
              Compatibility Overview
            </h2>

            <p className="theme-secondary-text mt-1 text-sm">
              Overall compatibility tiers
              across the game catalogue.
            </p>

            <div className="mt-6 space-y-4">
              {stats.tierDistribution.map(
                (tier) => {
                  const percentage =
                    stats.totalGames === 0
                      ? 0
                      : (
                          (tier.count /
                            stats.totalGames) *
                          100
                        );

                  return (
                    <div
                      key={tier.tier}
                    >
                      <div className="mb-1 flex items-center justify-between gap-4">
                        <span
                          className={`rounded px-2 py-1 text-xs font-bold ${
                            tierBadgeColors[
                              tier.tier
                            ] ??
                            tierBadgeColors.Pending
                          }`}
                        >
                          {tier.tier}
                        </span>

                        <span className="theme-secondary-text text-sm">
                          {tier.count}{' '}
                          (
                          {percentage.toFixed(
                            1
                          )}
                          %)
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-black/20">
                        <div
                          className={`h-full rounded-full ${
                            tierColors[
                              tier.tier
                            ] ??
                            tierColors.Pending
                          }`}
                          style={{
                            width: `${
                              (tier.count /
                                largestTier) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>

          {/* GENRES */}
          <section className="theme-surface rounded-xl border p-6">
            <h2 className="theme-primary-text text-2xl font-bold">
              Games by Genre
            </h2>

            <p className="theme-secondary-text mt-1 text-sm">
              Number of catalogue games
              belonging to each genre.
            </p>

            <div className="mt-6 max-h-96 space-y-4 overflow-y-auto pr-2">
              {stats.genreDistribution.map(
                (genre) => (
                  <div key={genre.genre}>
                    <div className="mb-1 flex justify-between gap-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${getGenreColor(
                          genre.genre
                        )}`}
                      >
                        {genre.genre}
                      </span>

                      <span className="theme-secondary-text text-sm">
                        {genre.count}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-black/20">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{
                          width: `${
                            (genre.count /
                              largestGenre) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        </div>

        {/* COMPATIBILITY PER GENRE */}
        <section className="theme-surface mt-8 rounded-xl border p-6">
          <h2 className="theme-primary-text text-2xl font-bold">
            Compatibility by Genre
          </h2>

          <p className="theme-secondary-text mt-1 text-sm">
            Compatibility tier distribution
            within each genre.
          </p>

          <div className="mt-6 space-y-5">
            {stats.compatibilityByGenre.map(
              (genre) => {
                const total =
                  genre.platinum +
                  genre.gold +
                  genre.silver +
                  genre.bronze +
                  genre.borked +
                  genre.pending;

                if (total === 0) {
                  return null;
                }

                return (
                  <div
                    key={genre.genre}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${getGenreColor(
                          genre.genre
                        )}`}
                      >
                        {genre.genre}
                      </span>

                      <span className="theme-secondary-text text-sm">
                        {total} games
                      </span>
                    </div>

                    <div className="flex h-5 overflow-hidden rounded-full bg-black/20">
                      <TierSegment
                        count={
                          genre.platinum
                        }
                        total={total}
                        className="bg-blue-300"
                        title="Platinum"
                      />

                      <TierSegment
                        count={
                          genre.gold
                        }
                        total={total}
                        className="bg-yellow-400"
                        title="Gold"
                      />

                      <TierSegment
                        count={
                          genre.silver
                        }
                        total={total}
                        className="bg-gray-300"
                        title="Silver"
                      />

                      <TierSegment
                        count={
                          genre.bronze
                        }
                        total={total}
                        className="bg-orange-500"
                        title="Bronze"
                      />

                      <TierSegment
                        count={
                          genre.borked
                        }
                        total={total}
                        className="bg-red-600"
                        title="Borked"
                      />

                      <TierSegment
                        count={
                          genre.pending
                        }
                        total={total}
                        className="bg-gray-600"
                        title="Pending"
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div className="theme-secondary-text mt-6 flex flex-wrap gap-4 text-xs">
            <Legend
              className="bg-blue-300"
              label="Platinum"
            />

            <Legend
              className="bg-yellow-400"
              label="Gold"
            />

            <Legend
              className="bg-gray-300"
              label="Silver"
            />

            <Legend
              className="bg-orange-500"
              label="Bronze"
            />

            <Legend
              className="bg-red-600"
              label="Borked"
            />

            <Legend
              className="bg-gray-600"
              label="Pending"
            />
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* MOST REPORTED */}
          <section className="theme-surface rounded-xl border p-6">
            <h2 className="theme-primary-text text-2xl font-bold">
              Most Reported Games
            </h2>

            <div className="mt-5 space-y-3">
              {stats.mostReportedGames.length ===
              0 ? (
                <p className="theme-secondary-text">
                  No reports yet.
                </p>
              ) : (
                stats.mostReportedGames.map(
                  (game, index) => (
                    <Link
                      key={game.gameId}
                      href={`/games/${game.steamAppid}`}
                      className="theme-surface-secondary flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-[var(--surface-hover)]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="theme-secondary-text w-6 font-bold">
                          {index + 1}.
                        </span>

                        <div>
                          <p className="theme-primary-text font-semibold">
                            {
                              game.gameName
                            }
                          </p>

                          <p className="theme-secondary-text text-xs">
                            Steam App ID:{' '}
                            {
                              game.steamAppid
                            }
                          </p>
                        </div>
                      </div>

                      <span className="theme-primary-text font-bold">
                        {
                          game.reportCount
                        }
                      </span>
                    </Link>
                  )
                )
              )}
            </div>
          </section>

          {/* CONTRIBUTORS */}
          <section className="theme-surface rounded-xl border p-6">
            <h2 className="theme-primary-text text-2xl font-bold">
              Top Contributors
            </h2>

            <div className="mt-5 space-y-3">
              {stats.topContributors.length ===
              0 ? (
                <p className="theme-secondary-text">
                  No contributors yet.
                </p>
              ) : (
                stats.topContributors.map(
                  (
                    contributor,
                    index
                  ) => (
                    <Link
                      key={
                        contributor.userId
                      }
                      href={`/users/${contributor.userId}`}
                      className="theme-surface-secondary flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-[var(--surface-hover)]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="theme-secondary-text w-6 font-bold">
                          {index + 1}.
                        </span>

                        <img
                          src={
                            contributor.avatarUrl ||
                            '/default-avatar.png'
                          }
                          alt={
                            contributor.username
                          }
                          className="h-10 w-10 rounded-full object-cover"
                        />

                        <span className="theme-primary-text font-semibold">
                          {
                            contributor.username
                          }
                        </span>
                      </div>

                      <span className="theme-secondary-text text-sm">
                        {
                          contributor.reportCount
                        }{' '}
                        reports
                      </span>
                    </Link>
                  )
                )
              )}
            </div>
          </section>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-xl font-bold text-white shadow-lg transition-transform hover:scale-110 hover:bg-[var(--accent-hover)]"
      >
        ↑
      </button>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="theme-surface rounded-xl border p-6">
      <p className="theme-secondary-text text-sm">
        {title}
      </p>

      <p className="theme-primary-text mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function TierSegment({
  count,
  total,
  className,
  title,
}: {
  count: number;
  total: number;
  className: string;
  title: string;
}) {
  if (count === 0) {
    return null;
  }

  const percentage =
    (count / total) * 100;

  return (
    <div
      className={className}
      style={{
        width: `${percentage}%`,
      }}
      title={`${title}: ${count} (${percentage.toFixed(
        1
      )}%)`}
    />
  );
}

function Legend({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-full ${className}`}
      />

      {label}
    </span>
  );
}