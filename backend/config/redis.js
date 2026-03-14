import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  tls: { rejectUnauthorized: false },
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) return null;
    return Math.min(times * 200, 2000);
  },
});

redis.on("connect", () => {
  console.log("✅ Upstash Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

// Default TTL: 5 minutes
const DEFAULT_TTL = 300;

/**
 * Get cached data or fetch from source
 */
export const getOrSetCache = async (key, fetchFn, ttl = DEFAULT_TTL) => {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const freshData = await fetchFn();
    await redis.set(key, JSON.stringify(freshData), "EX", ttl);
    return freshData;
  } catch (error) {
    console.error("Redis cache error:", error.message);
    // Fallback to direct fetch if Redis fails
    return await fetchFn();
  }
};

/**
 * Invalidate cache keys matching a pattern
 */
export const invalidateCache = async (...keys) => {
  try {
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("Redis invalidation error:", error.message);
  }
};

/**
 * Invalidate all keys matching a pattern (using scan for Upstash safety)
 */
export const invalidatePattern = async (pattern) => {
  try {
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (error) {
    console.error("Redis pattern invalidation error:", error.message);
  }
};

export default redis;
