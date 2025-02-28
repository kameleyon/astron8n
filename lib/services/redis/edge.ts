/**
 * Redis client for Edge Runtime
 * This is a simplified version of the Redis client that works in Edge Runtime
 * It doesn't use ioredis which requires Node.js-specific modules
 */

// Cache key generation using Web Crypto API instead of Node.js crypto
export async function generateCacheKey(data: any): Promise<string> {
  const msgUint8 = new TextEncoder().encode(JSON.stringify(data));
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Simple in-memory cache for development/testing
// In production, this should be replaced with a real Redis client or other caching solution
const memoryCache: Record<string, { data: any; expiry: number }> = {};

/**
 * Get cached data
 * @param key - Cache key
 * @returns Cached data or null if not found
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    // For Edge Runtime, we'll use KV store in production
    // For now, use a simple in-memory cache
    const cacheEntry = memoryCache[key];
    
    if (!cacheEntry) return null;
    
    // Check if cache entry has expired
    if (cacheEntry.expiry < Date.now()) {
      delete memoryCache[key];
      return null;
    }
    
    return cacheEntry.data as T;
  } catch (error) {
    console.error('Cache get error:', error);
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
    // For Edge Runtime, we'll use KV store in production
    // For now, use a simple in-memory cache
    memoryCache[key] = {
      data,
      expiry: Date.now() + (expiryInSeconds * 1000)
    };
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * Delete cached data
 * @param key - Cache key
 */
export async function deleteCachedData(key: string): Promise<void> {
  try {
    delete memoryCache[key];
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}
