'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

import { updateReport, deleteReport } from '@/services/reportService';

import { getTierLabel } from '@/utils/tierLabels';

import type { ReportDto, Tier } from '@/types';

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

const REPORTS_PER_PAGE = 6;

export default function UserReportsList({
  profileId,
  reports,
}: UserReportsListProps) {
  const { user } = useAuth();
  const { locale, t } = useLanguage();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const [editingReportId, setEditingReportId] = useState<number | null>(
    null
  );

  const [editForm, setEditForm] = useState<EditForm | null>(null);

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deletingReportId, setDeletingReportId] = useState<number | null>(
    null
  );

  const [reportToDelete, setReportToDelete] = useState<number | null>(null);

  const [deleteErrorReportId, setDeleteErrorReportId] = useState<
    number | null
  >(null);

  const [deleteError, setDeleteError] = useState('');

  const isOwnProfile = user !== null && Number(user.id) === profileId;

  const totalPages = Math.max(
    1,
    Math.ceil(reports.length / REPORTS_PER_PAGE)
  );

  /*
   * If reports are deleted while the user is on the final page, make sure
   * they never remain on a page that no longer exists.
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;

  const paginatedReports = reports.slice(
    startIndex,
    startIndex + REPORTS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditing = (report: ReportDto) => {
    setError('');
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
    setError('');
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || editingReportId === null || editForm === null) {
      return;
    }

    setError('');

    if (
      !editForm.distribution.trim() ||
      !editForm.protonVersion.trim() ||
      !editForm.comment.trim()
    ) {
      setError(t('allFieldsRequired'));

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

      setError(t('updateReportFailed'));
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

  if (reports.length === 0) {
    return (
      <div className="theme-surface theme-border rounded-xl border border-dashed px-6 py-10 text-center transition-colors duration-200">
        <h3 className="theme-primary-text text-lg font-semibold">
          {t('noContributionsTitle')}
        </h3>

        <p className="theme-secondary-text mx-auto mt-2 max-w-md text-sm leading-6">
          {isOwnProfile
            ? t('noContributionsOwn')
            : t('noContributionsOther')}
        </p>

        {isOwnProfile && (
          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            {t('browseGames')}
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {paginatedReports.map((report) => {
          const isEditing = editingReportId === report.id;
          const isDeleting = deletingReportId === report.id;

          return (
            <div
              key={report.id}
              className="theme-surface theme-border rounded-lg border p-4 shadow-sm transition-colors duration-200"
            >
              <div className="mb-2 flex items-start justify-between gap-4">
                <h2 className="theme-primary-text text-lg font-semibold underline">
                  <Link
                    href={`/games/${report.steamAppid}`}
                    className="transition-colors duration-300 hover:text-[var(--accent)]"
                  >
                    {report.gameName}
                  </Link>
                </h2>

                <div className="flex items-center gap-3">
                  <div
                    className={`shrink-0 rounded px-2 py-1 text-xs font-bold ${
                      report.tier
                        ? tierColors[report.tier]
                        : tierColors.Pending
                    }`}
                  >
                    {getTierLabel(report.tier || 'Pending', t)}
                  </div>

                  <span className="theme-secondary-text text-sm italic">
                    {new Date(report.createdAt).toLocaleDateString(locale)}
                  </span>
                </div>
              </div>

              {!isEditing && (
                <>
                  <p className="theme-secondary-text mb-2 text-sm">
                    {report.distribution}
                    {' • '}
                    {report.protonVersion ?? 'N/A'}
                  </p>

                  {report.comment && (
                    <div className="theme-surface-secondary theme-border rounded border p-3">
                      <p className="theme-primary-text whitespace-pre-line">
                        {report.comment}
                      </p>
                    </div>
                  )}

                  {deleteErrorReportId === report.id && deleteError && (
                    <div className="mt-3 rounded border border-red-700 bg-red-950 p-3 text-sm text-red-300">
                      {deleteError}
                    </div>
                  )}

                  {isOwnProfile && (
                    <div className="mt-4 flex justify-end gap-2">
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
                        onClick={() => setReportToDelete(report.id)}
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
                <form onSubmit={handleUpdate} className="mt-4 space-y-4">
                  {error && (
                    <div className="rounded border border-red-700 bg-red-950 p-3 text-sm text-red-300">
                      {error}
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
                      className="theme-input w-full rounded border px-3 py-2 transition-colors focus:border-[var(--accent)] focus:outline-none"
                    >
                      <option value="Platinum">{t('platinum')}</option>
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
                      className="theme-input w-full rounded border px-3 py-2 transition-colors focus:border-[var(--accent)] focus:outline-none"
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
                      className="theme-input w-full rounded border px-3 py-2 transition-colors focus:border-[var(--accent)] focus:outline-none"
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
                      className="theme-input w-full resize-y rounded border px-3 py-2 transition-colors focus:border-[var(--accent)] focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? t('saving') : t('saveChanges')}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="theme-surface-secondary theme-border theme-primary-text rounded border px-4 py-2 font-semibold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="theme-surface theme-border theme-primary-text rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t('previous')}
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                aria-current={currentPage === page ? 'page' : undefined}
                className={
                  currentPage === page
                    ? 'rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white'
                    : 'theme-surface theme-border theme-primary-text rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--surface-hover)]'
                }
              >
                {page}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="theme-surface theme-border theme-primary-text rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t('next')}
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
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
          <div className="theme-surface theme-border w-full max-w-md rounded-xl border p-6 shadow-2xl">
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
                className="theme-surface-secondary theme-border theme-primary-text rounded-lg border px-4 py-2 font-semibold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
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
    </>
  );
}