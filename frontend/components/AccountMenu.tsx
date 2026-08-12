'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AccountMenu() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center"
        aria-label="Account menu"
      >
        <img
          src={user.avatarUrl || 'https://www.gravatar.com/avatar/?d=mp'}
          alt={user.username}
          className="h-9 w-9 rounded-full object-cover opacity-90 transition-opacity hover:opacity-100"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-700 bg-gray-800 py-1 shadow-xl">
          <Link
            href={`/users/${user.id}`}
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            {t('profile') || 'Profile'}
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700"
          >
            {t('logout') || 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
}