export async function scrapePortfolio(url: string): Promise<string> {
  // Use Gemini URL context — pass URL directly; Gemini fetches it
  // Fallback: fetch + strip HTML tags
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "CrispCV-Roaster/1.0 (+https://crispCV.app)" },
      signal:  AbortSignal.timeout(10_000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi,  "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 12_000);
  } catch (err) {
    throw new Error(`Could not fetch portfolio: ${(err as Error).message}`);
  }
}
