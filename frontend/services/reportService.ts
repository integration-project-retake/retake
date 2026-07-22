import { ReportDto, Tier } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchReports(): Promise<ReportDto[]> {
  const res = await fetch(`${API_BASE_URL}/reports`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}

export async function createReport(userId: number, gameId: number, tier: Tier, distribution: string): Promise<ReportDto> {
  const params = new URLSearchParams({
    userId: userId.toString(),
    gameId: gameId.toString(),
    tier,
    distribution,
  });

  const res = await fetch(`${API_BASE_URL}/reports?${params.toString()}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to create report');
  return res.json();
}
