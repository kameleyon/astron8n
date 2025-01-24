import { BirthChartData, PlanetPosition, Position, PatternData, ZodiacSign, HouseData, PlanetName } from '../types/birth-chart';
import { analyzeBirthChart } from './patterns';
import { analyzeSpecialFeatures } from './features';
import { calculateAspects } from './aspects';
import moment from 'moment-timezone';

// Simplified zodiac calculations
const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

function getZodiacSign(dayOfYear: number): ZodiacSign {
  const signIndex = Math.floor((dayOfYear * 12) / 365) % 12;
  return ZODIAC_SIGNS[signIndex];
}

function formatDegree(degree: number): string {
  const wholeDegree = Math.floor(degree);
  const minutes = Math.floor((degree - wholeDegree) * 60);
  return `${wholeDegree}°${minutes}'`;
}

interface BirthChartInput {
  name: string;
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
}

export async function calculateBirthChart(input: BirthChartInput): Promise<BirthChartData> {
  try {
    // Parse birth date
    const birthDate = moment(input.date);
    const dayOfYear = birthDate.dayOfYear();

    // Calculate basic positions based on date
    const sunPosition = dayOfYear * 360 / 365;
    const moonPosition = (dayOfYear * 13.2) * 360 / 365; // Approximate lunar months
    
    // Generate planet positions
    const planets: Array<PlanetPosition & { name: string }> = [
      {
        name: 'Sun',
        longitude: sunPosition,
        latitude: 0,
        distance: 1,
        longitudeSpeed: 1,
        sign: getZodiacSign(dayOfYear),
        retrograde: false,
        formatted: `${formatDegree(sunPosition)} ${getZodiacSign(dayOfYear)}`
      },
      {
        name: 'Moon',
        longitude: moonPosition,
        latitude: 0,
        distance: 1,
        longitudeSpeed: 13.2,
        sign: getZodiacSign(Math.floor(moonPosition * 365 / 360)),
        retrograde: false,
        formatted: `${formatDegree(moonPosition)} ${getZodiacSign(Math.floor(moonPosition * 365 / 360))}`
      },
      // Add other planets with approximate positions
      {
        name: 'Mercury',
        longitude: (sunPosition + 15) % 360,
        latitude: 0,
        distance: 0.4,
        longitudeSpeed: 1.4,
        sign: getZodiacSign(Math.floor((dayOfYear + 15) % 365)),
        retrograde: false,
        formatted: `${formatDegree((sunPosition + 15) % 360)} ${getZodiacSign(Math.floor((dayOfYear + 15) % 365))}`
      },
      // Add more planets as needed
    ];

    // Calculate ascendant based on birth time
    const [hours, minutes] = input.time.split(':').map(Number);
    const timeDecimal = hours + minutes / 60;
    const ascendantPosition = (dayOfYear * 360 / 365 + timeDecimal * 15) % 360;
    
    const ascendant: Position = {
      longitude: ascendantPosition,
      latitude: 0,
      distance: 1,
      longitudeSpeed: 0,
      sign: getZodiacSign(Math.floor(ascendantPosition * 365 / 360)),
      retrograde: false,
      formatted: `${formatDegree(ascendantPosition)} ${getZodiacSign(Math.floor(ascendantPosition * 365 / 360))}`
    };

    // Calculate midheaven (MC)
    const midheavenPosition = (ascendantPosition + 90) % 360;
    const midheaven: Position = {
      longitude: midheavenPosition,
      latitude: 0,
      distance: 1,
      longitudeSpeed: 0,
      sign: getZodiacSign(Math.floor(midheavenPosition * 365 / 360)),
      retrograde: false,
      formatted: `${formatDegree(midheavenPosition)} ${getZodiacSign(Math.floor(midheavenPosition * 365 / 360))}`
    };

    // Transform planets array into record for aspect calculation
    const planetRecord: Record<PlanetName, PlanetPosition> = planets.reduce((acc, planet) => ({
      ...acc,
      [planet.name as PlanetName]: {
        longitude: planet.longitude,
        latitude: planet.latitude,
        distance: planet.distance,
        longitudeSpeed: planet.longitudeSpeed,
        sign: planet.sign,
        retrograde: planet.retrograde,
        formatted: planet.formatted
      }
    }), {} as Record<PlanetName, PlanetPosition>);

    // Calculate aspects between planets
    const aspects = calculateAspects(planetRecord);

    // Calculate houses (simplified)
    const houses: Record<string, HouseData> = {};
    for (let i = 1; i <= 12; i++) {
      const housePosition = (ascendantPosition + (i - 1) * 30) % 360;
      houses[`House${i}`] = {
        cusp: housePosition,
        sign: getZodiacSign(Math.floor(housePosition * 365 / 360)),
        formatted: `${formatDegree(housePosition)} ${getZodiacSign(Math.floor(housePosition * 365 / 360))}`
      };
    }

    // Create the birth chart data
    const birthChartData: BirthChartData = {
      name: input.name,
      location: input.location,
      date: input.date,
      time: input.time,
      planets,
      houses,
      aspects,
      patterns: [],
      features: [],
      ascendant,
      midheaven
    };

    // Analyze the chart for patterns
    const { patterns } = analyzeBirthChart(birthChartData);
    birthChartData.patterns = patterns;

    // Analyze the chart for special features
    birthChartData.features = analyzeSpecialFeatures(birthChartData);

    return birthChartData;
  } catch (err) {
    const error = err as Error;
    console.error('Birth chart calculation error:', error);
    throw new Error(`Birth chart calculation failed: ${error.message || 'Unknown error'}`);
  }
}