import { PlanetPosition, AspectData, PlanetName } from '../types/birth-chart';

const MAJOR_ASPECTS = {
  Conjunction: { angle: 0, orb: 8 },
  Sextile: { angle: 60, orb: 6 },
  Square: { angle: 90, orb: 8 },
  Trine: { angle: 120, orb: 8 },
  Opposition: { angle: 180, orb: 8 }
};

export function calculateAspects(planets: Record<PlanetName, PlanetPosition>): AspectData[] {
  const aspects: AspectData[] = [];
  const planetNames = Object.keys(planets) as PlanetName[];

  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const planet1 = planetNames[i];
      const planet2 = planetNames[j];
      
      const angle = Math.abs(planets[planet1].longitude - planets[planet2].longitude);
      const normalizedAngle = angle > 180 ? 360 - angle : angle;

      for (const [aspectName, aspectData] of Object.entries(MAJOR_ASPECTS)) {
        const diff = Math.abs(normalizedAngle - aspectData.angle);
        if (diff <= aspectData.orb) {
          aspects.push({
            planet1,
            planet2,
            aspect: aspectName,
            angle: normalizedAngle,
            orb: diff,
            nature: getAspectNature(aspectName)
          });
        }
      }
    }
  }

  return aspects;
}

function getAspectNature(aspect: string): 'harmonious' | 'challenging' | 'neutral' {
  switch (aspect) {
    case 'Trine':
    case 'Sextile':
      return 'harmonious';
    case 'Square':
    case 'Opposition':
      return 'challenging';
    default:
      return 'neutral';
  }
}