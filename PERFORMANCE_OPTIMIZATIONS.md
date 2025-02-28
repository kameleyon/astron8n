# AstroGenie Performance Optimizations

This document outlines the performance optimizations implemented in the AstroGenie application to improve speed, responsiveness, and scalability.

## Frontend Optimizations

### 1. Incremental Static Regeneration (ISR)

ISR has been implemented for birth chart pages to improve loading times and reduce server load:

- Birth chart pages are statically generated and cached
- Pages are regenerated every 30 minutes (configurable)
- Suspense boundaries with loading states provide a smooth user experience

```typescript
// app/birth-chart/page.tsx
export const revalidate = 1800; // 30 minutes
```

### 2. React Query for API Caching

React Query has been integrated to cache API responses on the client side:

- Reduces redundant API calls
- Configurable stale time and garbage collection time
- Automatic refetching when data becomes stale

```typescript
// app/providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### 3. Web Workers for Astrology Calculations

Heavy astrology calculations have been offloaded to Web Workers:

- Prevents UI blocking during complex calculations
- Improves responsiveness of the application
- Enables parallel processing

```typescript
// hooks/useAstroWorker.ts
export function useBirthChart(birthData: any, enabled = true) {
  // ... worker initialization ...
  
  return useQuery({
    queryKey: ['birthChart', birthData],
    queryFn: async () => worker.calculateBirthChart(birthData),
    // ... configuration ...
  });
}
```

## Backend Optimizations

### 1. Redis Caching for AI Responses

Redis has been implemented to cache AI responses:

- Reduces API calls to OpenRouter
- Configurable cache TTL (Time To Live)
- Hash-based cache keys for efficient storage

```typescript
// app/api/openrouter/route.ts
if (CACHE_ENABLED) {
  const cacheKey = generateCacheKey(prompt);
  const cachedData = await getCachedData(cacheKey);
  
  if (cachedData) {
    console.log('Using cached OpenRouter response');
    return NextResponse.json(cachedData);
  }
}
```

### 2. Edge Functions for Real-time AI Chat

Edge Functions have been implemented for the chat API:

- Reduced latency by running closer to users
- Improved response times for real-time interactions
- Better global performance

```typescript
// app/api/chat/route.ts
export const runtime = 'edge';
```

### 3. PostgreSQL Query Optimization

Database indexes have been added to improve query performance:

- Faster lookups for user-related data
- Optimized joins and filtering operations
- Reduced database load

```sql
-- supabase/migrations/20250228_add_performance_indexes.sql
CREATE INDEX IF NOT EXISTS idx_birth_charts_user_id ON birth_charts(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
-- ... additional indexes ...
```

## Configuration

Performance optimizations can be configured through environment variables:

```
# Redis Cache
REDIS_URL=redis://localhost:6379
ENABLE_AI_CACHE=true
AI_CACHE_TTL=3600
```

## Future Optimizations

Potential future optimizations to consider:

1. Implement server-side streaming for AI responses
2. Add service worker for offline capabilities
3. Implement database connection pooling for better scalability
4. Add CDN caching for static assets
5. Implement database query result caching
