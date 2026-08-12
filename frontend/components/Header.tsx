'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme, type Theme } from '@/context/ThemeContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const avatarUrl =
    user?.avatarUrl?.trim() ||
    'https://www.gravatar.com/avatar/?d=mp';

  return (
    <header className="theme-header theme-border border-b p-4 transition-colors duration-200">
      <div className="flex w-full items-center justify-between">
        <Link
          href="/"
          className="theme-primary-text text-xl font-bold transition-opacity hover:opacity-80"
        >
          ProtonDB Clone
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="theme-header-link px-4 py-2"
          >
            Home
          </Link>

          {/* Language selector */}
          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value as 'en' | 'es')
            }
            className="theme-input cursor-pointer rounded border px-3 py-2 transition-colors"
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>

          {/* Theme selector */}
          <select
            value={theme}
            onChange={(e) =>
              setTheme(e.target.value as Theme)
            }
            className="theme-input cursor-pointer rounded border px-3 py-2 transition-colors"
            aria-label="Select theme"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="scenic">Scenic</option>
            <option value="witcher">Witcher</option>
            <option value="rdr2">RDR2</option>
            <option value="gow">God of War</option>
          </select>

          {user ? (
            <>
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                {t('logout')}
              </button>

              <Link
                href={`/users/${user.id}`}
                className="flex items-center"
                aria-label={`${user.username} profile`}
              >
                <img
                  src={avatarUrl}
                  alt={user.username}
                  className="h-9 w-9 rounded-full border border-[var(--border-color)] object-cover opacity-100 transition-opacity hover:opacity-80"
                  onError={(event) => {
                    event.currentTarget.src =
                      'https://www.gravatar.com/avatar/?d=mp';
                  }}
                />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="theme-header-link px-4 py-2"
              >
                {t('login')}
              </Link>

              <Link
                href="/register"
                className="rounded bg-[var(--accent)] px-4 py-2 text-white transition-colors hover:bg-[var(--accent-hover)]"
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