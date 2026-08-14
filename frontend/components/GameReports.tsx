'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { fetchUser } from '@/services/userService';

import SubmitReportForm from '@/components/SubmitReportForm';

import { updateReport, deleteReport } from '@/services/reportService';

import { getGenreColor } from '@/utils/genreColors';
import { getGenreLabel } from '@/utils/genreLabels';
import { getTierLabel, getTierDescription } from '@/utils/tierLabels';

import type { ReportDto, GameDto, Tier } from '@/types';

import PlayerCount from './PlayerCount';

const tierColors: Record<string, string> = {
  Platinum: 'bg-blue-200 text-blue-900',
  Gold: 'bg-yellow-400 text-yellow-900',
  Silver: 'bg-gray-300 text-gray-900',
  Bronze: 'bg-orange-500 text-orange-950',
  Borked: 'bg-red-600 text-white',
  Pending: 'bg-gray-600 text-gray-300',
};

const BREAKDOWN_TIERS = [
  'Platinum',
  'Gold',
  'Silver',
  'Bronze',
  'Borked',
] as const;

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='50' fill='%239ca3af'/%3E%3Ccircle cx='50' cy='36' r='19' fill='%23f3f4f6'/%3E%3Cpath d='M18 91c3-22 16-34 32-34s29 12 32 34' fill='%23f3f4f6'/%3E%3C/svg%3E";

interface GameReportsProps {
  game: GameDto;
  reports: ReportDto[];
  relatedGames: GameDto[];
}

interface EditForm {
  tier: Tier;
  distribution: string;
  protonVersion: string;
  comment: string;
}

