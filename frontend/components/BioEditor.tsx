'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function BioEditor({
  profileId,
  currentBio,
}: {
  profileId: number;
  currentBio: string | null;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(currentBio || '');

  const isOwner = user && user.id === profileId;

  const save = async () => {
    const params = new URLSearchParams({ bio });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${profileId}/profile?${params}`,
      {
        method: 'PATCH',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update bio');
    }

    setEditing(false);
    router.refresh();
  };

  return (
    <div className="w-full">
      {!editing ? (
        <div className="theme-surface relative rounded-xl border-2 border-indigo-500 bg-gray-800 p-5">
          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-200">
            {currentBio || 'No bio yet.'}
          </p>

          {isOwner && (
            <button
              onClick={() => setEditing(true)}
              className="absolute right-3 top-3 rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              Edit
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-indigo-500 bg-gray-800 p-4">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={190}
            placeholder="Tell people about yourself..."
            className="w-full resize-none bg-transparent text-sm text-white outline-none"
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {bio.length} / 190
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setBio(currentBio || '');
                  setEditing(false);
                }}
                className="rounded bg-gray-600 px-3 py-1.5 text-sm text-white hover:bg-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={save}
                className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}