/**
 * Minimal key-value storage for editable site config.
 *
 * Persistence strategy:
 *   - If UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set,
 *     we use Upstash Redis (free tier: 10K commands/day, more than
 *     enough for the admin → write, public → read use case).
 *   - Otherwise we fall back to an in-process Map. Works locally and on
 *     a single warm serverless instance, but writes are LOST when the
 *     function recycles. Good for local dev / first-look demos; not
 *     suitable for actual production use without Upstash configured.
 *
 * The `isPersistent` flag lets the admin UI surface a warning banner
 * when no real persistence is wired up.
 */

import { Redis } from "@upstash/redis";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
if (UPSTASH_URL && UPSTASH_TOKEN) {
  redis = new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN });
}

// In-memory fallback. Module-scoped Map persists across requests in the
// same warm serverless instance.
const memory = new Map<string, string>();

export const isPersistent = redis !== null;

export async function kvGet<T = unknown>(key: string): Promise<T | null> {
  if (redis) {
    // Upstash auto-JSON-parses if you stored an object originally.
    return (await redis.get<T>(key)) ?? null;
  }
  const raw = memory.get(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

export async function kvSet<T = unknown>(
  key: string,
  value: T
): Promise<void> {
  if (redis) {
    await redis.set(key, value);
    return;
  }
  memory.set(key, JSON.stringify(value));
}

export async function kvDel(key: string): Promise<void> {
  if (redis) {
    await redis.del(key);
    return;
  }
  memory.delete(key);
}
