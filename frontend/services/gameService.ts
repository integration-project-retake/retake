import type { GameDto } from "../types";

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL_INTERNAL || "http://localhost:8080"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
// forgive me for my sins

export async function fetchGames(): Promise<GameDto[]> {
  const res = await fetch(`${API_BASE_URL}/games`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch games");
  }

  return res.json();
}

export async function searchGames(query: string): Promise<GameDto[]> {
  const res = await fetch(
    `${API_BASE_URL}/games/search?query=${encodeURIComponent(query)}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to search games");
  }

  return res.json();
}

export async function fetchGameBySteamAppid(
  steamAppid: number,
): Promise<GameDto> {
  const games = await fetchGames();

  const game = games.find((game) => game.steamAppid === steamAppid);

  if (!game) {
    throw new Error(`Game with Steam App ID ${steamAppid} was not found`);
  }

  return game;
}

export async function fetchRelatedGames(gameId: number): Promise<GameDto[]> {
  const res = await fetch(`${API_BASE_URL}/games/${gameId}/related`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch related games");
  }

  return res.json();
}
