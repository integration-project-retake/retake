import { GameDto } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export async function fetchGames(): Promise<GameDto[]> {
  const res = await fetch(`${API_BASE_URL}/games`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch games');
  return res.json();
}

export async function searchGames(query:string): Promise<GameDto[]>{
  const res = await fetch(`${API_BASE_URL}/games/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search games');
  return res.json();
}
