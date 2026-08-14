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

const tierBadgeColors: Record<string, string> = {
  Platinum: 'bg-blue-200 text-blue-900',
  Gold: 'bg-yellow-400 text-yellow-900',
  Silver: 'bg-gray-300 text-gray-900',
  Bronze: 'bg-orange-500 text-orange-950',
  Borked: 'bg-red-600 text-white',
  Pending: 'bg-gray-600 text-gray-200',
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
      <div className="mx-auto max-w-[1500px]">
        {/* HEADER */}
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
            value={stats.averageReportsPerGame.toFixed(
              1
            )}
          />
        </section>

        {/* GAMES BY GENRE */}
        <section className="theme-surface rounded-xl border p-6 sm:p-8">
          <h2 className="theme-primary-text text-2xl font-bold">
            Games by Genre
          </h2>

          <p className="theme-secondary-text mt-1 text-sm">
            Number of catalogue games
            belonging to each genre.
          </p>

          <GenreBarChart
            genres={stats.genreDistribution}
          />
        </section>

        {/* COMPATIBILITY OVERVIEW */}
        <section className="theme-surface mt-8 rounded-xl border p-6 sm:p-8">
          <h2 className="theme-primary-text text-2xl font-bold">
            Compatibility Overview
          </h2>

          <p className="theme-secondary-text mt-1 text-sm">
            Overall compatibility tier
            distribution across the game catalogue.
          </p>

          <CompatibilityOverview
            tiers={stats.tierDistribution}
            totalGames={stats.totalGames}
          />
        </section>

        {/* COMPATIBILITY BY GENRE */}
        <section className="theme-surface mt-8 rounded-xl border p-6 sm:p-8">
          <div className="text-center">
            <h2 className="theme-primary-text text-2xl font-bold">
              Compatibility by Genre
            </h2>

            <p className="theme-secondary-text mt-1 text-sm">
              Select a genre to explore its
              compatibility distribution.
            </p>
          </div>

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

        {/* BOTTOM STATISTICS */}
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
                      className="group relative flex min-h-[110px] items-center justify-between overflow-hidden rounded-lg border border-white/15 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30"
                    >
                      <img
                        src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.steamAppid}/header.jpg`}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/65 transition-colors duration-300 group-hover:bg-black/55" />

                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/70" />

                      <div className="relative z-10 flex w-full items-center justify-between p-5">
                        <div className="flex items-center gap-4">
                          <span className="w-7 text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                            {index + 1}.
                          </span>

                          <div>
                            <p className="text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                              {game.gameName}
                            </p>

                            <p className="mt-0.5 text-sm text-gray-200 drop-shadow-[0_2px_3px_rgba(0,0,0,1)]">
                              Steam App ID:{' '}
                              {game.steamAppid}
                            </p>
                          </div>
                        </div>

                        <span className="text-xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                          {game.reportCount}
                        </span>
                      </div>
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
                              event
                                .currentTarget
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

/* =========================================================
   COMPATIBILITY OVERVIEW
   ========================================================= */

function CompatibilityOverview({
  tiers,
  totalGames,
}: {
  tiers: DashboardStatsDto['tierDistribution'];
  totalGames: number;
}) {
  const orderedTiers = [
    'Platinum',
    'Gold',
    'Silver',
    'Bronze',
    'Borked',
    'Pending',
  ];

  const sortedTiers = orderedTiers.map(
    (tierName) => {
      const existing = tiers.find(
        (tier) => tier.tier === tierName
      );

      return {
        tier: tierName,
        count: existing?.count ?? 0,
      };
    }
  );

  return (
    <div className="mt-8">
      {/* SINGLE STACKED DISTRIBUTION BAR */}
      <div className="overflow-hidden rounded-full border border-white/10 bg-black/20">
        <div className="flex h-8 w-full">
          {sortedTiers.map((tier) => {
            const percentage =
              totalGames === 0
                ? 0
                : (tier.count /
                    totalGames) *
                  100;

            if (percentage === 0) {
              return null;
            }

            return (
              <div
                key={tier.tier}
                className={`${tierColors[tier.tier]} relative h-full transition-all duration-300 hover:brightness-110`}
                style={{
                  width: `${percentage}%`,
                }}
                title={`${tier.tier}: ${tier.count} games (${percentage.toFixed(
                  1
                )}%)`}
              >
                {percentage >= 8 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-black/75">
                    {percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TIER CARDS */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {sortedTiers.map((tier) => {
          const percentage =
            totalGames === 0
              ? 0
              : (tier.count /
                  totalGames) *
                100;

          return (
            <div
              key={tier.tier}
              className="theme-surface-secondary rounded-xl border p-4 text-center transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex justify-center">
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                    tierBadgeColors[
                      tier.tier
                    ] ??
                    tierBadgeColors.Pending
                  }`}
                >
                  {tier.tier}
                </span>
              </div>

              <p className="theme-primary-text mt-4 text-3xl font-bold">
                {tier.count}
              </p>

              <p className="theme-secondary-text mt-1 text-sm">
                {tier.count === 1
                  ? 'game'
                  : 'games'}
              </p>

              <div className="mt-3 border-t border-white/10 pt-3">
                <span className="theme-secondary-text text-sm font-semibold">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   GAMES BY GENRE BAR CHART
   ========================================================= */

