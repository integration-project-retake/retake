import { GameDto } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchGames(): Promise<GameDto[]> {
  const res = await fetch(`${API_BASE_URL}/games`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch games');
  return res.json();
}
