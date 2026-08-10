'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface FieldErrors {
  username?: string;
  password?: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [error, setError] = useState('');

  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!username.trim()) {
      errors.username = t('usernameRequired');
    }

    if (!password) {
      errors.password = t('passwordRequired');
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await login({
        username: username.trim(),
        password,
      });

      router.push('/');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.toLowerCase()
          : '';

      if (
        message.includes('invalid') ||
        message.includes('authentication') ||
        message.includes('credential') ||
        message.includes('unauthorized')
      ) {
        setError(
          t('invalidCredentials')
        );

        return;
      }

      setError(
        t('loginFailed')
      );
    }
  };

  const usernameHasError =
    Boolean(fieldErrors.username);

  const passwordHasError =
    Boolean(fieldErrors.password);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 p-8 text-white">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-gray-700 bg-gray-800 p-8"
      >
        <h1 className="text-2xl font-bold">
          {t('login')}
        </h1>

        {error && (
          <div className="rounded border border-red-800 bg-red-950 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label
            htmlFor="username"
            className="text-sm text-gray-300"
          >
            {t('username')}
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);

              if (fieldErrors.username) {
                setFieldErrors((previous) => ({
                  ...previous,
                  username: undefined,
                }));
              }

              if (error) {
                setError('');
              }
            }}
            placeholder={t('username')}
            className={`rounded border bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 ${
              usernameHasError
                ? 'border-red-600 focus:ring-red-600'
                : 'border-gray-600 focus:ring-blue-500'
            }`}
            aria-invalid={usernameHasError}
            aria-describedby={
              usernameHasError
                ? 'username-error'
                : undefined
            }
          />

          {fieldErrors.username && (
            <p
              id="username-error"
              className="text-sm text-red-400"
            >
              {fieldErrors.username}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm text-gray-300"
          >
            {t('password')}
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

              if (fieldErrors.password) {
                setFieldErrors((previous) => ({
                  ...previous,
                  password: undefined,
                }));
              }

              if (error) {
                setError('');
              }
            }}
            placeholder={t('password')}
            className={`rounded border bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 ${
              passwordHasError
                ? 'border-red-600 focus:ring-red-600'
                : 'border-gray-600 focus:ring-blue-500'
            }`}
            aria-invalid={passwordHasError}
            aria-describedby={
              passwordHasError
                ? 'password-error'
                : undefined
            }
          />

          {fieldErrors.password && (
            <p
              id="password-error"
              className="text-sm text-red-400"
            >
              {fieldErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 p-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {t('login')}
        </button>
      </form>
    </main>
  );
}