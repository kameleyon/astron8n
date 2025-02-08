import { NextResponse } from "next/server";
import { calculateBirthChart } from "../../../birthchartpack/lib/services/astro/calculator";

// Mark this route as dynamic and use Node.js runtime
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function isValidDate(dateStr: string): boolean {
    // Check for YYYY-MM-DD format
    const isoRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    if (isoRegex.test(dateStr)) {
        const [_, year, month, day] = dateStr.match(isoRegex) || [];
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return date.getFullYear() === Number(year) &&
               date.getMonth() === Number(month) - 1 &&
               date.getDate() === Number(day);
    }

    // Check for MM/DD/YYYY format
    const usRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    if (usRegex.test(dateStr)) {
        const [_, month, day, year] = dateStr.match(usRegex) || [];
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return date.getFullYear() === Number(year) &&
               date.getMonth() === Number(month) - 1 &&
               date.getDate() === Number(day);
    }

    return false;
}

export async function POST(request: Request) {
    try {
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
            body = await request.json()
        } catch (err) {
            console.error('JSON parse error:', err);
            return NextResponse.json({
                error: 'Invalid request body format',
                details: 'Request body must be valid JSON'
            }, { status: 400 })
        }

        // Validate required fields
        const requiredFields = ['name', 'date', 'time', 'location', 'latitude', 'longitude']
        for (const field of requiredFields) {
            if (!(field in body)) {
                return NextResponse.json({
                    error: 'Missing required field',
                    details: `The field "${field}" is required`
                }, { status: 400 })
            }
        }

        // Validate field values
        if (typeof body.latitude !== 'number' || typeof body.longitude !== 'number') {
            return NextResponse.json({
                error: 'Invalid coordinates',
                details: 'Latitude and longitude must be numbers'
            }, { status: 400 })
        }

        if (body.latitude < -90 || body.latitude > 90) {
            return NextResponse.json({
                error: 'Invalid latitude',
                details: 'Latitude must be between -90 and 90 degrees'
            }, { status: 400 })
        }

        if (body.longitude < -180 || body.longitude > 180) {
            return NextResponse.json({
                error: 'Invalid longitude',
                details: 'Longitude must be between -180 and 180 degrees'
            }, { status: 400 })
        }

        let parsedDate = body.date?.trim() || "";
        if (!isValidDate(parsedDate)) {
            return NextResponse.json({
                error: 'Invalid date format',
                details: 'Date must be in YYYY-MM-DD or MM/DD/YYYY format and be a valid date'
            }, { status: 400 })
        }

        let parsedTime = body.time?.trim() || "";
        // Force to "HH:MM" in 24-hour
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(parsedTime)) {
            return NextResponse.json({
                error: 'Invalid time format',
                details: 'Time must be in 24-hour format (HH:MM)'
            }, { status: 400 })
        }

        // Calculate birth chart
        try {
            console.log('Calculating birth chart with data:', {
                ...body,
                // Don't log sensitive information like name
                name: '[REDACTED]'
            });

            const birthChartData = await calculateBirthChart(body)
            
            console.log('Birth chart calculation successful');
            return NextResponse.json(birthChartData)

        } catch (err) {
            const error = err as Error
            console.error('Birth chart calculation error:', error)

            // Check for specific error types
            if (error.message.includes('ephemeris')) {
                return NextResponse.json({
                    error: 'Ephemeris data error',
                    details: error.message
                }, { status: 500 })
            }

            if (error.message.includes('timezone')) {
                return NextResponse.json({
                    error: 'Timezone determination error',
                    details: error.message
                }, { status: 500 })
            }

            if (error.message.includes('Julian')) {
                return NextResponse.json({
                    error: 'Date/time conversion error',
                    details: error.message
                }, { status: 500 })
            }

            if (error.message.includes('calculate')) {
                return NextResponse.json({
                    error: 'Planetary calculation error',
                    details: error.message
                }, { status: 500 })
            }

            // Generic error with details
            return NextResponse.json({
                error: 'Birth chart calculation failed',
                details: error.message || 'Unknown error occurred'
            }, { status: 500 })
        }
    } catch (err) {
        // Handle any unexpected errors
        const error = err as Error
        console.error('Unexpected error:', error)
        
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message || 'An unexpected error occurred'
        }, { status: 500 })
    }
}
