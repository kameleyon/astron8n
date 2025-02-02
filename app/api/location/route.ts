import { NextRequest, NextResponse } from 'next/server';

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_ENDPOINT = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    if (!MAPBOX_API_KEY) {
      return NextResponse.json({ error: 'Mapbox API key is not configured' }, { status: 500 });
    }

    const response = await fetch(
      `${MAPBOX_ENDPOINT}/${encodeURIComponent(query)}.json?` + 
      new URLSearchParams({
        access_token: MAPBOX_API_KEY,
        types: 'place,locality,neighborhood,region,country',
        limit: '5'
      })
    );

    if (!response.ok) {
      throw new Error('Mapbox API request failed');
    }

    const data = await response.json();
    
    // Transform Mapbox response to match expected format
    const locations = data.features.map((feature: any) => ({
      name: feature.place_name,
      lat: feature.center[1],
      lng: feature.center[0]
    }));

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Location search error:', error);
    return NextResponse.json(
      { error: 'Failed to search location' },
      { status: 500 }
    );
  }
}
