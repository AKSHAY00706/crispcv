// Server-side in-memory rate limiter (resets on cold start)
// For production: swap Map for Redis / Upstash

interface RateLimitEntry { count: number; firstRequest: number }
const store = new Map<string, RateLimitEntry>();

const MAX     = parseInt(process.env.RATE_LIMIT_MAX        ?? "3");
const WINDOW  = parseInt(process.env.RATE_LIMIT_WINDOW_MS  ?? "3600000");

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
} {
  const now   = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.firstRequest > WINDOW) {
    store.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, remaining: MAX - 1, resetInMs: WINDOW };
  }

  if (entry.count >= MAX) {
    const resetInMs = WINDOW - (now - entry.firstRequest);
    return { allowed: false, remaining: 0, resetInMs };
  }

  entry.count += 1;
  store.set(ip, entry);
  return { allowed: true, remaining: MAX - entry.count, resetInMs: WINDOW - (now - entry.firstRequest) };
}
