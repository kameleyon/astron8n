export type ZodiacSign = 
  | "Aries" | "Taurus" | "Gemini" | "Cancer"
  | "Leo" | "Virgo" | "Libra" | "Scorpio"
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type PlanetName = 
  | "Sun" | "Moon" | "Mercury" | "Venus" | "Mars"
  | "Jupiter" | "Saturn" | "Uranus" | "Neptune"
  | "Pluto" | "NorthNode" | "Chiron";

export interface Position {
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  sign: ZodiacSign;
  retrograde: boolean;
  formatted: string;
}

export interface PlanetPosition extends Position {
  name?: string;
}

export interface HouseData {
  cusp: number;
  sign: ZodiacSign;
  formatted: string;
}

export interface AspectData {
  planet1: string;
  planet2: string;
  aspect: string;
  angle: number;
  orb: number;
  nature: 'harmonious' | 'challenging' | 'neutral';
  motion?: 'applying' | 'separating';
}

export interface PatternData {
  name: string;
  planets: Array<{
    name: string;
    degree: string;
    sign: ZodiacSign;
  }>;
  description: string;
}

export interface SpecialFeature {
  description: string;
  category: 'moon' | 'planets' | 'chart';
}

export interface BirthChartData {
  name: string;
  location: string;
  date: string;
  time: string;
  planets: Array<PlanetPosition & { name: string }>;
  houses: Record<string, HouseData>;
  aspects: AspectData[];
  patterns: PatternData[];
  features: SpecialFeature[];
  ascendant: Position;
  midheaven: Position;
}