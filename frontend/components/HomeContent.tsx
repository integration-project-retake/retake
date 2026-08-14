'use client';

import GameSearch from '@/components/GameSearch';
import { useLanguage } from '@/context/LanguageContext';
import type { GameDto } from '@/types';

interface HomeContentProps {
  games: GameDto[];
}

export default function HomeContent({ games }: HomeContentProps) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen p-8 text-foreground">
      <div className="theme-page-text mx-auto max-w-5xl">
        <h1 className=" mb-6 text-3xl font-bold">
          {t('games')}
        </h1>

        <GameSearch initialGames={games} />
      </div>
    </main>
  );
}