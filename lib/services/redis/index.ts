import Redis from 'ioredis';

// Initialize Redis client
let redisClient: Redis | null = null;

/**
 * Get Redis client instance
 */
export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        // Retry with exponential backoff
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }
  
  return redisClient;
}

/**
 * Get cached data
 * @param key - Cache key
 * @returns Cached data or null if not found
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedisClient();
    const data = await redis.get(key);
    
    if (!data) return null;
    
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

/**
 * Set data in cache
 * @param key - Cache key
 * @param data - Data to cache
 * @param expiryInSeconds - Cache expiry time in seconds
 */
export async function setCachedData<T>(
  key: string,
  data: T,
  expiryInSeconds: number = 3600 // Default: 1 hour
): Promise<void> {
  try {
    const redis = getRedisClient();
    await redis.set(key, JSON.stringify(data), 'EX', expiryInSeconds);
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

/**
 * Delete cached data
 * @param key - Cache key
 */
export async function deleteCachedData(key: string): Promise<void> {
  try {
    const redis = getRedisClient();
    await redis.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

/**
 * Clear cache by pattern
 * @param pattern - Key pattern to match (e.g., "user:*")
 */
export async function clearCacheByPattern(pattern: string): Promise<void> {
  try {
    const redis = getRedisClient();
    const keys = await redis.keys(pattern);
    
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Redis clear pattern error:', error);
  }
}
