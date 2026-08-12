'use client';

import { useState, useEffect } from 'react';

export default function PlayerCount({ steamAppid }: { steamAppid: number }) {
  const [count, setCount] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${steamAppid}/players`)
      .then((res) => res.json())
      .then((data) => {
        if (data.playerCount >= 0) setCount(data.playerCount);
        else setFailed(true);
      })
      .catch(() => setFailed(true));
  }, [steamAppid]);

  if (failed) {
    return <p className="text-gray-500 text-sm">Player count unavailable</p>;
  }
  if (count === null) {
    return <p className="text-gray-500 text-sm">Loading player count…</p>;
  }
  return (
    <p className="text-green-400 text-sm mt-3">
      ● {count.toLocaleString()} players online now
    </p>
  );
}