'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

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

  return (
    <header className="bg-gray-800 p-4">
      <div className="flex w-full items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-white"
        >
          ProtonDB Clone
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Home
          </Link>


          {/* Language selector */}
          <select
            value={language}
            onChange={(e) =>
             
              setLanguage(
                e.target.value as 'en' | 'es'
              )
            
            }
            className="cursor-pointer rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-600"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>

          {/* Theme selector */}
          <select
            value={theme}
            onChange={(e) =>
              setTheme(
                e.target.value as 'dark' | 'light' | 'scenic'
              )
            }
            className="cursor-pointer rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-600"
            aria-label="Select theme"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="scenic">Scenic</option>
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
                  src={
                    
                    user.avatarUrl ||
                   
                    'https://www.gravatar.com/avatar/?d=mp'
                  
                  }
                  alt={user.username}
                  className="h-9 w-9 rounded-full object-cover opacity-100 transition-opacity hover:opacity-80"
                  className="h-9 w-9 rounded-full object-cover opacity-100 transition-opacity hover:opacity-80"
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