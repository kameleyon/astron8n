import { calculatePlanetPositions, calculateJulianDay } from '../../birthchartpack/lib/services/astro/calculations';
import { PlanetPosition } from '../../birthchartpack/lib/services/astro/types';

export interface HumanDesignProfile {
  type: string;
  authority: string;
  profile: string;
  definition: string;
  channels: string[];
  centers: {
    head: boolean;
    ajna: boolean;
    throat: boolean;
    gCenter: boolean;
    heart: boolean;
    solar: boolean;
    sacral: boolean;
    spleen: boolean;
    root: boolean;
  };
}

// Gates connected to each center
const centerGates = {
  head: [64, 61, 63, 47, 24, 4],
  ajna: [47, 24, 4, 17, 43, 11],
  throat: [62, 23, 56, 35, 12, 45, 33, 31, 8, 20],
  gCenter: [1, 13, 25, 2, 46, 15, 10, 7],
  heart: [21, 26, 51],
  solar: [37, 22, 36, 6, 49],
  sacral: [5, 14, 29, 59, 9, 3, 42, 27, 34],
  spleen: [48, 57, 44, 50, 32, 28, 18],
  root: [58, 38, 54, 53, 60, 52, 19, 39, 41, 55]
};

function calculateDesignTime(birthDate: Date): Date {
  // Calculate approximately 88 degrees before birth (≈ 88 days)
  const designDate = new Date(birthDate);
  designDate.setDate(designDate.getDate() - 88);
  return designDate;
}

function determineType(centers: HumanDesignProfile['centers']): string {
  if (!centers.sacral && !centers.heart && !centers.solar && !centers.root) {
    return 'Reflector';
  }
  if (centers.sacral) {
    return centers.heart ? 'Manifesting Generator' : 'Generator';
  }
  if (centers.heart) {
    return 'Manifestor';
  }
  return 'Projector';
}

function determineAuthority(centers: HumanDesignProfile['centers']): string {
  if (centers.solar) return 'Emotional';
  if (centers.sacral) return 'Sacral';
  if (centers.spleen) return 'Splenic';
  if (centers.gCenter) return 'Self';
  return 'None';
}

function validateInputs(birthDate: string, birthTime: string, latitude: number, longitude: number) {
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    throw new Error('Invalid birth date format. Expected YYYY-MM-DD');
  }

  // Validate time format
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(birthTime)) {
    throw new Error('Invalid birth time format. Expected HH:MM in 24-hour format');
  }

  // Validate latitude
  if (latitude < -90 || latitude > 90) {
    throw new Error('Invalid latitude. Must be between -90 and 90 degrees');
  }

  // Validate longitude
  if (longitude < -180 || longitude > 180) {
    throw new Error('Invalid longitude. Must be between -180 and 180 degrees');
  }
}

export async function calculateHumanDesign(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number
): Promise<HumanDesignProfile> {
  console.log('Calculating Human Design for:', {
    birthDate,
    birthTime,
    latitude,
    longitude
  });

  // Validate inputs
  validateInputs(birthDate, birthTime, latitude, longitude);

  // Parse birth date and time
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);
  const birthDateTime = new Date(year, month - 1, day, hour, minute);

  if (isNaN(birthDateTime.getTime())) {
    throw new Error('Invalid birth date/time combination');
  }
  
  // Calculate personality (conscious) and design (unconscious) positions
  const personalityDate = birthDateTime;
  const designDate = calculateDesignTime(birthDateTime);

  console.log('Calculating Julian Days for:', {
    personality: personalityDate.toISOString(),
    design: designDate.toISOString()
  });

  // Convert dates to Julian Day numbers
  const personalityJD = calculateJulianDay(
    personalityDate.getFullYear(),
    personalityDate.getMonth() + 1,
    personalityDate.getDate(),
    personalityDate.getHours(),
    personalityDate.getMinutes(),
    0,
    latitude,
    longitude
  );

  const designJD = calculateJulianDay(
    designDate.getFullYear(),
    designDate.getMonth() + 1,
    designDate.getDate(),
    designDate.getHours(),
    designDate.getMinutes(),
    0,
    latitude,
    longitude
  );

  console.log('Julian Days calculated:', {
    personalityJD,
    designJD
  });

  // Get planet positions for both times
  console.log('Calculating planet positions...');
  const personalityPlanets = await calculatePlanetPositions(personalityJD);
  const designPlanets = await calculatePlanetPositions(designJD);

  // Initialize centers as undefined
  const centers: HumanDesignProfile['centers'] = {
    head: false,
    ajna: false,
    throat: false,
    gCenter: false,
    heart: false,
    solar: false,
    sacral: false,
    spleen: false,
    root: false
  };

  // Calculate activated gates from planet positions
  const activatedGates: number[] = [];
  
  // Convert planet positions to gates (simplified mapping)
  const convertPlanetsToArray = (planets: Record<string, PlanetPosition>): PlanetPosition[] => 
    Object.values(planets);

  const allPlanets = [
    ...convertPlanetsToArray(personalityPlanets),
    ...convertPlanetsToArray(designPlanets)
  ];
  
  console.log('Converting planet positions to gates...');
  allPlanets.forEach(planet => {
    // Simple conversion of zodiacal degrees to gates (1-64)
    const gate = Math.floor((planet.longitude / 5.625) + 1);
    if (!activatedGates.includes(gate)) {
      activatedGates.push(gate);
    }
  });

  console.log('Activated gates:', activatedGates);

  // Determine which centers are defined based on activated gates
  Object.entries(centerGates).forEach(([center, gates]) => {
    const isActivated = gates.some(gate => activatedGates.includes(gate));
    centers[center as keyof typeof centers] = isActivated;
  });

  console.log('Activated centers:', centers);

  // Calculate channels (simplified)
  const channels = activatedGates
    .map(gate => {
      // This is a simplified channel calculation
      // In reality, channels would be determined by specific gate pairs
      return `Channel ${gate}`;
    });

  // Calculate profile numbers (simplified)
  const profile = '1/3'; // This would normally be calculated based on gates

  // Determine type and authority
  const type = determineType(centers);
  const authority = determineAuthority(centers);

  // Determine definition type (simplified)
  const definition = 'Single Definition'; // This would normally be calculated based on connected centers

  const result = {
    type,
    authority,
    profile,
    definition,
    channels,
    centers
  };

  console.log('Human Design calculation complete:', result);
  return result;
}
