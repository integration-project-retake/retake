'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import UserService from '@/services/userService';
import { useLanguage } from '@/context/LanguageContext';

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [error, setError] = useState('');

  const router = useRouter();
  const { t } = useLanguage();

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!username.trim()) {
      errors.username = t('usernameRequired');
    }

    if (!email.trim()) {
      errors.email = t('emailRequired');
    } else {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email.trim())) {
        errors.email = t('invalidEmail');
      }
    }

    if (!password) {
      errors.password = t('passwordRequired');
    } else if (password.length < 6) {
      errors.password = t('passwordTooShort');
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
      await UserService.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      router.push('/login');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : '';

      if (
        message
          .toLowerCase()
          .includes('username') &&
        (
          message
            .toLowerCase()
            .includes('taken') ||
          message
            .toLowerCase()
            .includes('already')
        )
      ) {
        setFieldErrors((previous) => ({
          ...previous,
          username: t('usernameTaken'),
        }));

        return;
      }

      setError(
        t('registrationFailed')
      );
    }
  };

  const usernameHasError =
    Boolean(fieldErrors.username);

  const emailHasError =
    Boolean(fieldErrors.email);

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
          {t('createAccount')}
        </h1>

        {error && (
          <div className="rounded border border-red-800 bg-red-950 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label
            className="text-sm text-gray-300"
            htmlFor="username"
          >
            {t('username')}
          </label>

          <input
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);

              if (fieldErrors.username) {
                setFieldErrors((previous) => ({
                  ...previous,
                  username: undefined,
                }));
              }
            }}
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
            className="text-sm text-gray-300"
            htmlFor="email"
          >
            {t('email')}
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (fieldErrors.email) {
                setFieldErrors((previous) => ({
                  ...previous,
                  email: undefined,
                }));
              }
            }}
            className={`rounded border bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 ${
              emailHasError
                ? 'border-red-600 focus:ring-red-600'
                : 'border-gray-600 focus:ring-blue-500'
            }`}
            aria-invalid={emailHasError}
            aria-describedby={
              emailHasError
                ? 'email-error'
                : undefined
            }
          />

          {fieldErrors.email && (
            <p
              id="email-error"
              className="text-sm text-red-400"
            >
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-sm text-gray-300"
            htmlFor="password"
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
            }}
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
          className="mt-2 rounded bg-blue-600 p-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {t('register')}
        </button>

        <p className="mt-2 text-center text-sm text-gray-400">
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