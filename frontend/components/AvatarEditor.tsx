'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AvatarEditor({ profileId, currentAvatar, username }: { profileId: number }) {
  const { user } = useAuth();
  const [url, setUrl] = useState('');

  if (!user || user.id !== profileId) return null;

  const save = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${profileId}/avatar?avatarUrl=${encodeURIComponent(url)}`,
      { method: 'PATCH' }
    );
    window.location.reload();
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Image URL"
        className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
      />
      <button onClick={save} className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white">
        Set avatar
      </button>
    </div>
  );
}