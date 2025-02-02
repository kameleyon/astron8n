import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define validation schema using Zod
const birthChartSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, 'Time must be in HH:mm or HH:mm:ss format').transform(time => {
    // If time includes seconds, strip them off
    return time.split(':').slice(0, 2).join(':');
  }).optional(),
  location: z.string().min(1, 'Location is required'),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const rawData = await req.json();
    console.log('Received request data:', rawData);

    const validationResult = birthChartSchema.safeParse(rawData);

    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.errors);
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    console.log('Validated data:', data);

    // Try local API server
    try {
      const serverUrl = process.env.BIRTH_CHART_SERVER_URL || "http://localhost:3001";
      const response = await fetch(`${serverUrl}/birth-chart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        return NextResponse.json(responseData);
      }
    } catch (error) {
      console.error('Local API server error:', error);
    }

    // If local server fails, return error
    return NextResponse.json(
      { 
        error: 'Failed to calculate birth chart',
        details: 'API server is not available'
      },
      { status: 500 }
    );

  } catch (error) {
    console.error('Birth chart API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to calculate birth chart',
        details: process.env.NODE_ENV === 'development' ? {
          message: error instanceof Error ? error.message : String(error),
          cause: error instanceof Error ? error.cause : undefined,
        } : undefined
      },
      { status: 500 }
    );
  }
}
