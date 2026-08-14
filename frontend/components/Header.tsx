'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import {
  useLanguage,
  LANGUAGES,
  LANGUAGE_LABELS,
  type Language,
} from '@/context/LanguageContext';
import { useTheme, type Theme } from '@/context/ThemeContext';
import AccountMenu from './AccountMenu';

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
    user?.avatarUrl?.trim() || 'https://www.gravatar.com/avatar/?d=mp';

  return (
    <header className="theme-header theme-border border-b p-4 transition-colors duration-200">
      <div className="flex w-full items-center justify-between">
        <Link href="/" className="ml-4 flex items-center gap-2">
          <img
            src="/logo_darkmode.png"
            alt=""
            width={40}
            height={40}
            className="logo-on-dark mr-1 h-10 w-10 shrink-0 [image-rendering:pixelated]"
          />
          <img
            src="/logo_lightmode.png"
            alt=""
            width={40}
            height={40}
            className="logo-on-light mr-1 h-10 w-10 shrink-0 [image-rendering:pixelated]"
          />
          <span className="theme-header-link text-xl font-bold transition-opacity hover:opacity-80">
            ProtonDB Clone
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/" className="theme-header-link px-4 py-2">
            {t('home')}
          </Link>

          {/* Language selector — options come from LANGUAGES, so adding a
              language never means touching this component again. */}
          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as Language)
            }
            className="theme-input cursor-pointer rounded border px-3 py-2 transition-colors"
            aria-label={t('language')}
          >
            {LANGUAGES.map((code) => (
              <option key={code} value={code}>
                {LANGUAGE_LABELS[code]}
              </option>
            ))}
          </select>

          {/* Theme selector */}
          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value as Theme)}
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
            <AccountMenu />
          ) : (
            <>
              <Link href="/login" className="theme-header-link px-4 py-2">
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