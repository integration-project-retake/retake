'use client';

import { useEffect, useState } from 'react';

import { fetchPlayerCount } from '@/services/gameService';

const REFRESH_INTERVAL_MS = 60_000;

export default function PlayerCount({
  steamAppid,
}: {
  steamAppid: number;
}) {
  const [count, setCount] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [failed, setFailed] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPlayerCount = async () => {
      const playerCount =
        await fetchPlayerCount(steamAppid);

      if (cancelled) {
        return;
      }

      if (playerCount === null) {
        setFailed(true);
        setLoading(false);

        return;
      }

      setCount(playerCount);
      setFailed(false);
      setLoading(false);
    };

    void loadPlayerCount();

    const intervalId = window.setInterval(
      () => {
        void loadPlayerCount();
      },
      REFRESH_INTERVAL_MS
    );

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [steamAppid]);

  if (loading) {
    return (
      <p className="mt-3 text-sm text-gray-500">
        Loading player count…
      </p>
    );
  }

  if (failed || count === null) {
    return (
      <p className="mt-3 text-sm text-gray-500">
        Player count unavailable
      </p>
    );
  }

  return (
    <p className="mt-3 text-sm text-green-400">
      ● {count.toLocaleString()} players online now
    </p>
  );
}