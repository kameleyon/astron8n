import { NextResponse } from 'next/server';
import { getCachedData, setCachedData, generateCacheKey } from '@/lib/services/redis/edge';

// Specify that this route should use the Edge Runtime
export const runtime = 'edge';

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error('NEXT_PUBLIC_OPENROUTER_API_KEY environment variable is not set');
}

// Cache configuration
const CACHE_ENABLED = process.env.ENABLE_AI_CACHE !== 'false';
const CACHE_TTL = parseInt(process.env.AI_CACHE_TTL || '3600', 10); // Default: 1 hour

export async function POST(req: Request) {
  try {
    const { messages, model = 'qwen/qwen-plus' } = await req.json();
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }
    
    // Check cache first if enabled
    if (CACHE_ENABLED) {
      const cacheKey = await generateCacheKey(messages);
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        console.log('Using cached chat response');
        return NextResponse.json(cachedData);
      }
    }

    // If not in cache or cache disabled, make the API call
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Chat API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Cache the response if caching is enabled
    if (CACHE_ENABLED) {
      const cacheKey = await generateCacheKey(messages);
      await setCachedData(cacheKey, data, CACHE_TTL);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Chat API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
