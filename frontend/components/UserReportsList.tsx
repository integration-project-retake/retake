'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import { updateReport } from '@/services/reportService';

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

export default function UserReportsList({
  profileId,
  reports,
}: UserReportsListProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [editingReportId, setEditingReportId] =
    useState<number | null>(null);

  const [editForm, setEditForm] =
    useState<EditForm | null>(null);

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const tierColors: Record<string, string> = {
    Platinum: 'bg-blue-200 text-blue-900',
    Gold: 'bg-yellow-400 text-yellow-900',
    Silver: 'bg-gray-300 text-gray-900',
    Bronze: 'bg-orange-500 text-orange-950',
    Borked: 'bg-red-600 text-white',
    Pending: 'bg-gray-600 text-gray-300',
  };

  const isOwnProfile =
    user !== null &&
    Number(user.id) === profileId;

  const startEditing = (report: ReportDto) => {
    setError('');

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
      setError('All fields are required.');
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
        err instanceof Error
          ? err.message
          : 'Failed to update report.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (reports.length === 0) {
    return (
      <div className="rounded-lg border border-gray-700 p-6 text-center text-gray-400">
        No reports yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => {
        const isEditing =
          editingReportId === report.id;

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
                      ? tierColors[report.tier]
                      : tierColors.Pending
                  }`}
                >
                  {report.tier}
                </div>

                <span className="text-sm italic text-gray-500">
                  {new Date(
                    report.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>

            {!isEditing && (
              <>
                <p className="mb-2 text-sm text-gray-400">
                  {report.distribution} •{' '}
                  {report.protonVersion ?? 'N/A'}
                </p>

                {report.comment && (
                  <p className="whitespace-pre-line text-gray-300">
                    {report.comment}
                  </p>
                )}

                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() =>
                      startEditing(report)
                    }
                    className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Edit
                  </button>
                )}
              </>
            )}

            {isEditing && editForm && (
              <form
                onSubmit={handleUpdate}
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
                    Compatibility Rating
                  </label>

                  <select
                    id={`tier-${report.id}`}
                    value={editForm.tier}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        tier: event.target
                          .value as Tier,
                      })
                    }
                    required
                    className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Platinum">
                      Platinum
                    </option>

                    <option value="Gold">
                      Gold
                    </option>

                    <option value="Silver">
                      Silver
                    </option>

                    <option value="Bronze">
                      Bronze
                    </option>

                    <option value="Borked">
                      Borked
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`distribution-${report.id}`}
                    className="mb-1 block text-sm font-medium text-gray-300"
                  >
                    Linux Distribution
                  </label>

                  <input
                    id={`distribution-${report.id}`}
                    type="text"
                    value={editForm.distribution}
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
                    Proton Version
                  </label>

                  <input
                    id={`proton-${report.id}`}
                    type="text"
                    value={editForm.protonVersion}
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
                    Comment
                  </label>

                  <textarea
                    id={`comment-${report.id}`}
                    value={editForm.comment}
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
                      ? 'Saving...'
                      : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="rounded bg-gray-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        );
      })}
    </div>
  );
}