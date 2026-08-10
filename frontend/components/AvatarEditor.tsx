'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AvatarEditor({ profileId, currentAvatar, username }: 
    {
        profileId: number;
        currentAvatar: string | null;
        username: string;

    }) {  
        const { user } = useAuth();
        const [editing, setEditing] = useState(false);
        const [url, setUrl] = useState('');

        const isOwner = user && user.id === profileId;
    if (!user || user.id !== profileId) return null;

    const save = async () => {
        await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${profileId}/avatar?avatarUrl=${encodeURIComponent(url)}`,
        { method: 'PATCH' }
        );
        window.location.reload();
    };
    const remove = async () => {
        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${profileId}/avatar?avatarUrl=`,
            { method: 'PATCH' }
        );
        window.location.reload();
    };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-20 h-20 group">
        <img
          src={currentAvatar || 'https://www.gravatar.com/avatar/?d=mp'}
          alt={username}
          className="w-20 h-20 rounded-full object-cover border border-gray-700"
        />
        {isOwner && (
          <button
            onClick={() => setEditing(!editing)}
            className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium"
          >
            Change
          </button>
        )}
        </div>

    {isOwner && editing && (
        <div className="flex gap-2 flex-wrap">
            <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Image URL"
            className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white text-sm"
            />
            <button onClick={save} className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white text-sm">
            Save
            </button>
            {currentAvatar && (
                <button onClick={remove} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm">
                    Remove
                </button>
            )}
        </div>

    )}
    </div>
    );
};