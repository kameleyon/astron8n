import { NextResponse } from 'next/server';
import { getCachedData, setCachedData, generateCacheKey } from '@/lib/services/redis/edge';

// Specify that this route should use the Edge Runtime
export const runtime = 'edge';

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

if (!OPENROUTER_API_KEY) {
  throw new Error('NEXT_PUBLIC_OPENROUTER_API_KEY environment variable is not set');
}

// Cache configuration
const CACHE_ENABLED = process.env.ENABLE_AI_CACHE !== 'false';
const CACHE_TTL = parseInt(process.env.AI_CACHE_TTL || '3600', 10); // Default: 1 hour

export async function POST(req: Request) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Parse request body
    const { messages, model = 'qwen/qwen-plus' } = await req.json();
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }
    
    // Check if user can use chat (has active subscription or trial)
    const subscriptionCheckResponse = await fetch(`${API_BASE_URL}/api/check-subscription`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    
    if (!subscriptionCheckResponse.ok) {
      const error = await subscriptionCheckResponse.json();
      console.error('Subscription check error:', error);
      return NextResponse.json(
        { error: 'Failed to verify subscription status' },
        { status: subscriptionCheckResponse.status }
      );
    }
    
    const subscriptionData = await subscriptionCheckResponse.json();
    
    // If user can't use chat, return error
    if (!subscriptionData.canUseChat) {
      return NextResponse.json(
        { 
          error: 'Subscription required',
          details: subscriptionData.isTrialActive 
            ? 'Your trial has expired. Please subscribe to continue using the chat.' 
            : 'You need an active subscription to use the chat feature.'
        },
        { status: 403 }
      );
    }
    
    // If user doesn't have enough credits, return error
    if (!subscriptionData.hasEnoughCredits) {
      return NextResponse.json(
        { 
          error: 'Insufficient credits',
          details: 'You have used all your available credits. Please upgrade your subscription for more credits.'
        },
        { status: 403 }
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
        'HTTP-Referer': API_BASE_URL,
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
    
    // Update user credits (this will be handled by a separate API call from the frontend)
    // The frontend will call the update-credits API after receiving the response
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Chat API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
