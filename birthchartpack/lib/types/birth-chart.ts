export type ZodiacSign = 
  | "Aries" 
  | "Taurus" 
  | "Gemini" 
  | "Cancer"
  | "Leo" 
  | "Virgo" 
  | "Libra" 
  | "Scorpio"
  | "Sagittarius" 
  | "Capricorn" 
  | "Aquarius" 
  | "Pisces"

export type PlanetName = 
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune"
  | "Pluto"
  | "NorthNode"
  | "SouthNode"
  | "Chiron"

// Base interface for positions
export interface Position {
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  sign: ZodiacSign;
  retrograde: boolean;  // Required in all cases
  formatted: string;    // Required in all cases
}

// Planet position extends base position
export interface PlanetPosition extends Position {
  house?: number;  // Added house property as optional
}

// House data
export interface HouseData {
  cusp: number;
  sign: ZodiacSign;
  formatted: string;  // Required
}

// Aspect data
export interface AspectData {
  planet1: string;
  planet2: string;
  aspect: string;
  angle: number;
  orb: number;
}

// Pattern planet data
export interface PatternPlanetData {
  name: string;
  sign: ZodiacSign;
  degree: string;
  longitude: number;
  position?: string;  // Added for formatted position like "25° Scorpio"
}

// Pattern visualization data
export interface PatternVisualization {
  type: string;    // e.g., 'triangle' for Grand Trine, 'rectangle' for Rectangle
  color?: string;  // Optional color for the pattern
  points: Array<{
    x: number;
    y: number;
    planet: PatternPlanetData;
  }>;
}

// Pattern data
export interface PatternData {
  name: string;
  planets: PatternPlanetData[];
  description: string;
  visualization?: PatternVisualization;  // Added for pattern visualization
}

// Special feature data
export interface SpecialFeature {
  description: string;
  category: 'moon' | 'planets' | 'chart' | 'aspects';
}

// Complete birth chart data
export interface BirthChartData {
  name: string;
  location: string;
  date: string;
  time: string;
  planets: Array<PlanetPosition & { name: string }>;
  houses: Record<string, HouseData>;
  aspects: AspectData[];
  patterns: PatternData[];
  features: SpecialFeature[];  // Changed from optional to required
  ascendant: Position;
  midheaven: Position;
}
