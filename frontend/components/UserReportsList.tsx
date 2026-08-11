'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

import {
  updateReport,
  deleteReport,
} from '@/services/reportService';

import { getTierLabel } from '@/utils/tierLabels';

import type {
  ReportDto,
  Tier,
} from '@/types';

interface UserReportsListProps {
  profileId: number;
  reports: ReportDto[];
}

interface EditForm {
  tier: Tier;
  distribution: string;
  protonVersion: string;
  comment: string;
}

const tierColors: Record<string, string> = {
  Platinum: 'bg-blue-200 text-blue-900',
  Gold: 'bg-yellow-400 text-yellow-900',
  Silver: 'bg-gray-300 text-gray-900',
  Bronze: 'bg-orange-500 text-orange-950',
  Borked: 'bg-red-600 text-white',
  Pending: 'bg-gray-600 text-gray-300',
};

export default function UserReportsList({
  profileId,
  reports,
}: UserReportsListProps) {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const router = useRouter();

  const [editingReportId, setEditingReportId] =
    useState<number | null>(null);

  const [editForm, setEditForm] =
    useState<EditForm | null>(null);

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deletingReportId, setDeletingReportId] =
    useState<number | null>(null);

  const [reportToDelete, setReportToDelete] =
    useState<number | null>(null);

  const [deleteErrorReportId, setDeleteErrorReportId] =
    useState<number | null>(null);

  const [deleteError, setDeleteError] =
    useState('');

  const isOwnProfile =
    user !== null &&
    Number(user.id) === profileId;

  const startEditing = (
    report: ReportDto
  ) => {
    setError('');
    setDeleteError('');
    setDeleteErrorReportId(null);

    setEditingReportId(report.id);

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
    setError('');
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

    setError('');

    if (
      !editForm.distribution.trim() ||
      !editForm.protonVersion.trim() ||
      !editForm.comment.trim()
    ) {
      setError(
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

      setError(
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
      console.error(
        'Failed to delete report:',
        err
      );

      setDeleteErrorReportId(reportId);

      setDeleteError(
        language === 'es'
          ? 'No se pudo eliminar el informe.'
          : 'Failed to delete report.'
      );

      setReportToDelete(null);
    } finally {
      setDeletingReportId(null);
    }
  };

  if (reports.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-700 bg-gray-800/40 px-6 py-10 text-center">
        <h3 className="text-lg font-semibold text-white">
          {language === 'es'
            ? 'Aún no hay contribuciones'
            : 'No contributions yet'}
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
          {isOwnProfile
            ? language === 'es'
              ? 'Todavía no has enviado ningún informe de compatibilidad. Explora los juegos y comparte tu experiencia.'
              : 'You have not submitted any compatibility reports yet. Browse the catalogue and share your experience.'
            : language === 'es'
              ? 'Este usuario todavía no ha enviado ningún informe de compatibilidad.'
              : 'This user has not submitted any compatibility reports yet.'}
        </p>

        {isOwnProfile && (
          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {language === 'es'
              ? 'Explorar juegos'
              : 'Browse Games'}
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reports.map((report) => {
          const isEditing =
            editingReportId === report.id;

          const isDeleting =
            deletingReportId === report.id;

          return (
            <div
              key={report.id}
              className="rounded-lg border border-gray-700 bg-gray-800 p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold underline">
                  <Link
                    href={`/games/${report.steamAppid}`}
                    className="transition-colors duration-300 hover:text-lime-400"
                  >
                    {report.gameName}
                  </Link>
                </h2>

                <div className="flex items-center gap-3">
                  <div
                    className={`shrink-0 rounded px-2 py-1 text-xs font-bold ${
                      report.tier
                        ? tierColors[
                            report.tier
                          ]
                        : tierColors.Pending
                    }`}
                  >
                    {getTierLabel(
                      report.tier ||
                        'Pending',
                      t
                    )}
                  </div>

                  <span className="text-sm italic text-gray-500">
                    {new Date(
                      report.createdAt
                    ).toLocaleDateString(
                      language === 'es'
                        ? 'es-ES'
                        : 'en-GB'
                    )}
                  </span>
                </div>
              </div>

              {!isEditing && (
                <>
                  <p className="mb-2 text-sm text-gray-400">
                    {report.distribution}
                    {' • '}
                    {report.protonVersion ??
                      'N/A'}
                  </p>

                  {report.comment && (
                    <div className="rounded bg-gray-900 p-3 text-gray-300">
                      <p className="whitespace-pre-line">
                        {report.comment}
                      </p>
                    </div>
                  )}

                  {deleteErrorReportId ===
                    report.id &&
                    deleteError && (
                      <div className="mt-3 rounded border border-red-700 bg-red-950 p-3 text-sm text-red-300">
                        {deleteError}
                      </div>
                    )}

                  {isOwnProfile && (
                    <div className="mt-4 flex justify-end gap-2">
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
                          setReportToDelete(
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
                    className="mt-4 space-y-4"
                  >
                    {error && (
                      <div className="rounded border border-red-700 bg-red-950 p-3 text-sm text-red-300">
                        {error}
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
                        value={editForm.tier}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            tier:
                              event.target
                                .value as Tier,
                          })
                        }
                        required
                        className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                      >
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
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            distribution:
                              event.target.value,
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
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            protonVersion:
                              event.target.value,
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
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            comment:
                              event.target.value,
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
                        disabled={saving}
                        className="rounded bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {saving
                          ? language === 'es'
                            ? 'Guardando...'
                            : 'Saving...'
                          : language === 'es'
                            ? 'Guardar cambios'
                            : 'Save Changes'}
                      </button>

                      <button
                        type="button"
                        onClick={
                          cancelEditing
                        }
                        disabled={saving}
                        className="rounded bg-gray-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
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
      </div>

      {reportToDelete !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              deletingReportId === null
            ) {
              setReportToDelete(null);
            }
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-950 text-2xl font-bold text-red-400">
              !
            </div>

            <h2 className="mt-4 text-xl font-bold text-white">
              {language === 'es'
                ? 'Eliminar informe'
                : 'Delete Report'}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-300">
              {language === 'es'
                ? '¿Seguro que quieres eliminar este informe? Esta acción es permanente y no se puede deshacer.'
                : 'Are you sure you want to delete this report? This action is permanent and cannot be undone.'}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setReportToDelete(null)
                }
                disabled={
                  deletingReportId !== null
                }
                className="rounded-lg bg-gray-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {language === 'es'
                  ? 'Cancelar'
                  : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(
                    reportToDelete
                  )
                }
                disabled={
                  deletingReportId !== null
                }
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingReportId !== null
                  ? language === 'es'
                    ? 'Eliminando...'
                    : 'Deleting...'
                  : language === 'es'
                    ? 'Eliminar informe'
                    : 'Delete Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}