// Fetches CPNT brand knowledge from Upstash Redis.
// Knowledge is synced by running: npm run sync:brand
// Key: meeting:brand:knowledge — no TTL, persists until next sync.

import { Redis } from '@upstash/redis';

const REDIS_KEY = 'meeting:brand:knowledge';

export async function fetchBrandKnowledge(): Promise<string> {
  const url   = process.env.UPSTASH_REDIS_REST_URL?.trim()   ?? '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ?? '';
  if (!url || !token) return '';

  try {
    const redis     = new Redis({ url, token });
    const knowledge = await redis.get<string>(REDIS_KEY);
    return knowledge ?? '';
  } catch {
    return '';
  }
}

export async function saveBrandKnowledge(content: string): Promise<void> {
  const url   = process.env.UPSTASH_REDIS_REST_URL?.trim()   ?? '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ?? '';
  if (!url || !token) throw new Error('Missing UPSTASH_REDIS_REST_URL / TOKEN');

  const redis = new Redis({ url, token });
  await redis.set(REDIS_KEY, content);  // no TTL — persists until next sync
}
