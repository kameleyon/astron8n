import { BirthChartData, ZodiacSign } from '../types/birth-chart';
import { getTimezone } from './time';
import { calculateAspects } from './aspects';
import { analyzeBirthChart } from './patterns';
import { analyzeSpecialFeatures } from './features';
import moment from 'moment-timezone';
import path from 'path';
import { createBirthChart } from 'astrogenie-birthchart';

interface BirthChartInput {
  name: string;
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
}

const calculator = createBirthChart({
  apiKey: process.env.NEXT_ASTROGENIE_API_KEY || ''
});

/**
 * Calculate complete birth chart data
 */
export async function calculateBirthChart(input: BirthChartInput): Promise<BirthChartData> {
  try {
    // Validate API key
    if (!process.env.NEXT_ASTROGENIE_API_KEY) {
      throw new Error('AstroGenie API key not configured');
    }

    const { name, date, time, location, latitude, longitude } = input;

    // Get timezone for the birth location
    const timezone = await getTimezone(latitude, longitude, date);
    
    // Convert birth time to the local timezone of the birth location
    const birthMoment = moment.tz(`${date} ${time}`, timezone);
    if (!birthMoment.isValid()) {
      throw new Error('Invalid date or time format');
    }

    // Calculate birth chart using the AstroGenie API
    const chartData = await calculator.calculate({
      name,
      date: birthMoment.format('YYYY-MM-DD'),
      time: birthMoment.format('HH:mm'),
      location,
      latitude,
      longitude,
      timezone: timezone
    });

    if (!chartData) {
      throw new Error('Failed to calculate birth chart');
    }

    // Calculate additional chart features
    const aspects = calculateAspects(chartData.planets);
    const patterns = analyzeBirthChart(chartData);
    const features = analyzeSpecialFeatures(chartData);

    return {
      ...chartData,
      aspects,
      patterns,
      features
    };

  } catch (err) {
    const error = err as Error;
    console.error('Birth chart calculation error:', error);
    throw new Error(`Failed to calculate birth chart: ${error.message}`);
  }
}