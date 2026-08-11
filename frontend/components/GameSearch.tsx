'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import Link from 'next/link';

import {
  searchGames,
} from '@/services/gameService';

import {
  useLanguage,
} from '@/context/LanguageContext';

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

const tierOrder:
  Record<string, number> = {
    Platinum: 5,
    Gold: 4,
    Silver: 3,
    Bronze: 2,
    Borked: 1,
    Pending: 0,
  };

interface GameSearchProps {
  initialGames: GameDto[];
}

type LayoutMode =
  'grid' | 'list';

type SortMode =
  | 'default'
  | 'az'
  | 'za'
  | 'steamAsc'
  | 'steamDesc'
  | 'tierBest'
  | 'tierWorst';

export default function GameSearch({
  initialGames,
}: GameSearchProps) {
  const {
    language,
    t,
  } = useLanguage();

  const [
    query,
    setQuery,
  ] = useState('');

  const [
    games,
    setGames,
  ] = useState(
    initialGames
  );

  const [
    error,
    setError,
  ] = useState('');

  const [
    layout,
    setLayout,
  ] = useState<LayoutMode>(
    'grid'
  );

  const [
    sortMode,
    setSortMode,
  ] = useState<SortMode>(
    'default'
  );

  const [
    selectedGenre,
    setSelectedGenre,
  ] = useState('all');

  const availableGenres =
    useMemo(() => {
      const genres =
        initialGames.flatMap(
          (game) =>
            game.genres || []
        );

      return Array.from(
        new Set(genres)
      ).sort((first, second) =>
        getGenreLabel(
          first,
          language
        ).localeCompare(
          getGenreLabel(
            second,
            language
          )
        )
      );
    }, [
      initialGames,
      language,
    ]);

  useEffect(() => {
    const savedLayout =
      localStorage.getItem(
        'gameLayout'
      );

    if (
      savedLayout === 'grid' ||
      savedLayout === 'list'
    ) {
      setLayout(
        savedLayout
      );
    }
  }, []);

  useEffect(() => {
    const timer =
      setTimeout(
        async () => {
          if (
            !query.trim()
          ) {
            setGames(
              initialGames
            );

            setError('');

            return;
          }

          try {
            setError('');

            const results =
              await searchGames(
                query
              );

            setGames(
              results
            );
          } catch (
            error
          ) {
            console.error(
              'Game search failed:',
              error
            );

            setError(
              t(
                'searchError'
              )
            );
          }
        },
        300
      );

    return () =>
      clearTimeout(
        timer
      );
  }, [
    query,
    initialGames,
    t,
  ]);

  const filteredGames =
    useMemo(() => {
      if (
        selectedGenre ===
        'all'
      ) {
        return games;
      }

      return games.filter(
        (game) =>
          game.genres?.includes(
            selectedGenre
          )
      );
    }, [
      games,
      selectedGenre,
    ]);

  const sortedGames =
    useMemo(() => {
      const copy =
        [...filteredGames];

      switch (
        sortMode
      ) {
        case 'az':
          return copy.sort(
            (
              first,
              second
            ) =>
              first.name.localeCompare(
                second.name,
                language === 'es'
                  ? 'es'
                  : 'en',
                {
                  sensitivity:
                    'base',
                }
              )
          );

        case 'za':
          return copy.sort(
            (
              first,
              second
            ) =>
              second.name.localeCompare(
                first.name,
                language === 'es'
                  ? 'es'
                  : 'en',
                {
                  sensitivity:
                    'base',
                }
              )
          );

        case 'steamAsc':
          return copy.sort(
            (
              first,
              second
            ) =>
              first.steamAppid -
              second.steamAppid
          );

        case 'steamDesc':
          return copy.sort(
            (
              first,
              second
            ) =>
              second.steamAppid -
              first.steamAppid
          );

        case 'tierBest':
          return copy.sort(
            (
              first,
              second
            ) =>
              tierOrder[
                second.tier ||
                  'Pending'
              ] -
              tierOrder[
                first.tier ||
                  'Pending'
              ]
          );

        case 'tierWorst':
          return copy.sort(
            (
              first,
              second
            ) =>
              tierOrder[
                first.tier ||
                  'Pending'
              ] -
              tierOrder[
                second.tier ||
                  'Pending'
              ]
          );

        case 'default':
        default:
          return copy;
      }
    }, [
      filteredGames,
      sortMode,
      language,
    ]);

  const handleLayoutChange = (
    newLayout:
      LayoutMode
  ) => {
    setLayout(
      newLayout
    );

    localStorage.setItem(
      'gameLayout',
      newLayout
    );
  };

  const handleSortChange = (
    newSort:
      SortMode
  ) => {
    setSortMode(
      newSort
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 lg:flex-row">
        <input
          type="search"
          value={query}
          onChange={(
            event
          ) =>
            setQuery(
              event.target
                .value
            )
          }
          placeholder={t(
            'searchPlaceholder'
          )}
          className="w-full flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
        />

        <div className="flex flex-wrap gap-2">
          <select
            value={
              selectedGenre
            }
            onChange={(
              event
            ) =>
              setSelectedGenre(
                event.target
                  .value
              )
            }
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:border-gray-500 focus:outline-none"
            aria-label="Filter games by genre"
          >
            <option value="all">
              All Genres
            </option>

            {availableGenres.map(
              (genre) => (
                <option
                  key={
                    genre
                  }
                  value={
                    genre
                  }
                >
                  {getGenreLabel(
                    genre,
                    language
                  )}
                </option>
              )
            )}
          </select>

          <select
            value={sortMode}
            onChange={(
              event
            ) =>
              handleSortChange(
                event.target
                  .value as SortMode
              )
            }
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:border-gray-500 focus:outline-none"
            aria-label="Sort games"
          >
            <option value="default">
              Default
            </option>

            <option value="az">
              Name A–Z
            </option>

            <option value="za">
              Name Z–A
            </option>

            <option value="steamAsc">
              Steam App ID:
              Low → High
            </option>

            <option value="steamDesc">
              Steam App ID:
              High → Low
            </option>

            <option value="tierBest">
              Compatibility:
              Best → Worst
            </option>

            <option value="tierWorst">
              Compatibility:
              Worst → Best
            </option>
          </select>

          <button
            type="button"
            onClick={() =>
              handleLayoutChange(
                'grid'
              )
            }
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              layout ===
              'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {t('grid')}
          </button>

          <button
            type="button"
            onClick={() =>
              handleLayoutChange(
                'list'
              )
            }
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              layout ===
              'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {t('list')}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950 p-3 text-red-200">
          {error}
        </div>
      )}

      <div
        className={
          layout ===
          'grid'
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col gap-4'
        }
      >
        {sortedGames.map(
          (game) => (
            <Link
              key={
                game.id
              }
              href={`/games/${game.steamAppid}`}
              className={`overflow-hidden rounded-lg border border-gray-700 bg-gray-800 transition-colors hover:border-gray-500 ${
                layout ===
                'list'
                  ? 'flex flex-col sm:flex-row'
                  : 'flex flex-col'
              }`}
            >
              <img
                src={
                  game.headerUrl ||
                  `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppid}/header.jpg`
                }
                alt={
                  game.name
                }
                className={
                  layout ===
                  'grid'
                    ? 'aspect-[460/215] w-full object-cover'
                    : 'aspect-[460/215] w-full object-cover sm:w-64'
                }
                loading="lazy"
              />

              <div className="flex flex-1 items-start justify-between p-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">
                    {
                      game.name
                    }
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {t(
                      'steamAppId'
                    )}
                    :{' '}
                    {
                      game.steamAppid
                    }
                  </p>

                  {game
                    .genres
                    ?.length >
                    0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {game.genres.map(
                        (
                          genre
                        ) => (
                          <span
                            key={
                              genre
                            }
                            className={`rounded-full px-3 py-1 text-xs ${getGenreColor(
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

                <div
                  className={`ml-3 shrink-0 rounded px-2 py-1 text-xs font-bold ${
                    game.tier
                      ? tierColors[
                          game.tier
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
            </Link>
          )
        )}

        {sortedGames.length ===
          0 &&
          !error && (
            <div className="rounded-lg border border-gray-700 p-4 text-center text-gray-400">
              {selectedGenre !==
              'all'
                ? `No games found for ${getGenreLabel(
                    selectedGenre,
                    language
                  )}.`
                : t(
                    'noGames'
                  )}
            </div>
          )}
      </div>
    </div>
  );
}