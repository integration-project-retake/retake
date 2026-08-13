'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { searchGames } from '@/services/gameService';
import { useLanguage } from '@/context/LanguageContext';
import { getGenreColor } from '@/utils/genreColors';
import { getGenreLabel } from '@/utils/genreLabels';
import { getTierLabel } from '@/utils/tierLabels';

import type { GameDto } from '@/types';

const tierColors: Record<string, string> = {
  Platinum: 'bg-blue-200 text-blue-900',
  Gold: 'bg-yellow-400 text-yellow-900',
  Silver: 'bg-gray-300 text-gray-900',
  Bronze: 'bg-orange-500 text-orange-950',
  Borked: 'bg-red-600 text-white',
  Pending: 'bg-gray-600 text-gray-300',
};

const tierOrder: Record<string, number> = {
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

type LayoutMode = 'grid' | 'list';

type SortMode =
  | 'default'
  | 'az'
  | 'za'
  | 'steamAsc'
  | 'steamDesc'
  | 'tierBest'
  | 'tierWorst';

type TierFilter =
  | 'all'
  | 'Platinum'
  | 'Gold'
  | 'Silver'
  | 'Bronze'
  | 'Borked'
  | 'Pending';

export default function GameSearch({
  initialGames,
}: GameSearchProps) {
  const { language, t } = useLanguage();

  const [query, setQuery] = useState('');
  const [games, setGames] = useState(initialGames);
  const [error, setError] = useState('');

  const [layout, setLayout] =
    useState<LayoutMode>('grid');

  const [sortMode, setSortMode] =
    useState<SortMode>('default');

  const [selectedGenre, setSelectedGenre] =
    useState('all');

  const [selectedTier, setSelectedTier] =
    useState<TierFilter>('all');

  const availableGenres = useMemo(() => {
    const genres = initialGames.flatMap(
      (game) => game.genres || []
    );

    return Array.from(new Set(genres)).sort(
      (a, b) =>
        getGenreLabel(a, language).localeCompare(
          getGenreLabel(b, language)
        )
    );
  }, [initialGames, language]);

  useEffect(() => {
    const savedLayout =
      localStorage.getItem('gameLayout');

    if (
      savedLayout === 'grid' ||
      savedLayout === 'list'
    ) {
      setLayout(savedLayout);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setGames(initialGames);
        setError('');
        return;
      }

      try {
        setError('');

        const results =
          await searchGames(query);

        setGames(results);
      } catch (error) {
        console.error(
          'Game search failed:',
          error
        );

        setError(t('searchError'));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, initialGames, t]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesGenre =
        selectedGenre === 'all' ||
        game.genres?.includes(selectedGenre);

      const matchesTier =
        selectedTier === 'all' ||
        (game.tier || 'Pending') ===
          selectedTier;

      return matchesGenre && matchesTier;
    });
  }, [
    games,
    selectedGenre,
    selectedTier,
  ]);

  const sortedGames = useMemo(() => {
    const copy = [...filteredGames];

    switch (sortMode) {
      case 'az':
        return copy.sort((a, b) =>
          a.name.localeCompare(
            b.name,
            language === 'es'
              ? 'es'
              : 'en',
            {
              sensitivity: 'base',
            }
          )
        );

      case 'za':
        return copy.sort((a, b) =>
          b.name.localeCompare(
            a.name,
            language === 'es'
              ? 'es'
              : 'en',
            {
              sensitivity: 'base',
            }
          )
        );

      case 'steamAsc':
        return copy.sort(
          (a, b) =>
            a.steamAppid -
            b.steamAppid
        );

      case 'steamDesc':
        return copy.sort(
          (a, b) =>
            b.steamAppid -
            a.steamAppid
        );

      case 'tierBest':
        return copy.sort(
          (a, b) =>
            tierOrder[
              b.tier || 'Pending'
            ] -
            tierOrder[
              a.tier || 'Pending'
            ]
        );

      case 'tierWorst':
        return copy.sort(
          (a, b) =>
            tierOrder[
              a.tier || 'Pending'
            ] -
            tierOrder[
              b.tier || 'Pending'
            ]
        );

      default:
        return copy;
    }
  }, [
    filteredGames,
    sortMode,
    language,
  ]);

  const handleLayoutChange = (
    newLayout: LayoutMode
  ) => {
    setLayout(newLayout);

    localStorage.setItem(
      'gameLayout',
      newLayout
    );
  };

  return (
    <div>
      {/* Search and filters */}
      <div className="mb-4 flex flex-col gap-2 xl:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder={t(
            'searchPlaceholder'
          )}
          className="theme-input w-full flex-1 rounded-lg border px-4 py-2 transition-colors focus:border-[var(--text-secondary)] focus:outline-none"
        />

        <div className="flex flex-wrap gap-2">
          {/* Genre filter */}
          <select
            value={selectedGenre}
            onChange={(event) =>
              setSelectedGenre(
                event.target.value
              )
            }
            className="theme-input cursor-pointer rounded-lg border px-4 py-2 transition-colors focus:border-[var(--text-secondary)] focus:outline-none"
            aria-label="Filter games by genre"
          >
            <option value="all">
              All Genres
            </option>

            {availableGenres.map(
              (genre) => (
                <option
                  key={genre}
                  value={genre}
                >
                  {getGenreLabel(
                    genre,
                    language
                  )}
                </option>
              )
            )}
          </select>

          {/* Tier filter */}
          <select
            value={selectedTier}
            onChange={(event) =>
              setSelectedTier(
                event.target
                  .value as TierFilter
              )
            }
            className="theme-input cursor-pointer rounded-lg border px-4 py-2 transition-colors focus:border-[var(--text-secondary)] focus:outline-none"
            aria-label="Filter games by compatibility tier"
          >
            <option value="all">
              All Tiers
            </option>

            <option value="Platinum">
              {t('platinum')}
            </option>

            <option value="Gold">
              {t('gold')}
            </option>

            <option value="Silver">
              {t('silver')}
            </option>

            <option value="Bronze">
              {t('bronze')}
            </option>

            <option value="Borked">
              {t('borked')}
            </option>

            <option value="Pending">
              {t('pending')}
            </option>
          </select>

          {/* Sort */}
          <select
            value={sortMode}
            onChange={(event) =>
              setSortMode(
                event.target
                  .value as SortMode
              )
            }
            className="theme-input cursor-pointer rounded-lg border px-4 py-2 transition-colors focus:border-[var(--text-secondary)] focus:outline-none"
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
              Steam App ID: Low → High
            </option>

            <option value="steamDesc">
              Steam App ID: High → Low
            </option>

            <option value="tierBest">
              Compatibility: Best → Worst
            </option>

            <option value="tierWorst">
              Compatibility: Worst → Best
            </option>
          </select>

          {/* Grid button */}
          <button
            type="button"
            onClick={() =>
              handleLayoutChange('grid')
            }
            className={`rounded-lg border px-4 py-2 font-medium transition-colors ${
              layout === 'grid'
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                : 'theme-input theme-border hover:bg-[var(--surface-hover)]'
            }`}
          >
            {t('grid')}
          </button>

          {/* List button */}
          <button
            type="button"
            onClick={() =>
              handleLayoutChange('list')
            }
            className={`rounded-lg border px-4 py-2 font-medium transition-colors ${
              layout === 'list'
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                : 'theme-input theme-border hover:bg-[var(--surface-hover)]'
            }`}
          >
            {t('list')}
          </button>
        </div>
      </div>

      {/* Search error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950 p-3 text-red-200">
          {error}
        </div>
      )}

      {/* Games */}
      <div
        className={
          layout === 'grid'
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col gap-4'
        }
      >
        {sortedGames.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.steamAppid}`}
            className={`theme-surface theme-border overflow-hidden rounded-lg border transition-colors hover:bg-[var(--surface-hover)] ${
              layout === 'list'
                ? 'flex flex-col sm:flex-row'
                : 'flex flex-col'
            }`}
          >
            {/* Game banner */}
            <img
              src={
                game.headerUrl ||
                `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppid}/header.jpg`
              }
              alt={game.name}
              className={
                layout === 'grid'
                  ? 'aspect-[460/215] w-full object-cover'
                  : 'aspect-[460/215] w-full object-cover sm:w-64'
              }
              loading="lazy"
            />

            {/* Game information */}
            <div className="flex flex-1 items-start justify-between p-4">
              <div className="min-w-0">
                <h2 className="theme-primary-text text-lg font-semibold">
                  {game.name}
                </h2>

                <p className="theme-secondary-text mt-1 text-sm">
                  {t('steamAppId')}:{' '}
                  {game.steamAppid}
                </p>

                {/* Genres */}
                {game.genres?.length >
                  0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {game.genres.map(
                      (genre) => (
                        <span
                          key={genre}
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

              {/* Compatibility tier */}
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
        ))}

        {/* No results */}
        {sortedGames.length === 0 &&
          !error && (
            <div className="theme-surface theme-border theme-secondary-text rounded-lg border p-4 text-center">
              {selectedGenre !==
                'all' ||
              selectedTier !== 'all'
                ? 'No games match the selected filters.'
                : t('noGames')}
            </div>
          )}
      </div>
    </div>
  );
}