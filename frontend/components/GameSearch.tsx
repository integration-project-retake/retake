'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Link from 'next/link';

import {
  fetchPlayerCount,
  searchGames,
} from '@/services/gameService';

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

type LayoutMode =
  | 'grid'
  | 'list';

type TierFilter =
  | 'Platinum'
  | 'Gold'
  | 'Silver'
  | 'Bronze'
  | 'Borked'
  | 'Pending';

type NameSort =
  | 'az'
  | 'za'
  | null;

type SteamSort =
  | 'steamAsc'
  | 'steamDesc'
  | null;

type TierSort =
  | 'tierBest'
  | 'tierWorst'
  | null;

type PlayerSort =
  | 'playersHigh'
  | 'playersLow'
  | null;

type FilterPanel =
  | 'genres'
  | 'tiers'
  | 'ordering'
  | null;

const allTiers: TierFilter[] = [
  'Platinum',
  'Gold',
  'Silver',
  'Bronze',
  'Borked',
  'Pending',
];

const GAMES_PER_PAGE = 12;

const PLAYER_COUNT_REFRESH_MS =
  60_000;

export default function GameSearch({
  initialGames,
}: GameSearchProps) {
  const {
    language,
    locale,
    t,
  } = useLanguage();

  const [
    query,
    setQuery,
  ] = useState('');

  const [
    games,
    setGames,
  ] = useState(initialGames);

  const [
    error,
    setError,
  ] = useState('');

  const [
    layout,
    setLayout,
  ] = useState<LayoutMode>('grid');

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    selectedGenres,
    setSelectedGenres,
  ] = useState<string[]>([]);

  const [
    selectedTiers,
    setSelectedTiers,
  ] = useState<TierFilter[]>([]);

  const [
    nameSort,
    setNameSort,
  ] = useState<NameSort>(null);

  const [
    steamSort,
    setSteamSort,
  ] = useState<SteamSort>(null);

  const [
    tierSort,
    setTierSort,
  ] = useState<TierSort>(null);

  const [
    playerSort,
    setPlayerSort,
  ] = useState<PlayerSort>(null);

  const [
    playerCounts,
    setPlayerCounts,
  ] = useState<
    Record<number, number | null>
  >({});

  const [
    playerCountsLoading,
    setPlayerCountsLoading,
  ] = useState(false);

  const [
    activePanel,
    setActivePanel,
  ] = useState<FilterPanel>(null);

  const panelRef =
    useRef<HTMLDivElement>(null);

  const availableGenres =
    useMemo(() => {
      const genres =
        initialGames.flatMap(
          (game) =>
            game.genres || []
        );

      return Array.from(
        new Set(genres)
      ).sort((a, b) =>
        getGenreLabel(
          a,
          language
        ).localeCompare(
          getGenreLabel(
            b,
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
      savedLayout ===
        'grid' ||
      savedLayout ===
        'list'
    ) {
      setLayout(savedLayout);
    }
  }, []);

  useEffect(() => {
    if (!activePanel) {
      return;
    }

    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      const target =
        event.target as HTMLElement;

      if (
        target.closest(
          '[data-filter-control]'
        )
      ) {
        return;
      }

      if (
        panelRef.current?.contains(
          target
        )
      ) {
        return;
      }

      setActivePanel(null);
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, [activePanel]);

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

            setGames(results);
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
      clearTimeout(timer);
  }, [
    query,
    initialGames,
    t,
  ]);

  const togglePanel = (
    panel: Exclude<
      FilterPanel,
      null
    >
  ) => {
    setActivePanel(
      (current) =>
        current === panel
          ? null
          : panel
    );
  };

  const toggleGenre = (
    genre: string
  ) => {
    setSelectedGenres(
      (current) =>
        current.includes(
          genre
        )
          ? current.filter(
              (item) =>
                item !==
                genre
            )
          : [
              ...current,
              genre,
            ]
    );
  };

  const toggleTier = (
    tier: TierFilter
  ) => {
    setSelectedTiers(
      (current) =>
        current.includes(
          tier
        )
          ? current.filter(
              (item) =>
                item !==
                tier
            )
          : [
              ...current,
              tier,
            ]
    );
  };

  const filteredGames =
    useMemo(() => {
      return games.filter(
        (game) => {
          /*
           * OR inside the genre group:
           * Adventure OR RPG
           */
          const matchesGenre =
            selectedGenres.length ===
              0 ||
            selectedGenres.some(
              (genre) =>
                game.genres?.includes(
                  genre
                )
            );

          const gameTier =
            (game.tier ||
              'Pending') as TierFilter;

          /*
           * OR inside the tier group:
           * Gold OR Platinum
           */
          const matchesTier =
            selectedTiers.length ===
              0 ||
            selectedTiers.includes(
              gameTier
            );

          /*
           * AND between filter groups
           */
          return (
            matchesGenre &&
            matchesTier
          );
        }
      );
    }, [
      games,
      selectedGenres,
      selectedTiers,
    ]);

  /*
   * Fetch current Steam player counts only
   * when live-player ordering is active.
   *
   * The complete filtered result set is
   * fetched BEFORE pagination, so a game
   * currently on page 4 can correctly move
   * to page 1 when it has more players.
   *
   * Counts refresh every 60 seconds.
   */
  useEffect(() => {
    if (!playerSort) {
      return;
    }

    let cancelled =
      false;

    let requestRunning =
      false;

    const loadPlayerCounts =
      async () => {
        if (
          requestRunning
        ) {
          return;
        }

        requestRunning =
          true;

        if (!cancelled) {
          setPlayerCountsLoading(
            true
          );
        }

        try {
          const entries =
            await Promise.all(
              filteredGames.map(
                async (
                  game
                ) => {
                  const count =
                    await fetchPlayerCount(
                      game.steamAppid
                    );

                  return [
                    game.steamAppid,
                    count,
                  ] as const;
                }
              )
            );

          if (
            cancelled
          ) {
            return;
          }

          setPlayerCounts(
            (current) => ({
              ...current,
              ...Object.fromEntries(
                entries
              ),
            })
          );
        } finally {
          requestRunning =
            false;

          if (
            !cancelled
          ) {
            setPlayerCountsLoading(
              false
            );
          }
        }
      };

    void loadPlayerCounts();

    const intervalId =
      window.setInterval(
        () => {
          void loadPlayerCounts();
        },
        PLAYER_COUNT_REFRESH_MS
      );

    return () => {
      cancelled =
        true;

      window.clearInterval(
        intervalId
      );
    };
  }, [
    playerSort,
    filteredGames,
  ]);

  const sortedGames =
    useMemo(() => {
      const copy = [
        ...filteredGames,
      ];

      return copy.sort(
        (a, b) => {
          /*
           * Sort priority:
           *
           * 1. Live players
           * 2. Compatibility
           * 3. Name
           * 4. Steam App ID
           *
           * The categories can still be
           * combined, exactly like before.
           */

          if (
            playerSort
          ) {
            const aPlayers =
              playerCounts[
                a.steamAppid
              ];

            const bPlayers =
              playerCounts[
                b.steamAppid
              ];

            const aUnavailable =
              aPlayers ===
                undefined ||
              aPlayers ===
                null;

            const bUnavailable =
              bPlayers ===
                undefined ||
              bPlayers ===
                null;

            /*
             * Unavailable Steam counts always
             * appear after games with a known
             * player count.
             */
            if (
              aUnavailable &&
              !bUnavailable
            ) {
              return 1;
            }

            if (
              !aUnavailable &&
              bUnavailable
            ) {
              return -1;
            }

            if (
              !aUnavailable &&
              !bUnavailable
            ) {
              const difference =
                playerSort ===
                'playersHigh'
                  ? bPlayers -
                    aPlayers
                  : aPlayers -
                    bPlayers;

              if (
                difference !==
                0
              ) {
                return difference;
              }
            }
          }

          if (
            tierSort
          ) {
            const aTier =
              tierOrder[
                a.tier ||
                  'Pending'
              ];

            const bTier =
              tierOrder[
                b.tier ||
                  'Pending'
              ];

            const difference =
              tierSort ===
              'tierBest'
                ? bTier -
                  aTier
                : aTier -
                  bTier;

            if (
              difference !==
              0
            ) {
              return difference;
            }
          }

          if (
            nameSort
          ) {
            const comparison =
              a.name.localeCompare(
                b.name,
                locale,
                {
                  sensitivity:
                    'base',
                }
              );

            if (
              comparison !==
              0
            ) {
              return nameSort ===
                'az'
                ? comparison
                : -comparison;
            }
          }

          if (
            steamSort
          ) {
            const difference =
              a.steamAppid -
              b.steamAppid;

            if (
              difference !==
              0
            ) {
              return steamSort ===
                'steamAsc'
                ? difference
                : -difference;
            }
          }

          return 0;
        }
      );
    }, [
      filteredGames,
      playerSort,
      playerCounts,
      tierSort,
      nameSort,
      steamSort,
      locale,
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        sortedGames.length /
          GAMES_PER_PAGE
      )
    );

  const startIndex =
    (currentPage - 1) *
    GAMES_PER_PAGE;

  const paginatedGames =
    sortedGames.slice(
      startIndex,
      startIndex +
        GAMES_PER_PAGE
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    query,
    selectedGenres,
    selectedTiers,
    nameSort,
    steamSort,
    tierSort,
    playerSort,
  ]);

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const goToPage = (
    page: number
  ) => {
    if (
      page < 1 ||
      page >
        totalPages
    ) {
      return;
    }

    setActivePanel(
      null
    );

    setCurrentPage(
      page
    );
  };

  const handleLayoutChange = (
    newLayout: LayoutMode
  ) => {
    setActivePanel(
      null
    );

    setLayout(
      newLayout
    );

    localStorage.setItem(
      'gameLayout',
      newLayout
    );
  };

  const resetFilters =
    () => {
      setSelectedGenres(
        []
      );

      setSelectedTiers(
        []
      );

      setNameSort(
        null
      );

      setSteamSort(
        null
      );

      setTierSort(
        null
      );

      setPlayerSort(
        null
      );

      setCurrentPage(
        1
      );

      setActivePanel(
        null
      );
    };

  const hasFilters =
    selectedGenres.length >
      0 ||
    selectedTiers.length >
      0 ||
    nameSort !== null ||
    steamSort !== null ||
    tierSort !== null ||
    playerSort !== null;

  const genreButtonLabel =
    selectedGenres.length ===
    0
      ? t(
          'allGenres'
        )
      : t(
          selectedGenres.length ===
            1
            ? 'genreCountOne'
            : 'genreCountMany',
          {
            count:
              selectedGenres.length,
          }
        );

  const tierButtonLabel =
    selectedTiers.length ===
    0
      ? t(
          'allTiers'
        )
      : t(
          selectedTiers.length ===
            1
            ? 'tierCountOne'
            : 'tierCountMany',
          {
            count:
              selectedTiers.length,
          }
        );

  return (
    <div>
      {/* SEARCH + FILTER CONTROLS */}
      <div className="mb-4 flex flex-col gap-2 xl:flex-row">
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
          className="theme-input w-full flex-1 rounded-lg border px-4 py-2 focus:outline-none"
        />

        <div className="flex flex-wrap gap-2">
          {/* GENRES */}
          <button
            type="button"
            data-filter-control
            onClick={() =>
              togglePanel(
                'genres'
              )
            }
            className={`theme-input min-w-36 rounded-lg border px-4 py-2 text-left transition ${
              activePanel ===
              'genres'
                ? 'ring-2 ring-[var(--accent)]'
                : ''
            }`}
            aria-expanded={
              activePanel ===
              'genres'
            }
          >
            {
              genreButtonLabel
            }
          </button>

          {/* TIERS */}
          <button
            type="button"
            data-filter-control
            onClick={() =>
              togglePanel(
                'tiers'
              )
            }
            className={`theme-input min-w-32 rounded-lg border px-4 py-2 text-left transition ${
              activePanel ===
              'tiers'
                ? 'ring-2 ring-[var(--accent)]'
                : ''
            }`}
            aria-expanded={
              activePanel ===
              'tiers'
            }
          >
            {
              tierButtonLabel
            }
          </button>

          {/* ORDERING */}
          <button
            type="button"
            data-filter-control
            onClick={() =>
              togglePanel(
                'ordering'
              )
            }
            className={`theme-input min-w-44 rounded-lg border px-4 py-2 text-left transition ${
              activePanel ===
              'ordering'
                ? 'ring-2 ring-[var(--accent)]'
                : ''
            }`}
            aria-expanded={
              activePanel ===
              'ordering'
            }
          >
            {!nameSort &&
            !steamSort &&
            !tierSort &&
            !playerSort
              ? t(
                  'defaultOrdering'
                )
              : t(
                  'orderingOptions'
                )}
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={
                resetFilters
              }
              className="theme-input rounded-lg border px-4 py-2 font-medium"
            >
              {t('reset')}
            </button>
          )}

          {/* GRID */}
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
                ? 'bg-[var(--accent)] text-white'
                : 'theme-input hover:bg-[var(--surface-hover)]'
            }`}
          >
            {t('grid')}
          </button>

          {/* LIST */}
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
                ? 'bg-[var(--accent)] text-white'
                : 'theme-input hover:bg-[var(--surface-hover)]'
            }`}
          >
            {t('list')}
          </button>
        </div>
      </div>

      {/* INLINE FILTER PANEL */}
      {activePanel && (
        <div
          ref={panelRef}
          className="theme-surface mb-4 rounded-xl border p-4 shadow-lg"
        >
          {/* GENRES PANEL */}
          {activePanel ===
            'genres' && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="theme-primary-text text-lg font-semibold">
                  {t(
                    'genres'
                  )}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setActivePanel(
                      null
                    )
                  }
                  className="theme-secondary-text rounded px-2 py-1 text-sm hover:bg-[var(--surface-hover)]"
                >
                  {t(
                    'close'
                  )}
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {availableGenres.map(
                  (genre) => (
                    <label
                      key={
                        genre
                      }
                      className={`theme-primary-text flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition hover:bg-[var(--surface-hover)] ${
                        selectedGenres.includes(
                          genre
                        )
                          ? 'border-[var(--accent)]'
                          : 'border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(
                          genre
                        )}
                        onChange={() =>
                          toggleGenre(
                            genre
                          )
                        }
                      />

                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getGenreColor(
                          genre
                        )}`}
                      >
                        {getGenreLabel(
                          genre,
                          language
                        )}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>
          )}

          {/* TIERS PANEL */}
          {activePanel ===
            'tiers' && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="theme-primary-text text-lg font-semibold">
                  {t(
                    'compatibilityTiers'
                  )}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setActivePanel(
                      null
                    )
                  }
                  className="theme-secondary-text rounded px-2 py-1 text-sm hover:bg-[var(--surface-hover)]"
                >
                  {t(
                    'close'
                  )}
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {allTiers.map(
                  (tier) => (
                    <label
                      key={
                        tier
                      }
                      className={`theme-primary-text flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition hover:bg-[var(--surface-hover)] ${
                        selectedTiers.includes(
                          tier
                        )
                          ? 'border-[var(--accent)]'
                          : 'border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTiers.includes(
                          tier
                        )}
                        onChange={() =>
                          toggleTier(
                            tier
                          )
                        }
                      />

                      <span
                        className={`rounded px-2 py-1 text-xs font-bold ${tierColors[tier]}`}
                      >
                        {getTierLabel(
                          tier,
                          t
                        )}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>
          )}

          {/* ORDERING PANEL */}
          {activePanel ===
            'ordering' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="theme-primary-text text-lg font-semibold">
                    {t(
                      'ordering'
                    )}
                  </h3>

                  <p className="theme-secondary-text mt-1 text-sm">
                    {t(
                      'orderingHint'
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActivePanel(
                      null
                    )
                  }
                  className="theme-secondary-text rounded px-2 py-1 text-sm hover:bg-[var(--surface-hover)]"
                >
                  {t(
                    'close'
                  )}
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {/* NAME */}
                <div className="rounded-lg border p-4">
                  <p className="theme-primary-text mb-3 font-semibold">
                    {t(
                      'name'
                    )}
                  </p>

                  <label className="theme-primary-text mb-3 flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="nameSort"
                      checked={
                        nameSort ===
                        'az'
                      }
                      onChange={() =>
                        setNameSort(
                          'az'
                        )
                      }
                    />

                    {t(
                      'nameAsc'
                    )}
                  </label>

                  <label className="theme-primary-text flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="nameSort"
                      checked={
                        nameSort ===
                        'za'
                      }
                      onChange={() =>
                        setNameSort(
                          'za'
                        )
                      }
                    />

                    {t(
                      'nameDesc'
                    )}
                  </label>

                  {nameSort && (
                    <button
                      type="button"
                      onClick={() =>
                        setNameSort(
                          null
                        )
                      }
                      className="theme-secondary-text mt-4 text-xs underline"
                    >
                      {t(
                        'clearNameOrdering'
                      )}
                    </button>
                  )}
                </div>

                {/* STEAM APP ID */}
                <div className="rounded-lg border p-4">
                  <p className="theme-primary-text mb-3 font-semibold">
                    {t(
                      'steamAppId'
                    )}
                  </p>

                  <label className="theme-primary-text mb-3 flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="steamSort"
                      checked={
                        steamSort ===
                        'steamAsc'
                      }
                      onChange={() =>
                        setSteamSort(
                          'steamAsc'
                        )
                      }
                    />

                    {t(
                      'steamAsc'
                    )}
                  </label>

                  <label className="theme-primary-text flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="steamSort"
                      checked={
                        steamSort ===
                        'steamDesc'
                      }
                      onChange={() =>
                        setSteamSort(
                          'steamDesc'
                        )
                      }
                    />

                    {t(
                      'steamDesc'
                    )}
                  </label>

                  {steamSort && (
                    <button
                      type="button"
                      onClick={() =>
                        setSteamSort(
                          null
                        )
                      }
                      className="theme-secondary-text mt-4 text-xs underline"
                    >
                      {t(
                        'clearSteamOrdering'
                      )}
                    </button>
                  )}
                </div>

                {/* COMPATIBILITY */}
                <div className="rounded-lg border p-4">
                  <p className="theme-primary-text mb-3 font-semibold">
                    {t(
                      'compatibility'
                    )}
                  </p>

                  <label className="theme-primary-text mb-3 flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="tierSort"
                      checked={
                        tierSort ===
                        'tierBest'
                      }
                      onChange={() =>
                        setTierSort(
                          'tierBest'
                        )
                      }
                    />

                    {t(
                      'tierBest'
                    )}
                  </label>

                  <label className="theme-primary-text flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="tierSort"
                      checked={
                        tierSort ===
                        'tierWorst'
                      }
                      onChange={() =>
                        setTierSort(
                          'tierWorst'
                        )
                      }
                    />

                    {t(
                      'tierWorst'
                    )}
                  </label>

                  {tierSort && (
                    <button
                      type="button"
                      onClick={() =>
                        setTierSort(
                          null
                        )
                      }
                      className="theme-secondary-text mt-4 text-xs underline"
                    >
                      {t(
                        'clearTierOrdering'
                      )}
                    </button>
                  )}
                </div>

                {/* LIVE PLAYERS */}
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="theme-primary-text font-semibold">
                      Live Players
                    </p>

                    <span className="rounded-full bg-green-500/15 px-2 py-1 text-[10px] font-semibold text-green-400">
                      LIVE
                    </span>
                  </div>

                  <label className="theme-primary-text mb-3 flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="playerSort"
                      checked={
                        playerSort ===
                        'playersHigh'
                      }
                      onChange={() =>
                        setPlayerSort(
                          'playersHigh'
                        )
                      }
                    />

                    Most → Least
                  </label>

                  <label className="theme-primary-text flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="playerSort"
                      checked={
                        playerSort ===
                        'playersLow'
                      }
                      onChange={() =>
                        setPlayerSort(
                          'playersLow'
                        )
                      }
                    />

                    Least → Most
                  </label>

                  {playerSort && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setPlayerSort(
                            null
                          )
                        }
                        className="theme-secondary-text mt-4 text-xs underline"
                      >
                        Clear live-player ordering
                      </button>

                      <p className="theme-secondary-text mt-3 text-xs">
                        {playerCountsLoading
                          ? 'Refreshing live Steam counts…'
                          : 'Refreshes automatically every 60 seconds.'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE FILTER CHIPS */}
      {(selectedGenres.length >
        0 ||
        selectedTiers.length >
          0) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedGenres.map(
            (genre) => (
              <button
                key={
                  genre
                }
                type="button"
                onClick={() =>
                  toggleGenre(
                    genre
                  )
                }
                className={`rounded-full px-3 py-1 text-xs ${getGenreColor(
                  genre
                )}`}
              >
                {getGenreLabel(
                  genre,
                  language
                )}{' '}
                ×
              </button>
            )
          )}

          {selectedTiers.map(
            (tier) => (
              <button
                key={
                  tier
                }
                type="button"
                onClick={() =>
                  toggleTier(
                    tier
                  )
                }
                className={`rounded-full px-3 py-1 text-xs font-bold ${tierColors[tier]}`}
              >
                {getTierLabel(
                  tier,
                  t
                )}{' '}
                ×
              </button>
            )
          )}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950 p-3 text-red-200">
          {error}
        </div>
      )}

      {/* GAMES */}
      <div
        className={
          layout ===
          'grid'
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col gap-4'
        }
      >
        {paginatedGames.map(
          (game) => {
            const livePlayerCount =
              playerCounts[
                game
                  .steamAppid
              ];

            return (
              <Link
                key={
                  game.id
                }
                href={`/games/${game.steamAppid}`}
                className={`theme-surface overflow-hidden rounded-lg border transition-colors hover:bg-[var(--surface-hover)] ${
                  layout ===
                  'list'
                    ? 'flex flex-col sm:flex-row'
                    : 'flex flex-col'
                }`}
              >
                <GameBanner
                  game={
                    game
                  }
                  layout={
                    layout
                  }
                />

                <div className="flex flex-1 items-start justify-between p-4">
                  <div className="min-w-0">
                    <h2 className="theme-primary-text text-lg font-semibold">
                      {
                        game.name
                      }
                    </h2>

                    <p className="theme-secondary-text mt-1 text-sm">
                      {t(
                        'steamAppId'
                      )}
                      :{' '}
                      {
                        game.steamAppid
                      }
                    </p>

                    {playerSort && (
                      <p
                        className={`mt-2 text-xs ${
                          typeof livePlayerCount ===
                          'number'
                            ? 'text-green-400'
                            : 'theme-secondary-text'
                        }`}
                      >
                        {playerCountsLoading &&
                        livePlayerCount ===
                          undefined
                          ? 'Loading live players…'
                          : typeof livePlayerCount ===
                              'number'
                            ? `● ${livePlayerCount.toLocaleString()} players online now`
                            : 'Live player count unavailable'}
                      </p>
                    )}

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
              </Link>
            );
          }
        )}

        {sortedGames.length ===
          0 &&
          !error && (
            <div className="theme-surface theme-secondary-text rounded-lg border p-4 text-center">
              {hasFilters
                ? t(
                    'noGamesMatchFilters'
                  )
                : t(
                    'noGames'
                  )}
            </div>
          )}
      </div>

      {/* PAGINATION */}
      {totalPages >
        1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() =>
              goToPage(
                currentPage -
                  1
              )
            }
            disabled={
              currentPage ===
              1
            }
            className="theme-surface theme-border theme-primary-text rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t(
              'previous'
            )}
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from(
              {
                length:
                  totalPages,
              },
              (
                _,
                index
              ) =>
                index +
                1
            ).map(
              (
                page
              ) => (
                <button
                  key={
                    page
                  }
                  type="button"
                  onClick={() =>
                    goToPage(
                      page
                    )
                  }
                  aria-current={
                    currentPage ===
                    page
                      ? 'page'
                      : undefined
                  }
                  className={
                    currentPage ===
                    page
                      ? 'rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white'
                      : 'theme-surface theme-border theme-primary-text rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--surface-hover)]'
                  }
                >
                  {
                    page
                  }
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              goToPage(
                currentPage +
                  1
              )
            }
            disabled={
              currentPage ===
              totalPages
            }
            className="theme-surface theme-border theme-primary-text rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t(
              'next'
            )}
          </button>

          <span className="theme-page-text ml-2 text-sm">
            {t(
              'pageOf',
              {
                current:
                  currentPage,
                total:
                  totalPages,
              }
            )}
          </span>
        </div>
      )}
    </div>
  );
}

function GameBanner({
  game,
  layout,
}: {
  game: GameDto;
  layout: LayoutMode;
}) {
  const steamHeaderUrl =
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppid}/header.jpg`;

  const imageSources =
    useMemo(() => {
      const candidates =
        [
          game.headerUrl?.trim(),
          steamHeaderUrl,
        ].filter(
          (
            source
          ): source is string =>
            Boolean(
              source
            )
        );

      return Array.from(
        new Set(
          candidates
        )
      );
    }, [
      game.headerUrl,
      steamHeaderUrl,
    ]);

  const [
    sourceIndex,
    setSourceIndex,
  ] = useState(0);

  useEffect(() => {
    setSourceIndex(
      0
    );
  }, [
    game.id,
    game.headerUrl,
    game.steamAppid,
  ]);

  const currentSource =
    imageSources[
      sourceIndex
    ];

  const imageClassName =
    layout ===
    'grid'
      ? 'aspect-[460/215] w-full object-cover'
      : 'aspect-[460/215] w-full object-cover sm:w-64';

  const fallbackClassName =
    layout ===
    'grid'
      ? 'aspect-[460/215] w-full'
      : 'aspect-[460/215] w-full sm:w-64';

  if (
    currentSource
  ) {
    return (
      <img
        src={
          currentSource
        }
        alt=""
        className={
          imageClassName
        }
        loading="lazy"
        onError={() =>
          setSourceIndex(
            (
              current
            ) =>
              current +
              1
          )
        }
      />
    );
  }

  const monogram =
    getGameMonogram(
      game.name
    );

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black ${fallbackClassName}`}
      aria-label={`${game.name} artwork unavailable`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.10),transparent_35%),radial-gradient(circle_at_75%_70%,rgba(255,255,255,0.05),transparent_40%)]" />

      <span
        aria-hidden="true"
        className="absolute select-none text-7xl font-black tracking-widest text-white/[0.06] sm:text-8xl"
      >
        {monogram}
      </span>

      <div className="relative z-10 flex max-w-[85%] flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 shadow-lg backdrop-blur-sm">
          <span className="text-xl font-black tracking-wider text-white/80">
            {
              monogram
            }
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm font-semibold text-white/90 drop-shadow-lg">
          {game.name}
        </p>

        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
          Artwork unavailable
        </p>
      </div>
    </div>
  );
}

function getGameMonogram(
  gameName: string
): string {
  const words =
    gameName
      .trim()
      .split(/\s+/)
      .filter(
        Boolean
      );

  if (
    words.length ===
    0
  ) {
    return 'GAME';
  }

  const numericPart =
    [
      ...words,
    ]
      .reverse()
      .find(
        (word) =>
          /^\d+$/.test(
            word
          )
      ) ?? '';

  const textWords =
    words.filter(
      (word) =>
        !/^\d+$/.test(
          word
        )
    );

  const letters =
    textWords
      .slice(
        0,
        2
      )
      .map(
        (word) =>
          word.charAt(
            0
          )
      )
      .join('')
      .toUpperCase();

  return (
    `${letters}${numericPart}` ||
    'GAME'
  );
}