"use server";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

async function buildContext(): Promise<string> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  try {
    const [gamesRes, reportsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/games`, { cache: "no-store" }),
      fetch(`${API_BASE_URL}/reports`, { cache: "no-store" }),
    ]);
    const games = await gamesRes.json();
    const reports = await reportsRes.json();

    return `
    GAMES IN THE DATABASE:
    ${JSON.stringify(games)}

    COMPATIBILITY REPORTS:
    ${JSON.stringify(reports)}
    `;
  } catch {
    return "No platform data available right now.";
  }
}

export async function sendChatRequest(
  messages: ChatMessage[],
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_API_KEY: Check your .env.local and restart.");
  }

  const context = await buildContext();

  const systemInstruction = `You are a helpful assistant for "retake", a ProtonDB-style archive of Linux game compatibility reports.
Answer questions about games, genres, compatibility tiers (Platinum, Gold, Silver, Bronze, Borked), and user reports.
Base your answers ONLY on the data provided below. If the data doesn't contain the answer, say you don't have enough information — do not make things up.

Tier meanings: Platinum = runs perfectly out of the box; Gold = runs perfectly after tweaks; Silver = runs with minor issues; Bronze = runs but with significant issues; Borked = does not run.

Keep answers concise and friendly.

${context}`;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "retake",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [{ role: "system", content: systemInstruction }, ...messages],
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter Error:", errorText);
    throw new Error(`OpenRouter Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response generated.";
}
