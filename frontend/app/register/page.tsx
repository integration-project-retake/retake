'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserService from '@/services/userService';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await UserService.register({ username, email, password });
      router.push('/login');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('registrationError')
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-gray-700 bg-gray-800 p-8"
      >
        <h1 className="text-2xl font-bold text-white">
          {t('createAccount')}
        </h1>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-500 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label
            className="text-gray-300 text-sm"
            htmlFor="username"
          >
            {t('username')}
          </label>

          <input
            id="username"
            className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-gray-300 text-sm"
            htmlFor="email"
          >
            {t('email')}
          </label>

          <input
            id="email"
            type="email"
            className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-gray-300 text-sm"
            htmlFor="password"
          >
            {t('password')}
          </label>

          <input
            id="password"
            type="password"
            className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors mt-2 font-semibold"
        >
          {t('register')}
        </button>

        <p className="text-gray-400 text-sm text-center mt-2">
          {t('alreadyHaveAccount')}{' '}
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-400"
          >
            {t('login')}
          </Link>
        </p>
      </form>
    </main>
  );
}