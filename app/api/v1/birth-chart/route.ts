import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateBirthChart } from '../../../../birthchartpack/lib/services/astro/calculator';

// Initialize Supabase client inside the route handler to avoid build-time errors
const getSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

// Mark this route as dynamic and use Node.js runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Validate API key
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        error: 'Missing or invalid authorization header',
        details: 'API key must be provided in the Authorization header as "Bearer YOUR_API_KEY"',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const apiKey = authHeader.split(' ')[1];
    if (!apiKey || !apiKey.startsWith('ag_')) {
      return NextResponse.json({
        error: 'Invalid API key format',
        details: 'API key must start with "ag_"',
        code: 'INVALID_API_KEY'
      }, { status: 401 });
    }

    // Get Supabase client
    const supabase = getSupabaseClient();

    // Check if API key exists and is enabled
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('id, user_id, enabled, usage_count, rate_limit')
      .eq('api_key', apiKey)
      .single();

    if (apiKeyError || !apiKeyData) {
      return NextResponse.json({
        error: 'Invalid API key',
        details: 'The provided API key does not exist',
        code: 'INVALID_API_KEY'
      }, { status: 401 });
    }

    if (!apiKeyData.enabled) {
      return NextResponse.json({
        error: 'API key disabled',
        details: 'This API key has been disabled',
        code: 'API_KEY_DISABLED'
      }, { status: 403 });
    }

    // Check rate limit
    if (apiKeyData.usage_count >= apiKeyData.rate_limit) {
      return NextResponse.json({
        error: 'Rate limit exceeded',
        details: `You have exceeded your monthly limit of ${apiKeyData.rate_limit} requests`,
        code: 'RATE_LIMIT_EXCEEDED'
      }, { status: 429 });
    }

    // Parse request body
    let body: {
      name: string;
      date: string;
      time: string;
      location: string;
      latitude: number;
      longitude: number;
    };

    try {
      body = await request.json();
    } catch (err) {
      const error = err as Error;
      return NextResponse.json({
        error: 'Invalid request body format',
        details: error.message,
        code: 'INVALID_REQUEST'
      }, { status: 400 });
    }

    // Validate required fields
    const requiredFields = ['name', 'date', 'time', 'location', 'latitude', 'longitude'];
    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json({
          error: 'Missing required field',
          details: `The field "${field}" is required`,
          code: 'MISSING_FIELD'
        }, { status: 400 });
      }
    }

    // Validate field values
    if (typeof body.latitude !== 'number' || typeof body.longitude !== 'number') {
      return NextResponse.json({
        error: 'Invalid coordinates',
        details: 'Latitude and longitude must be numbers',
        code: 'INVALID_COORDINATES'
      }, { status: 400 });
    }

    if (body.latitude < -90 || body.latitude > 90) {
      return NextResponse.json({
        error: 'Invalid latitude',
        details: 'Latitude must be between -90 and 90 degrees',
        code: 'INVALID_LATITUDE'
      }, { status: 400 });
    }

    if (body.longitude < -180 || body.longitude > 180) {
      return NextResponse.json({
        error: 'Invalid longitude',
        details: 'Longitude must be between -180 and 180 degrees',
        code: 'INVALID_LONGITUDE'
      }, { status: 400 });
    }

    // Validate date format (YYYY-MM-DD or MM/DD/YYYY)
    const dateRegex = /^(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/;
    if (!dateRegex.test(body.date)) {
      return NextResponse.json({
        error: 'Invalid date format',
        details: 'Date must be in YYYY-MM-DD or MM/DD/YYYY format',
        code: 'INVALID_DATE'
      }, { status: 400 });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(body.time)) {
      return NextResponse.json({
        error: 'Invalid time format',
        details: 'Time must be in 24-hour format (HH:MM)',
        code: 'INVALID_TIME'
      }, { status: 400 });
    }

    // Update API key usage count and last used timestamp
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({
        usage_count: apiKeyData.usage_count + 1,
        last_used: new Date().toISOString()
      })
      .eq('id', apiKeyData.id);

    if (updateError) {
      console.error('Error updating API key usage:', updateError);
      // Continue with the request even if updating usage fails
    }

    // Log API usage
    const { error: usageError } = await supabase
      .from('api_usage')
      .insert({
        api_key_id: apiKeyData.id,
        endpoint: '/api/v1/birth-chart',
        created_at: new Date().toISOString()
      });

    if (usageError) {
      console.error('Error logging API usage:', usageError);
      // Continue with the request even if logging usage fails
    }

    // Calculate birth chart
    try {
      const birthChartData = await calculateBirthChart(body);
      return NextResponse.json(birthChartData, { status: 200 });
    } catch (err) {
      const error = err as Error;
      console.error('Birth chart calculation error:', error);

      // Check for specific error types
      if (error.message.includes('ephemeris')) {
        return NextResponse.json({
          error: 'Ephemeris data error',
          details: error.message,
          code: 'EPHEMERIS_ERROR'
        }, { status: 500 });
      }

      if (error.message.includes('timezone')) {
        return NextResponse.json({
          error: 'Timezone determination error',
          details: error.message,
          code: 'TIMEZONE_ERROR'
        }, { status: 500 });
      }

      if (error.message.includes('Julian')) {
        return NextResponse.json({
          error: 'Date/time conversion error',
          details: error.message,
          code: 'DATE_CONVERSION_ERROR'
        }, { status: 500 });
      }

      if (error.message.includes('calculate')) {
        return NextResponse.json({
          error: 'Planetary calculation error',
          details: error.message,
          code: 'CALCULATION_ERROR'
        }, { status: 500 });
      }

      // Generic error with details
      return NextResponse.json({
        error: 'Birth chart calculation failed',
        details: error.message || 'Unknown error occurred',
        code: 'CALCULATION_ERROR'
      }, { status: 500 });
    }
  } catch (err) {
    // Handle any unexpected errors
    const error = err as Error;
    console.error('Unexpected error:', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'An unexpected error occurred',
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}
