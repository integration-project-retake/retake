'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { createReport } from '@/services/reportService';

import type { Tier } from '@/types';

interface SubmitReportFormProps {
  gameId: number;
}

interface FieldErrors {
  distribution?: string;
  protonVersion?: string;
  comment?: string;
}

export default function SubmitReportForm({
  gameId,
}: SubmitReportFormProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [tier, setTier] =
    useState<Tier>('Gold');

  const [
    distribution,
    setDistribution,
  ] = useState('');

  const [
    protonVersion,
    setProtonVersion,
  ] = useState('');

  const [
    comment,
    setComment,
  ] = useState('');

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState<FieldErrors>({});

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState('');

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!distribution.trim()) {
      errors.distribution =
        t('distributionRequired');
    }

    if (!protonVersion.trim()) {
      errors.protonVersion =
        t('protonVersionRequired');
    }

    if (!comment.trim()) {
      errors.comment =
        t('commentRequired');
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!user) {
      router.push('/login');
      return;
    }

    if (!validateForm()) {
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

      setSuccess(
        t('reportSubmittedSuccessfully')
      );

      setTier('Gold');
      setDistribution('');
      setProtonVersion('');
      setComment('');
      setFieldErrors({});

      router.refresh();
    } catch (err) {
      console.error(
        'Failed to submit report:',
        err
      );

      setError(
        t('reportSubmissionFailed')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const distributionHasError =
    Boolean(
      fieldErrors.distribution
    );

  const protonVersionHasError =
    Boolean(
      fieldErrors.protonVersion
    );

  const commentHasError =
    Boolean(
      fieldErrors.comment
    );

  if (!user) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-4 text-2xl font-bold">
          {t('submitReport')}
        </h2>

        <p className="mb-4 text-gray-400">
          {t(
            'loginRequiredForReport'
          )}
        </p>

        <button
          type="button"
          onClick={() =>
            router.push('/login')
          }
          className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          {t('login')}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-lg border border-gray-700 bg-gray-800 p-6"
    >
      <h2 className="mb-4 text-2xl font-bold">
        {t('submitReport')}
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
          {t(
            'compatibilityRating'
          )}
        </label>

        <select
          id="tier"
          value={tier}
          onChange={(event) =>
            setTier(
              event.target
                .value as Tier
            )
          }
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

      <div className="mb-4">
        <label
          htmlFor="distribution"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          {t(
            'linuxDistribution'
          )}
        </label>

        <input
          id="distribution"
          type="text"
          value={distribution}
          onChange={(event) => {
            setDistribution(
              event.target.value
            );

            if (
              fieldErrors.distribution
            ) {
              setFieldErrors(
                (previous) => ({
                  ...previous,
                  distribution:
                    undefined,
                })
              );
            }

            if (error) {
              setError('');
            }
          }}
          placeholder={t(
            'distributionPlaceholder'
          )}
          aria-invalid={
            distributionHasError
          }
          aria-describedby={
            distributionHasError
              ? 'distribution-error'
              : undefined
          }
          className={`w-full rounded border bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none ${
            distributionHasError
              ? 'border-red-600 focus:border-red-600'
              : 'border-gray-600 focus:border-blue-500'
          }`}
        />

        {fieldErrors.distribution && (
          <p
            id="distribution-error"
            className="mt-1 text-sm text-red-400"
          >
            {
              fieldErrors.distribution
            }
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="protonVersion"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          {t('protonVersion')}
        </label>

        <input
          id="protonVersion"
          type="text"
          value={protonVersion}
          onChange={(event) => {
            setProtonVersion(
              event.target.value
            );

            if (
              fieldErrors.protonVersion
            ) {
              setFieldErrors(
                (previous) => ({
                  ...previous,
                  protonVersion:
                    undefined,
                })
              );
            }

            if (error) {
              setError('');
            }
          }}
          placeholder={t(
            'protonVersionPlaceholder'
          )}
          aria-invalid={
            protonVersionHasError
          }
          aria-describedby={
            protonVersionHasError
              ? 'proton-version-error'
              : undefined
          }
          className={`w-full rounded border bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none ${
            protonVersionHasError
              ? 'border-red-600 focus:border-red-600'
              : 'border-gray-600 focus:border-blue-500'
          }`}
        />

        {fieldErrors.protonVersion && (
          <p
            id="proton-version-error"
            className="mt-1 text-sm text-red-400"
          >
            {
              fieldErrors.protonVersion
            }
          </p>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="comment"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          {t('comment')}
        </label>

        <textarea
          id="comment"
          value={comment}
          onChange={(event) => {
            setComment(
              event.target.value
            );

            if (
              fieldErrors.comment
            ) {
              setFieldErrors(
                (previous) => ({
                  ...previous,
                  comment:
                    undefined,
                })
              );
            }

            if (error) {
              setError('');
            }
          }}
          placeholder={t(
            'commentPlaceholder'
          )}
          rows={5}
          aria-invalid={
            commentHasError
          }
          aria-describedby={
            commentHasError
              ? 'comment-error'
              : undefined
          }
          className={`w-full resize-y rounded border bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none ${
            commentHasError
              ? 'border-red-600 focus:border-red-600'
              : 'border-gray-600 focus:border-blue-500'
          }`}
        />

        {fieldErrors.comment && (
          <p
            id="comment-error"
            className="mt-1 text-sm text-red-400"
          >
            {fieldErrors.comment}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting
          ? t(
              'submittingReport'
            )
          : t(
              'submitReportButton'
            )}
      </button>
    </form>
  );
}