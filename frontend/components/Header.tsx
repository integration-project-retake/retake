'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const handleLogout = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

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
          <label className="sr-only" htmlFor="language-selector">
            {t('language')}
          </label>

          <select
            id="language-selector"
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as 'en' | 'es')
            }
            className="rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-gray-400 focus:outline-none"
          >
            <option value="en">{t('english')}</option>
            <option value="es">{t('spanish')}</option>
          </select>

          {user ? (
            <>
              <span className="text-gray-300">
                {t('welcome')}, {user.username}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-gray-300 transition-colors hover:text-white"
              >
                {t('login')}
              </Link>

              <Link
                href="/register"
                className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
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