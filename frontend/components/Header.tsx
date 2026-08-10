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
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold text-white">
          ProtonDB Clone
        </Link>

        <nav className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`cursor-pointer rounded px-3 py-2 ${
              language === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            English
          </button>

          <button
            type="button"
            onClick={() => setLanguage('es')}
            className={`cursor-pointer rounded px-3 py-2 ${
              language === 'es'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Español
          </button>

          {user ? (
            <>
              <Link href={`users/${user.id}`} className="rounded bg-lime-400 px-4 py-2 text-white hover:bg-lime-500">
                {t('welcome')}, {user.username}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                {t('logout')}
              </button>
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