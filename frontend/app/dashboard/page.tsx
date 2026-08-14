'use client';

import { useEffect, useState } from 'react';

import Dashboard from '@/components/Dashboard';

import type {
  DashboardStatsDto,
} from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8080';

export default function DashboardPage() {
  const [stats, setStats] =
    useState<DashboardStatsDto | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/dashboard`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load dashboard: ${response.status}`
          );
        }

        const data: DashboardStatsDto =
          await response.json();

        setStats(data);
      } catch (err) {
        console.error(
          'Failed to load dashboard:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load dashboard.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="theme-surface rounded-xl border p-8">
            <p className="theme-primary-text text-lg">
              Loading dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="theme-surface rounded-xl border p-8">
            <h1 className="theme-primary-text text-2xl font-bold">
              Dashboard
            </h1>

            <p className="mt-4 text-red-400">
              {error}
            </p>

            <p className="theme-secondary-text mt-2 text-sm">
              Make sure the backend is running and
              the /dashboard endpoint is available.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="theme-surface rounded-xl border p-8">
            <p className="theme-primary-text">
              No dashboard statistics available.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Dashboard stats={stats} />

      <div className="flex justify-center py-6">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
          className="theme-surface theme-primary-text rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-[var(--surface-hover)]"
        >
          ↑ Back to top
        </button>
      </div>
    </>
  );
}