export default function GameReports({
  game,
  reports,
  relatedGames,
}: GameReportsProps) {
  const { language, locale, t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  const [editingReportId, setEditingReportId] = useState<number | null>(
    null
  );

  const [editForm, setEditForm] = useState<EditForm | null>(null);

  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deletingReportId, setDeletingReportId] = useState<number | null>(
    null
  );

  const [reportToDelete, setReportToDelete] = useState<number | null>(null);

  const [deleteErrorReportId, setDeleteErrorReportId] = useState<
    number | null
  >(null);

  const [deleteError, setDeleteError] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const [reportAuthorAvatars, setReportAuthorAvatars] = useState<
    Record<number, string | null>
  >({});

  useEffect(() => {
    let cancelled = false;

    const userIds = Array.from(
      new Set(
        reports
          .map((report) => Number(report.user_id))
          .filter((id) => Number.isFinite(id))
      )
    );

    const loadReportAuthorAvatars = async () => {
      const entries = await Promise.all(
        userIds.map(async (userId) => {
          try {
            const reportAuthor = await fetchUser(String(userId));

            return [userId, reportAuthor.avatarUrl || null] as const;
          } catch (error) {
            console.error(
              `Failed to fetch profile picture for user ${userId}:`,
              error
            );

            return [userId, null] as const;
          }
        })
      );

      if (!cancelled) {
        setReportAuthorAvatars(Object.fromEntries(entries));
      }
    };

    if (userIds.length > 0) {
      loadReportAuthorAvatars();
    } else {
      setReportAuthorAvatars({});
    }

    return () => {
      cancelled = true;
    };
  }, [reports]);

  const totalReports = reports.length;

  const tierCounts = reports.reduce(
    (acc, report) => {
      acc[report.tier] = (acc[report.tier] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>
  );

  const startEditing = (report: ReportDto) => {
    setEditError('');
    setDeleteError('');
    setDeleteErrorReportId(null);

    setEditingReportId(report.id);

    setEditForm({
      tier: report.tier as Tier,
      distribution: report.distribution ?? '',
      protonVersion: report.protonVersion ?? '',
      comment: report.comment ?? '',
    });
  };

  const cancelEditing = () => {
    setEditingReportId(null);
    setEditForm(null);
    setEditError('');
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || editingReportId === null || editForm === null) {
      return;
    }

    setEditError('');

    if (
      !editForm.distribution.trim() ||
      !editForm.protonVersion.trim() ||
      !editForm.comment.trim()
    ) {
      setEditError(t('allFieldsRequired'));

      return;
    }

    try {
      setSaving(true);

      await updateReport(
        editingReportId,
        Number(user.id),
        editForm.tier,
        editForm.distribution.trim(),
        editForm.comment.trim(),
        editForm.protonVersion.trim()
      );

      setEditingReportId(null);
      setEditForm(null);

      router.refresh();
    } catch (err) {
      console.error('Failed to update report:', err);

      setEditError(t('updateReportFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reportId: number) => {
    setDeleteError('');
    setDeleteErrorReportId(null);

    try {
      setDeletingReportId(reportId);

      await deleteReport(reportId);

      setReportToDelete(null);

      if (editingReportId === reportId) {
        setEditingReportId(null);
        setEditForm(null);
      }

      router.refresh();
    } catch (err) {
      console.error('Failed to delete report:', err);

      setDeleteErrorReportId(reportId);
      setDeleteError(t('deleteReportFailed'));
      setReportToDelete(null);
    } finally {
      setDeletingReportId(null);
    }
  };

  return (
    <main className="min-h-screen p-8 text-[var(--foreground)] transition-colors duration-200">
      <div className="mx-auto max-w-5xl">
        {/* Game header */}
        <div className="theme-surface mb-8 overflow-hidden rounded-lg border">
          <GameBanner
            game={game}
            className="aspect-[460/215] w-full"
          />

          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="theme-primary-text text-4xl font-bold">
                {game.name}
              </h1>

              <p className="theme-secondary-text mt-2">
                {t('steamAppId')}: {game.steamAppid}
              </p>

              <PlayerCount steamAppid={game.steamAppid} />

              {game.genres && game.genres.length > 0 && (
                <div className="mt-4">
                  <p className="theme-secondary-text mb-2 text-sm">
                    {t('genres')}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {game.genres.map((genre) => (
                      <span
                        key={genre}
                        className={`rounded-full px-3 py-1 text-sm ${getGenreColor(
                          genre
                        )}`}
                      >
                        {getGenreLabel(genre, language)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className={`shrink-0 rounded px-4 py-2 text-lg font-bold ${
                game.tier ? tierColors[game.tier] : tierColors.Pending
              }`}
            >
              {getTierLabel(game.tier || 'Pending', t)}
            </div>
          </div>
        </div>

        {/* Compatibility breakdown */}
        {totalReports > 0 && (
          <div className="theme-surface mb-8 rounded-lg border p-6">
            <h2 className="theme-primary-text mb-4 text-xl font-bold">
              {t('compatibilityBreakdown')}
            </h2>

            <div className="space-y-4">
              {BREAKDOWN_TIERS.map((tier) => {
                const count = tierCounts[tier] || 0;

                const percentage = Math.round(
                  (count / totalReports) * 100
                );

                const bgClass = tierColors[tier].split(' ')[0];

                return (
                  <div
                    key={tier}
                    className="group flex items-center gap-4"
                    title={getTierDescription(tier, t)}
                  >
                    <div className="theme-primary-text w-20 shrink-0 cursor-help text-sm font-semibold decoration-dotted underline-offset-4 group-hover:underline">
                      {getTierLabel(tier, t)}
                    </div>

                    <div className="theme-surface-secondary h-3 flex-1 overflow-hidden rounded-full border">
                      <div
                        className={`h-full ${bgClass} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="theme-secondary-text w-20 shrink-0 text-right text-sm">
                      {percentage}% ({count})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit report */}
        <div className="mb-8">
          <SubmitReportForm gameId={game.id} />
        </div>

        {/* Reports */}
        <h2 className="theme-primary-text mb-4 text-2xl font-bold">
          {t('reports')}
        </h2>

        <div className="mb-12 flex flex-col gap-4">
          {reports.length === 0 ? (
            <div className="theme-surface rounded-xl border border-dashed px-6 py-10 text-center">
              <h3 className="theme-primary-text text-lg font-semibold">
                {t('noReportsTitle')}
              </h3>

              <p className="theme-secondary-text mx-auto mt-2 max-w-lg text-sm leading-6">
                {t('noReportsDescription')}
              </p>

              {!user && (
                <Link
                  href="/login"
                  className="mt-5 inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
                >
                  {t('loginToContribute')}
                </Link>
              )}
            </div>
          ) : (
            <>
              {reports.slice(0, visibleCount).map((report) => {
                const isOwnReport =
                  user !== null &&
                  Number(user.id) === Number(report.user_id);

                const isEditing = editingReportId === report.id;
                const isDeleting = deletingReportId === report.id;

                return (
                  <div
                    key={report.id}
                    className="theme-surface flex flex-col gap-2 rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <Link
                          href={`/users/${report.user_id}`}
                          className="shrink-0"
                          aria-label={`${report.username} profile`}
                        >
                          <img
                            src={
                              reportAuthorAvatars[
                                Number(report.user_id)
                              ] || DEFAULT_AVATAR
                            }
                            alt={`${report.username} profile picture`}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20"
                            loading="lazy"
                          />
                        </Link>

                        <p className="theme-secondary-text min-w-0 text-sm">
                          <Link
                            href={`/users/${report.user_id}`}
                            className="font-bold underline transition-colors hover:text-pink-600"
                          >
                            {report.username}
                          </Link>{' '}
                          • {report.distribution} •{' '}
                          {report.protonVersion
                            ? `Proton ${report.protonVersion} • `
                            : ''}
                          {new Date(
                            report.createdAt
                          ).toLocaleDateString(locale)}
                        </p>
                      </div>

                      <div
                        className={`rounded px-4 py-1.5 font-bold ${
                          tierColors[report.tier]
                        }`}
                      >
                        {getTierLabel(report.tier, t)}
                      </div>
                    </div>

                    {!isEditing && (
                      <>
                        {report.comment && (
                          <div className="theme-surface-secondary mt-2 whitespace-pre-line rounded p-3 text-sm">
                            {report.comment}
                          </div>
                        )}

                        {deleteErrorReportId === report.id &&
                          deleteError && (
                            <div className="mt-2 rounded border border-red-700 bg-red-950 p-3 text-sm text-red-300">
                              {deleteError}
                            </div>
                          )}

                        {isOwnReport && (
                          <div className="mt-2 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => startEditing(report)}
                              disabled={isDeleting}
                              className="rounded bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {t('edit')}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setReportToDelete(report.id)
                              }
                              disabled={isDeleting}
                              className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isDeleting ? t('deleting') : t('delete')}
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {isEditing && editForm && (
                      <form
                        onSubmit={handleUpdate}
                        className="theme-surface-secondary theme-border mt-3 space-y-4 rounded border p-4"
                      >
                        {editError && (
                          <div className="rounded border border-red-700 bg-red-950 p-3 text-sm text-red-300">
                            {editError}
                          </div>
                        )}

                        <div>
                          <label
                            htmlFor={`tier-${report.id}`}
                            className="theme-primary-text mb-1 block text-sm font-medium"
                          >
                            {t('compatibilityRating')}
                          </label>

                          <select
                            id={`tier-${report.id}`}
                            value={editForm.tier}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                tier: event.target.value as Tier,
                              })
                            }
                            required
                            className="theme-input w-full rounded border px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                          >
                            <option value="Platinum">
                              {t('platinum')}
                            </option>
                            <option value="Gold">{t('gold')}</option>
                            <option value="Silver">{t('silver')}</option>
                            <option value="Bronze">{t('bronze')}</option>
                            <option value="Borked">{t('borked')}</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor={`distribution-${report.id}`}
                            className="theme-primary-text mb-1 block text-sm font-medium"
                          >
                            {t('linuxDistribution')}
                          </label>

                          <input
                            id={`distribution-${report.id}`}
                            type="text"
                            value={editForm.distribution}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                distribution: event.target.value,
                              })
                            }
                            required
                            className="theme-input w-full rounded border px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`proton-${report.id}`}
                            className="theme-primary-text mb-1 block text-sm font-medium"
                          >
                            {t('protonVersion')}
                          </label>

                          <input
                            id={`proton-${report.id}`}
                            type="text"
                            value={editForm.protonVersion}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                protonVersion: event.target.value,
                              })
                            }
                            required
                            className="theme-input w-full rounded border px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`comment-${report.id}`}
                            className="theme-primary-text mb-1 block text-sm font-medium"
                          >
                            {t('comment')}
                          </label>

                          <textarea
                            id={`comment-${report.id}`}
                            value={editForm.comment}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                comment: event.target.value,
                              })
                            }
                            required
                            rows={4}
                            className="theme-input w-full resize-y rounded border px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={saving}
                            className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {saving ? t('saving') : t('saveChanges')}
                          </button>

                          <button
                            type="button"
                            onClick={cancelEditing}
                            disabled={saving}
                            className="theme-input rounded border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {t('cancel')}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })}

              {reports.length > visibleCount && (
                <button
                  type="button"
                  onClick={() => setVisibleCount(visibleCount + 10)}
                  className="theme-input self-center rounded border px-4 py-2 transition-colors hover:bg-[var(--surface-hover)]"
                >
                  {t('showMore')}
                </button>
              )}
            </>
          )}
        </div>

        {/* Related games */}
        <section>
          <h2 className="theme-primary-text mb-4 text-2xl font-bold">
            {t('relatedGames')}
          </h2>

          {relatedGames.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedGames.map((relatedGame) => (
                <Link
                  key={relatedGame.id}
                  href={`/games/${relatedGame.steamAppid}`}
                  className="theme-surface overflow-hidden rounded-lg border transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <GameBanner
                    game={relatedGame}
                    className="aspect-[460/215] w-full"
                  />

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="theme-primary-text font-semibold">
                          {relatedGame.name}
                        </h3>

                        <p className="theme-secondary-text mt-1 text-sm">
                          {t('steamAppId')}: {relatedGame.steamAppid}
                        </p>
                      </div>

                      <div
                        className={`shrink-0 rounded px-2 py-1 text-xs font-bold ${
                          relatedGame.tier
                            ? tierColors[relatedGame.tier]
                            : tierColors.Pending
                        }`}
                      >
                        {getTierLabel(
                          relatedGame.tier || 'Pending',
                          t
                        )}
                      </div>
                    </div>

                    {relatedGame.genres &&
                      relatedGame.genres.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {relatedGame.genres.map((genre) => (
                            <span
                              key={genre}
                              className={`rounded-full px-2 py-1 text-xs ${getGenreColor(
                                genre
                              )}`}
                            >
                              {getGenreLabel(genre, language)}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="theme-surface theme-secondary-text rounded-xl border border-dashed px-6 py-8 text-center">
              {t('noRelatedGames')}
            </div>
          )}
        </section>
      </div>

      {/* Delete confirmation */}
      {reportToDelete !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              deletingReportId === null
            ) {
              setReportToDelete(null);
            }
          }}
        >
          <div className="theme-surface w-full max-w-md rounded-xl border p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-950 text-2xl font-bold text-red-400">
              !
            </div>

            <h2 className="theme-primary-text mt-4 text-xl font-bold">
              {t('deleteReportTitle')}
            </h2>

            <p className="theme-secondary-text mt-3 text-sm leading-6">
              {t('deleteReportConfirm')}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReportToDelete(null)}
                disabled={deletingReportId !== null}
                className="theme-input rounded-lg border px-4 py-2 font-semibold transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('cancel')}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(reportToDelete)}
                disabled={deletingReportId !== null}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingReportId !== null
                  ? t('deleting')
                  : t('deleteReportButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function GameBanner({
  game,
  className,
}: {
  game: GameDto;
  className: string;
}) {
  const steamHeaderUrl =
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppid}/header.jpg`;

  const sources = Array.from(
    new Set(
      [game.headerUrl?.trim(), steamHeaderUrl].filter(
        (source): source is string => Boolean(source)
      )
    )
  );

  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [game.id, game.headerUrl, game.steamAppid]);

  const currentSource = sources[sourceIndex];

  if (currentSource) {
    return (
      <img
        src={currentSource}
        alt=""
        className={`${className} object-cover`}
        loading="lazy"
        onError={() => {
          setSourceIndex((current) => current + 1);
        }}
      />
    );
  }

  const monogram = getGameMonogram(game.name);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black ${className}`}
      role="img"
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
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/5 shadow-lg backdrop-blur-sm">
          <span className="text-xl font-black tracking-wider text-white/80">
            {monogram}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-base font-semibold text-white/90 drop-shadow-lg">
          {game.name}
        </p>

        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
          Artwork unavailable
        </p>
      </div>
    </div>
  );
}

function getGameMonogram(gameName: string): string {
  const words = gameName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return 'GAME';
  }

  const numericPart =
    [...words]
      .reverse()
      .find((word) => /^\d+$/.test(word)) ?? '';

  const textWords = words.filter(
    (word) => !/^\d+$/.test(word)
  );

  const letters = textWords
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

  return `${letters}${numericPart}` || 'GAME';
}
