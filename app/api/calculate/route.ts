import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateBirthChart } from '../../../birthchartpack/lib/services/astro/calculator';

// Define validation schema using Zod
const birthChartSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string().regex(/^(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/, 'Date must be in YYYY-MM-DD or MM/DD/YYYY format'),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, 'Time must be in HH:mm or HH:mm:ss format').transform(time => {
    // If time includes seconds, strip them off
    return time.split(':').slice(0, 2).join(':');
  }),
  location: z.string().min(1, 'Location is required'),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const rawData = await req.json();
    console.log('Received calculate request data:', rawData);

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

    // Directly use the calculateBirthChart function from birthchartpack
    try {
      const birthChartData = await calculateBirthChart({
        name: data.name,
        date: data.date,
        time: data.time,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude
      });
      
      return NextResponse.json(birthChartData);
    } catch (error) {
      console.error('Error calculating birth chart:', error);
      throw error;
    }
  } catch (error) {
    console.error('Calculate API error:', error);
    
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
