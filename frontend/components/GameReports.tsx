'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

import SubmitReportForm from '@/components/SubmitReportForm';

import {
  updateReport,
  deleteReport,
} from '@/services/reportService';

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
  Tier,
} from '@/types';

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
  const {
    language,
    t,
  } = useLanguage();

  const { user } = useAuth();
  const router = useRouter();

  const [
    editingReportId,
    setEditingReportId,
  ] = useState<number | null>(null);

  const [
    editForm,
    setEditForm,
  ] = useState<EditForm | null>(null);

  const [
    editError,
    setEditError,
  ] = useState('');

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deletingReportId,
    setDeletingReportId,
  ] = useState<number | null>(null);

  const [
    deleteErrorReportId,
    setDeleteErrorReportId,
  ] = useState<number | null>(null);

  const [
    deleteError,
    setDeleteError,
  ] = useState('');

  const [visibleCount, setVisibleCount] = useState(10);

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

  const startEditing = (
    report: ReportDto
  ) => {
    setEditError('');
    setDeleteError('');
    setDeleteErrorReportId(null);

    setEditingReportId(
      report.id
    );

    setEditForm({
      tier: report.tier as Tier,
      distribution:
        report.distribution ?? '',
      protonVersion:
        report.protonVersion ?? '',
      comment:
        report.comment ?? '',
    });
  };

  const cancelEditing = () => {
    setEditingReportId(null);
    setEditForm(null);
    setEditError('');
  };

  const handleUpdate = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !user ||
      editingReportId === null ||
      editForm === null
    ) {
      return;
    }

    setEditError('');

    if (
      !editForm.distribution.trim() ||
      !editForm.protonVersion.trim() ||
      !editForm.comment.trim()
    ) {
      setEditError(
        language === 'es'
          ? 'Todos los campos son obligatorios.'
          : 'All fields are required.'
      );

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
      console.error(
        'Failed to update report:',
        err
      );

      setEditError(
        language === 'es'
          ? 'No se pudo actualizar el informe.'
          : 'Failed to update report.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    reportId: number
  ) => {
    const confirmed =
      window.confirm(
        language === 'es'
          ? '¿Seguro que quieres eliminar este informe? Esta acción no se puede deshacer.'
          : 'Are you sure you want to delete this report? This action cannot be undone.'
      );

    if (!confirmed) {
      return;
    }

    setDeleteError('');
    setDeleteErrorReportId(null);

    try {
      setDeletingReportId(
        reportId
      );

      await deleteReport(
        reportId
      );

      if (
        editingReportId ===
        reportId
      ) {
        setEditingReportId(null);
        setEditForm(null);
      }

      router.refresh();
    } catch (err) {
      console.error(
        'Failed to delete report:',
        err
      );

      setDeleteErrorReportId(
        reportId
      );

      setDeleteError(
        language === 'es'
          ? 'No se pudo eliminar el informe.'
          : 'Failed to delete report.'
      );
    } finally {
      setDeletingReportId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Main game card */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
          <img
            src={gameHeaderUrl}
            alt={`${game.name} banner`}
            className="aspect-[460/215] w-full object-cover"
          />

          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                {game.name}
              </h1>

              <p className="mt-2 text-gray-400">
                {t('steamAppId')}:{' '}
                {game.steamAppid}
              </p>

              {game.genres &&
                game.genres.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm text-gray-400">
                      {genresLabel}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {game.genres.map(
                        (genre) => (
                          <span
                            key={genre}
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
        </div>

        {/* Submit report */}
        <div className="mb-8">
          <SubmitReportForm
            gameId={game.id}
          />
        </div>

        {/* Reports */}
        <h2 className="mb-4 text-2xl font-bold">
          {t('reports')}
        </h2>

        <div className="mb-12 flex flex-col gap-4">
          {reports.slice(0, visibleCount).map((report) => {
            const isOwnReport =
              user !== null &&
              Number(user.id) ===
                Number(report.user_id);

            const isEditing =
              editingReportId ===
              report.id;

            const isDeleting =
              deletingReportId ===
              report.id;

            return (
              <div
                key={report.id}
                className="flex flex-col gap-2 rounded-lg border border-gray-700 bg-gray-800 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-gray-400">
                    <Link
                      href={`/users/${report.user_id}`}
                      className="font-bold underline transition-colors hover:text-pink-600"
                    >
                      {report.username}
                    </Link>

                    {' '}
                    •{' '}
                    {report.distribution}
                    {' '}
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
                        report.tier
                      ]
                    }`}
                  >
                    {getTierLabel(
                      report.tier,
                      t
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <>
                    {report.comment && (
                      <div className="mt-2 whitespace-pre-line rounded bg-gray-900 p-3 text-sm text-gray-300">
                        {report.comment}
                      </div>
                    )}

                    {deleteErrorReportId ===
                      report.id &&
                      deleteError && (
                        <div className="mt-2 rounded border border-red-700 bg-red-950 p-3 text-sm text-red-300">
                          {deleteError}
                        </div>
                      )}

                    {isOwnReport && (
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              report
                            )
                          }
                          disabled={
                            isDeleting
                          }
                          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {language === 'es'
                            ? 'Editar'
                            : 'Edit'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              report.id
                            )
                          }
                          disabled={
                            isDeleting
                          }
                          className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleting
                            ? language === 'es'
                              ? 'Eliminando...'
                              : 'Deleting...'
                            : language === 'es'
                              ? 'Eliminar'
                              : 'Delete'}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {isEditing &&
                  editForm && (
                    <form
                      onSubmit={
                        handleUpdate
                      }
                      className="mt-3 space-y-4 rounded border border-gray-700 bg-gray-900 p-4"
                    >
                      {editError && (
                        <div className="rounded border border-red-700 bg-red-950 p-3 text-sm text-red-300">
                          {editError}
                        </div>
                      )}

                      <div>
                        <label
                          htmlFor={`tier-${report.id}`}
                          className="mb-1 block text-sm font-medium text-gray-300"
                        >
                          {t(
                            'compatibilityRating'
                          )}
                        </label>

                        <select
                          id={`tier-${report.id}`}
                          value={
                            editForm.tier
                          }
                          onChange={(
                            event
                          ) =>
                            setEditForm({
                              ...editForm,
                              tier: event
                                .target
                                .value as Tier,
                            })
                          }
                          required
                          className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                          <option value="Platinum">
                            {t(
                              'platinum'
                            )}
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
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor={`distribution-${report.id}`}
                          className="mb-1 block text-sm font-medium text-gray-300"
                        >
                          {t(
                            'linuxDistribution'
                          )}
                        </label>

                        <input
                          id={`distribution-${report.id}`}
                          type="text"
                          value={
                            editForm.distribution
                          }
                          onChange={(
                            event
                          ) =>
                            setEditForm({
                              ...editForm,
                              distribution:
                                event
                                  .target
                                  .value,
                            })
                          }
                          required
                          className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`proton-${report.id}`}
                          className="mb-1 block text-sm font-medium text-gray-300"
                        >
                          {t(
                            'protonVersion'
                          )}
                        </label>

                        <input
                          id={`proton-${report.id}`}
                          type="text"
                          value={
                            editForm.protonVersion
                          }
                          onChange={(
                            event
                          ) =>
                            setEditForm({
                              ...editForm,
                              protonVersion:
                                event
                                  .target
                                  .value,
                            })
                          }
                          required
                          className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`comment-${report.id}`}
                          className="mb-1 block text-sm font-medium text-gray-300"
                        >
                          {t('comment')}
                        </label>

                        <textarea
                          id={`comment-${report.id}`}
                          value={
                            editForm.comment
                          }
                          onChange={(
                            event
                          ) =>
                            setEditForm({
                              ...editForm,
                              comment:
                                event
                                  .target
                                  .value,
                            })
                          }
                          required
                          rows={4}
                          className="w-full resize-y rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={
                            saving
                          }
                          className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {saving
                            ? language ===
                              'es'
                              ? 'Guardando...'
                              : 'Saving...'
                            : language ===
                                'es'
                              ? 'Guardar cambios'
                              : 'Save Changes'}
                        </button>

                        <button
                          type="button"
                          onClick={
                            cancelEditing
                          }
                          disabled={
                            saving
                          }
                          className="rounded bg-gray-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {language === 'es'
                            ? 'Cancelar'
                            : 'Cancel'}
                        </button>
                      </div>
                    </form>
                  )}
              </div>
            );
          })}

          {reports.length === 0 && (
            <div className="rounded-lg border border-gray-700 p-4 text-center text-gray-400">
              {t('noReports')}
            </div>
          )}
          {reports.length > visibleCount && (
            <button
              onClick={() => setVisibleCount(visibleCount + 10)}
              className="self-center rounded bg-gray-700 px-4 py-2 hover:bg-gray-600"
            >
              {language === 'es' ? 'Mostrar más' : 'Show more'}
            </button>
          )}
        </div>

        {/* Related games */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">
            {relatedGamesTitle}
          </h2>

          {relatedGames.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedGames.map(
                (relatedGame) => (
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
              {noRelatedGames}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}