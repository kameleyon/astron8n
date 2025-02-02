import swisseph from 'swisseph';
import { ZodiacSign } from '../types/birth-chart';

// Initialize Swiss Ephemeris
swisseph.swe_set_ephe_path(null); // Use built-in ephemeris

// Constants
const J2000 = 2451545.0; // Julian date for J2000.0
const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Convert date to Julian day
export function getJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + 
               date.getUTCMinutes() / 60.0 + 
               date.getUTCSeconds() / 3600.0;
  
  return swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
}

// Get zodiac sign from longitude
export function getZodiacSign(longitude: number): ZodiacSign {
  const signIndex = Math.floor(longitude / 30) % 12;
  return ZODIAC_SIGNS[signIndex];
}

// Format degrees in standard astrological notation
export function formatDegrees(degrees: number): string {
  const wholeDegrees = Math.floor(Math.abs(degrees));
  const minutes = Math.floor((Math.abs(degrees) - wholeDegrees) * 60);
  return `${degrees < 0 ? '-' : ''}${wholeDegrees}°${minutes}'`;
}

// Calculate planet positions
export function calculatePlanetPositions(julianDay: number) {
  const planets = [
    { id: swisseph.SE_SUN, name: 'Sun' },
    { id: swisseph.SE_MOON, name: 'Moon' },
    { id: swisseph.SE_MERCURY, name: 'Mercury' },
    { id: swisseph.SE_VENUS, name: 'Venus' },
    { id: swisseph.SE_MARS, name: 'Mars' },
    { id: swisseph.SE_JUPITER, name: 'Jupiter' },
    { id: swisseph.SE_SATURN, name: 'Saturn' },
    { id: swisseph.SE_URANUS, name: 'Uranus' },
    { id: swisseph.SE_NEPTUNE, name: 'Neptune' },
    { id: swisseph.SE_PLUTO, name: 'Pluto' }
  ];

  return planets.map(planet => {
    const flags = swisseph.SEFLG_SPEED | swisseph.SEFLG_SWIEPH;
    const result = swisseph.swe_calc_ut(julianDay, planet.id, flags);
    
    if (result.error) {
      console.error(`Error calculating position for ${planet.name}:`, result.error);
      return null;
    }

    const [longitude, latitude, distance, longitudeSpeed] = result.data;
    const sign = getZodiacSign(longitude);
    const retrograde = longitudeSpeed < 0;

    return {
      name: planet.name,
      longitude,
      latitude,
      distance,
      longitudeSpeed,
      sign,
      retrograde,
      formatted: `${formatDegrees(longitude % 30)} ${sign}`
    };
  }).filter(Boolean);
}

// Calculate house cusps
export function calculateHouses(julianDay: number, latitude: number, longitude: number) {
  const flags = swisseph.SEFLG_SIDEREAL;
  const result = swisseph.swe_houses(julianDay, latitude, longitude, 'P');

  if (result.error) {
    console.error('Error calculating houses:', result.error);
    return null;
  }

  const { house_cusps, ascendant, mc } = result;

  return {
    cusps: house_cusps.map((cusp: number, index: number) => ({
      house: index + 1,
      longitude: cusp,
      sign: getZodiacSign(cusp),
      formatted: `${formatDegrees(cusp % 30)} ${getZodiacSign(cusp)}`
    })),
    ascendant: {
      longitude: ascendant,
      sign: getZodiacSign(ascendant),
      formatted: `${formatDegrees(ascendant % 30)} ${getZodiacSign(ascendant)}`
    },
    midheaven: {
      longitude: mc,
      sign: getZodiacSign(mc),
      formatted: `${formatDegrees(mc % 30)} ${getZodiacSign(mc)}`
    }
  };
}

// Calculate aspects between planets
export function calculateAspects(positions: any[]) {
  const aspects = [];
  const aspectTypes = {
    conjunction: { angle: 0, orb: 8 },
    opposition: { angle: 180, orb: 8 },
    trine: { angle: 120, orb: 8 },
    square: { angle: 90, orb: 8 },
    sextile: { angle: 60, orb: 6 }
  };

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i];
      const p2 = positions[j];
      
      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const [type, { angle, orb }] of Object.entries(aspectTypes)) {
        if (Math.abs(diff - angle) <= orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            type,
            angle: diff,
            orb: Math.abs(diff - angle)
          });
        }
      }
    }
  }

  return aspects;
}