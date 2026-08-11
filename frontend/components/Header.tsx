'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="border-b border-gray-700 bg-gray-800 p-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          ProtonDB Clone
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/" className='px-4 py-2 text-gray-300 hover:text-white'>
            Home
          </Link>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
            className="cursor-pointer rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-600"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>

          {user ? (
            <>
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                {t('logout')}
              </button>

              <Link href={`/users/${user.id}`}>
                <img
                  src={user.avatarUrl || 'https://www.gravatar.com/avatar/?d=mp'}
                  alt={user.username}
                  className="w-9 h-9 rounded-full object-cover opacity-100 hover:opacity-80 transition-opacity"
                />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                {t('login')}
              </Link>

              <Link
                href="/register"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                {t('register')}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}