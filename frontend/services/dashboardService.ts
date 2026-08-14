import type {
  DashboardStatsDto,
} from '@/types';

const API_BASE_URL =
  typeof window === 'undefined'
    ? process.env.INTERNAL_API_URL ||
      'http://localhost:8080'
    : process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:8080';

export async function fetchDashboardStats():
  Promise<DashboardStatsDto> {
  const response = await fetch(
    `${API_BASE_URL}/dashboard`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error(
      'Failed to fetch dashboard statistics'
    );
  }

  return response.json();
}