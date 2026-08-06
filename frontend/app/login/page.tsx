'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { language, t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ username, password });
      router.push('/');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === 'es'
          ? 'Error al iniciar sesión.'
          : 'Login failed.'
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg flex flex-col gap-4 min-w-75"
      >
        <h1 className="text-white text-2xl font-bold">{t('login')}</h1>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-500 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <input
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={
            language === 'es' ? 'Nombre de usuario' : 'Username'
          }
          required
        />

        <input
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={
            language === 'es' ? 'Contraseña' : 'Password'
          }
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
        >
          {t('login')}
        </button>
      </form>
    </main>
  );
}