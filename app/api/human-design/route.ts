import { NextResponse } from 'next/server';
import { calculateHumanDesign } from '@/lib/utils/humanDesign';
import path from 'path';
const swe = require('swisseph-v2');

// Initialize Swiss Ephemeris with ephemeris files path
const epheDir = path.join(process.cwd(), 'birthchartpack', 'ephe');
swe.swe_set_ephe_path(epheDir);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude } = body;

    if (!birthDate || !birthTime || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const humanDesignData = await calculateHumanDesign(
      birthDate,
      birthTime,
      latitude,
      longitude
    );

    return NextResponse.json(humanDesignData);
  } catch (error) {
    console.error('Error calculating Human Design:', error);
    let errorMessage = 'Failed to calculate Human Design';
    
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined 
      },
      { status: 500 }
    );
  }
}