function GenreBarChart({
  genres,
}: {
  genres: DashboardStatsDto['genreDistribution'];
}) {
  const maximumCount = Math.max(
    ...genres.map(
      (genre) => genre.count
    ),
    1
  );

  const stepSize =
    maximumCount <= 10
      ? 2
      : maximumCount <= 25
        ? 5
        : maximumCount <= 50
          ? 10
          : Math.ceil(
              maximumCount / 5 / 10
            ) * 10;

  const chartMaximum =
    Math.ceil(
      maximumCount / stepSize
    ) * stepSize;

  const ticks = Array.from(
    {
      length:
        chartMaximum / stepSize + 1,
    },
    (_, index) =>
      chartMaximum -
      index * stepSize
  );

  const plotHeight = 350;
  const topSpace = 34;
  const barAreaHeight =
    plotHeight - topSpace;

  return (
    <div className="mt-8 w-full">
      <div className="flex w-full">
        {/* Y AXIS */}
        <div
          className="relative w-14 shrink-0"
          style={{
            height: plotHeight,
          }}
        >
          <div className="theme-secondary-text absolute -left-5 top-[55%] -translate-y-1/2 -rotate-90 whitespace-nowrap text-xs font-medium">
            Number of games
          </div>

          <div
            className="absolute bottom-0 right-0 border-r border-white/30"
            style={{
              top: `${topSpace}px`,
            }}
          />

          {ticks.map(
            (tick, index) => {
              const y =
                topSpace +
                (index /
                  (ticks.length -
                    1)) *
                  barAreaHeight;

              return (
                <span
                  key={tick}
                  className="theme-secondary-text absolute right-3 text-xs"
                  style={{
                    top: `${y}px`,
                    transform:
                      'translateY(-50%)',
                  }}
                >
                  {tick}
                </span>
              );
            }
          )}
        </div>

        {/* GRAPH + LABELS */}
        <div className="min-w-0 flex-1">
          <div
            className="relative w-full"
            style={{
              height: plotHeight,
            }}
          >
            {/* GRID */}
            {ticks.map(
              (tick, index) => {
                const y =
                  topSpace +
                  (index /
                    (ticks.length -
                      1)) *
                    barAreaHeight;

                return (
                  <div
                    key={tick}
                    className="absolute left-0 right-0 border-t border-white/10"
                    style={{
                      top: `${y}px`,
                    }}
                  />
                );
              }
            )}

            {/* BARS */}
            <div
              className="absolute inset-x-0 bottom-0 grid px-2"
              style={{
                top: `${topSpace}px`,
                gridTemplateColumns: `repeat(${genres.length}, minmax(0, 1fr))`,
              }}
            >
              {genres.map((genre) => {
                const barHeight =
                  chartMaximum === 0
                    ? 0
                    : (genre.count /
                        chartMaximum) *
                      barAreaHeight;

                return (
                  <div
                    key={genre.genre}
                    className="relative min-w-0"
                  >
                    <span
                      className="theme-primary-text absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold sm:text-sm"
                      style={{
                        bottom: `${
                          barHeight + 7
                        }px`,
                      }}
                    >
                      {genre.count}
                    </span>

                    <div
                      className={`absolute bottom-0 left-1/2 w-[55%] max-w-14 -translate-x-1/2 rounded-t-md transition-all duration-300 hover:brightness-110 ${getGenreColor(
                        genre.genre
                      )}`}
                      style={{
                        height: `${barHeight}px`,
                        minHeight:
                          genre.count > 0
                            ? '4px'
                            : '0px',
                      }}
                      title={`${genre.genre}: ${genre.count} games`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* BASELINE */}
          <div className="border-t border-white/30" />

          {/* GENRE LABELS */}
          <div
            className="grid px-2"
            style={{
              gridTemplateColumns: `repeat(${genres.length}, minmax(0, 1fr))`,
            }}
          >
            {genres.map((genre) => (
              <div
                key={genre.genre}
                className="flex min-w-0 items-start justify-center px-1 pt-3"
              >
                <span
                  className="theme-secondary-text block w-full text-center text-[9px] font-medium leading-[1.15] sm:text-[10px] lg:text-[11px]"
                  title={genre.genre}
                >
                  {genre.genre}
                </span>
              </div>
            ))}
          </div>

          <div className="theme-secondary-text mt-7 text-center text-xs font-medium">
            Genre
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   GENRE COMPATIBILITY WHEEL
   ========================================================= */

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
    (sum, tier) =>
      sum + tier.count,
    0
  );

  let currentAngle = 0;

  const gradientParts = tiers
    .filter(
      (tier) => tier.count > 0
    )
    .map((tier) => {
      const start =
        currentAngle;

      const angle =
        total === 0
          ? 0
          : (tier.count /
              total) *
            360;

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
        {/* LEFT */}
        <div className="order-2 flex flex-col gap-3 lg:order-1">
          {tiers
            .slice(0, 3)
            .map((tier) => (
              <TierDetail
                key={tier.name}
                name={tier.name}
                count={tier.count}
                total={total}
                color={tier.color}
              />
            ))}
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

        {/* RIGHT */}
        <div className="order-3 flex flex-col gap-3">
          {tiers
            .slice(3)
            .map((tier) => (
              <TierDetail
                key={tier.name}
                name={tier.name}
                count={tier.count}
                total={total}
                color={tier.color}
              />
            ))}
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
      : (count /
          total) *
        100;

  return (
    <div className="theme-surface-secondary rounded-lg border p-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor:
                color,
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
        {count === 1
          ? 'game'
          : 'games'}
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