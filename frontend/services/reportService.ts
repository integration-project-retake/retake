import { ReportDto, Tier } from "../types";

const API_BASE_URL =
  typeof window === "undefined"
    ? "http://backend:8080"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
// forgive me for my sins

export async function fetchReports(): Promise<ReportDto[]> {
  const res = await fetch(`${API_BASE_URL}/reports`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}

export async function fetchReportsBySteamAppid(
  steamAppid: number,
): Promise<ReportDto[]> {
  const res = await fetch(`${API_BASE_URL}/reports/steam/${steamAppid}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch reports by Steam App ID");
  return res.json();
}

export async function fetchReportsByGameId(
  gameId: number,
): Promise<ReportDto[]> {
  const res = await fetch(`${API_BASE_URL}/reports/game/${gameId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch reports by Game ID");
  return res.json();
}

export async function fetchReportsByUser(userId: string): Promise<ReportDto[]> {
  const res = await fetch(`${API_BASE_URL}/reports/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}

export async function createReport(
  userId: number,
  gameId: number,
  tier: Tier,
  distribution: string,
  comment: string,
  protonVersion: string,
): Promise<ReportDto> {
  const params = new URLSearchParams({
    userId: userId.toString(),
    gameId: gameId.toString(),
    tier,
    distribution,
    comment,
    protonVersion,
  });

  const res = await fetch(
    `${API_BASE_URL}/reports?${params.toString()}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const message =
      await res.text();

    console.error(
      'Create report failed:',
      res.status,
      message
    );

    throw new Error(
      message ||
        'Failed to create report'
    );
  }

  return res.json();
}

export async function updateReport(
  reportId: number,
  userId: number,
  tier: Tier,
  distribution: string,
  comment: string,
  protonVersion: string
): Promise<ReportDto> {
  const params =
    new URLSearchParams({
      tier,
      distribution,
      comment,
      protonVersion,
    });

  const res = await fetch(
    `${API_BASE_URL}/reports/${reportId}?${params.toString()}`,
    {
      method: 'PUT',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const message =
      await res.text();

    console.error(
      'Update report failed:',
      res.status,
      message
    );

    throw new Error(
      message ||
        'Failed to update report'
    );
  }

  return res.json();
}

export async function deleteReport(
  reportId: number
): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/reports/${reportId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const message =
      await res.text();

    console.error(
      'Delete report failed:',
      res.status,
      message
    );

    throw new Error(
      message ||
        'Failed to delete report'
    );
  }
}