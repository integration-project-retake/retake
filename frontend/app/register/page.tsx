'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserService from '@/services/userService';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await UserService.register({ username, email, password });
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg flex flex-col gap-4 w-full max-w-md border border-gray-700">
        <h1 className="text-white text-2xl font-bold mb-2">Create an Account</h1>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-500 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm" htmlFor="username">Username</label>
          <input
            id="username"
            className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm" htmlFor="email">Email</label>
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
          <label className="text-gray-300 text-sm" htmlFor="password">Password</label>
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

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors mt-2 font-semibold">
          Register
        </button>

        <p className="text-gray-400 text-sm text-center mt-2">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:text-blue-400">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
