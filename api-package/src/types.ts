export interface BirthChartInput {
  name: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format (24-hour)
  location: string;
  latitude: number;
  longitude: number;
}

export interface Planet {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
  speed: number;
  longitude: number;
  formatted: string;  // Added formatted property
}

export interface House {
  number: number;
  sign: string;
  degree: number;
  cusp: number;
  formatted: string;  // Added formatted property
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  angle: number;
  orb: number;
  nature: 'harmonious' | 'challenging' | 'neutral';
  exact: boolean;
}

export interface ChartPoint {
  sign: string;
  degree: number;
  longitude: number;
  formatted?: string;  // Added optional formatted property
}

export interface BirthChartData {
  name: string;
  date: string;
  time: string;
  location: string;
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  ascendant: ChartPoint;
  midheaven: ChartPoint;
  descendant: ChartPoint;
  imumCoeli: ChartPoint;
  zodiacType: 'tropical' | 'sidereal';
  houseSystem: string;
}

export interface BirthChartConfig {
  apiKey: string;
  ephemerisPath?: string;
  zodiacType?: 'tropical' | 'sidereal';
  houseSystem?: string;
  aspectOrbs?: {
    conjunction?: number;
    opposition?: number;
    trine?: number;
    square?: number;
    sextile?: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export class BirthChartError extends Error {
  public code: string;
  public details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'BirthChartError';
    this.code = code;
    this.details = details;
  }
}

// Constants
export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export const PLANETS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
  'NorthNode', 'Chiron'
] as const;

export const ASPECT_TYPES = {
  CONJUNCTION: { angle: 0, orb: 10, nature: 'neutral' },
  SEXTILE: { angle: 60, orb: 6, nature: 'harmonious' },
  SQUARE: { angle: 90, orb: 8, nature: 'challenging' },
  TRINE: { angle: 120, orb: 8, nature: 'harmonious' },
  OPPOSITION: { angle: 180, orb: 10, nature: 'challenging' }
} as const;

export const HOUSE_SYSTEMS = {
  PLACIDUS: 'P',
  KOCH: 'K',
  EQUAL: 'E',
  WHOLE_SIGN: 'W',
  REGIOMONTANUS: 'R',
  CAMPANUS: 'C',
  TOPOCENTRIC: 'T'
} as const;
