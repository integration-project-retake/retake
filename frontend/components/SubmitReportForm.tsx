'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createReport } from '@/services/reportService';
import type { Tier } from '@/types';

interface SubmitReportFormProps {
  gameId: number;
}

export default function SubmitReportForm({
  gameId,
}: SubmitReportFormProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [tier, setTier] = useState<Tier>('Gold');
  const [distribution, setDistribution] = useState('');
  const [comment, setComment] = useState('');
  const [protonVersion, setProtonVersion] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!user) {
      router.push('/login');
      return;
    }

    if (!distribution.trim()) {
      setError('Distribution is required.');
      return;
    }

    try {
      setSubmitting(true);

      await createReport(
        user.id,
        gameId,
        tier,
        distribution.trim(),
        comment.trim(),
        protonVersion.trim()
      );

      setSuccess('Report submitted successfully.');

      setTier('Gold');
      setDistribution('');
      setComment('');
      setProtonVersion('');

      router.refresh();
    } catch (err) {
      console.error('Failed to submit report:', err);
      setError('Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-2 text-xl font-bold text-white">
          Submit a Report
        </h2>

        <p className="mb-4 text-gray-400">
          You must be logged in to submit a compatibility report.
        </p>

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-700 bg-gray-800 p-6"
    >
      <h2 className="mb-6 text-2xl font-bold text-white">
        Submit a Report
      </h2>

      {error && (
        <div className="mb-4 rounded border border-red-700 bg-red-950 p-3 text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded border border-green-700 bg-green-950 p-3 text-green-200">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="tier"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Compatibility Rating
        </label>

        <select
          id="tier"
          value={tier}
          onChange={(event) =>
            setTier(event.target.value as Tier)
          }
          className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="Platinum">Platinum</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
          <option value="Bronze">Bronze</option>
          <option value="Borked">Borked</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="distribution"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Linux Distribution
        </label>

        <input
          id="distribution"
          type="text"
          value={distribution}
          onChange={(event) =>
            setDistribution(event.target.value)
          }
          placeholder="e.g. Ubuntu, Fedora, Arch"
          required
          className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="protonVersion"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Proton Version
        </label>

        <input
          id="protonVersion"
          type="text"
          value={protonVersion}
          onChange={(event) =>
            setProtonVersion(event.target.value)
          }
          placeholder="e.g. 9.0-3"
          className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="comment"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Comment
        </label>

        <textarea
          id="comment"
          value={comment}
          onChange={(event) =>
            setComment(event.target.value)
          }
          placeholder="Describe your experience running this game..."
          rows={5}
          className="w-full resize-y rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
}