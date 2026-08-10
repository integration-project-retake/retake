'use client';

import GameSearch from '@/components/GameSearch';
import { useLanguage } from '@/context/LanguageContext';
import type { GameDto } from '@/types';
import Link from 'next/link';

interface HomeContentProps {
  games: GameDto[];
}

export default function HomeContent({ games }: HomeContentProps) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold">{t('games')}</h1>
        <GameSearch initialGames={games} />
      </div>
    </main>
  );
}