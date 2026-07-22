/**
 * Minimal in-memory rate limiter. Good enough for a single-process $5 VPS deployment;
 * swap for Redis/Upstash only if you ever scale to multiple app instances.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return true;
}

// Periodically evict stale buckets so memory doesn't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of buckets.entries()) {
    const fresh = timestamps.filter((t) => now - t < 15 * 60 * 1000);
    if (fresh.length === 0) buckets.delete(key);
    else buckets.set(key, fresh);
  }
}, 5 * 60 * 1000).unref();
