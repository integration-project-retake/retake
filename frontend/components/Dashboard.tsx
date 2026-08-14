'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
  getGenreColor,
} from '@/utils/genreColors';

import type {
  DashboardStatsDto,
} from '@/types';

interface DashboardProps {
  stats: DashboardStatsDto;
}

const DEFAULT_AVATAR =
  'https://www.gravatar.com/avatar/?d=mp';

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

const wheelColors = {
  Platinum: '#93c5fd',
  Gold: '#facc15',
  Silver: '#d1d5db',
  Bronze: '#f97316',
  Borked: '#dc2626',
  Pending: '#4b5563',
};

export default function Dashboard({
  stats,
}: DashboardProps) {
  const [selectedGenre, setSelectedGenre] =
    useState('Action');

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

  const availableGenres = useMemo(
    () =>
      stats.compatibilityByGenre.filter(
        (genre) =>
          genre.platinum +
            genre.gold +
            genre.silver +
            genre.bronze +
            genre.borked +
            genre.pending >
          0
      ),
    [stats.compatibilityByGenre]
  );

  const selectedGenreStats =
    availableGenres.find(
      (genre) =>
        genre.genre === selectedGenre
    ) ??
    availableGenres[0] ??
    null;

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
              stats.averageReportsPerGame.toFixed(
                1
              )
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
                      : (tier.count /
                          stats.totalGames) *
                        100;

                  return (
                    <div key={tier.tier}>
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

        {/* INTERACTIVE COMPATIBILITY BY GENRE */}
        <section className="theme-surface mt-8 rounded-xl border p-6">
          <div className="text-center">
            <h2 className="theme-primary-text text-2xl font-bold">
              Compatibility by Genre
            </h2>

            <p className="theme-secondary-text mt-1 text-sm">
              Select a genre to explore its
              compatibility distribution.
            </p>
          </div>

          {/* GENRE SELECTOR */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {availableGenres.map((genre) => {
              const isSelected =
                selectedGenreStats?.genre ===
                genre.genre;

              return (
                <button
                  key={genre.genre}
                  type="button"
                  onClick={() =>
                    setSelectedGenre(
                      genre.genre
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? `${getGenreColor(
                          genre.genre
                        )} scale-105 border-white/60 shadow-md`
                      : 'theme-surface-secondary theme-secondary-text border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {genre.genre}
                </button>
              );
            })}
          </div>

          {selectedGenreStats ? (
            <GenreCompatibilityWheel
              genre={selectedGenreStats}
            />
          ) : (
            <div className="theme-secondary-text py-16 text-center">
              No genre compatibility data
              available.
            </div>
          )}
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
                            DEFAULT_AVATAR
                          }
                          alt={
                            contributor.username
                          }
                          onError={(event) => {
                            if (
                              event.currentTarget
                                .src !==
                              DEFAULT_AVATAR
                            ) {
                              event.currentTarget.src =
                                DEFAULT_AVATAR;
                            }
                          }}
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
    </main>
  );
}

function GenreCompatibilityWheel({
  genre,
}: {
  genre: DashboardStatsDto['compatibilityByGenre'][number];
}) {
  const tiers = [
    {
      name: 'Platinum',
      count: genre.platinum,
      color: wheelColors.Platinum,
    },
    {
      name: 'Gold',
      count: genre.gold,
      color: wheelColors.Gold,
    },
    {
      name: 'Silver',
      count: genre.silver,
      color: wheelColors.Silver,
    },
    {
      name: 'Bronze',
      count: genre.bronze,
      color: wheelColors.Bronze,
    },
    {
      name: 'Borked',
      count: genre.borked,
      color: wheelColors.Borked,
    },
    {
      name: 'Pending',
      count: genre.pending,
      color: wheelColors.Pending,
    },
  ];

  const total = tiers.reduce(
    (sum, tier) => sum + tier.count,
    0
  );

  let currentAngle = 0;

  const gradientParts = tiers
    .filter((tier) => tier.count > 0)
    .map((tier) => {
      const start = currentAngle;

      const angle =
        total === 0
          ? 0
          : (tier.count / total) * 360;

      currentAngle += angle;

      return `${tier.color} ${start}deg ${currentAngle}deg`;
    });

  const wheelBackground =
    gradientParts.length > 0
      ? `conic-gradient(${gradientParts.join(
          ', '
        )})`
      : '#374151';

  return (
    <div className="mt-8">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
        {/* LEFT SIDE */}
        <div className="order-2 flex flex-col gap-3 lg:order-1">
          {tiers.slice(0, 3).map(
            (tier) => (
              <TierDetail
                key={tier.name}
                name={tier.name}
                count={tier.count}
                total={total}
                color={tier.color}
              />
            )
          )}
        </div>

        {/* WHEEL */}
        <div className="order-1 flex flex-col items-center lg:order-2">
          <div className="mb-5 text-center">
            <span
              className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${getGenreColor(
                genre.genre
              )}`}
            >
              {genre.genre}
            </span>

            <p className="theme-secondary-text mt-2 text-sm">
              {total}{' '}
              {total === 1
                ? 'game'
                : 'games'}
            </p>
          </div>

          <div className="relative h-64 w-64 sm:h-72 sm:w-72">
            <div
              className="absolute inset-0 rounded-full shadow-2xl transition-all duration-500"
              style={{
                background:
                  wheelBackground,
              }}
            />

            <div className="theme-surface absolute inset-[20%] flex flex-col items-center justify-center rounded-full border shadow-xl">
              <span className="theme-secondary-text text-xs font-semibold uppercase tracking-widest">
                Genre
              </span>

              <span className="theme-primary-text mt-1 max-w-[120px] text-center text-xl font-bold">
                {genre.genre}
              </span>

              <span className="theme-secondary-text mt-2 text-sm">
                {total}{' '}
                {total === 1
                  ? 'game'
                  : 'games'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="order-3 flex flex-col gap-3">
          {tiers.slice(3).map(
            (tier) => (
              <TierDetail
                key={tier.name}
                name={tier.name}
                count={tier.count}
                total={total}
                color={tier.color}
              />
            )
          )}
        </div>
      </div>

      {/* LEGEND */}
      <div className="theme-secondary-text mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs">
        {tiers.map((tier) => (
          <span
            key={tier.name}
            className="flex items-center gap-2"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor:
                  tier.color,
              }}
            />

            {tier.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function TierDetail({
  name,
  count,
  total,
  color,
}: {
  name: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage =
    total === 0
      ? 0
      : (count / total) * 100;

  return (
    <div className="theme-surface-secondary rounded-lg border p-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: color,
            }}
          />

          <span className="theme-primary-text text-sm font-semibold">
            {name}
          </span>
        </div>

        <span className="theme-secondary-text text-sm">
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="theme-secondary-text mt-1 text-xs">
        {count}{' '}
        {count === 1 ? 'game' : 'games'}
      </div>
    </div>
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