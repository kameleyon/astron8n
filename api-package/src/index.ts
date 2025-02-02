import { BirthChartCalculator } from './calculator';
import {
  BirthChartInput,
  BirthChartData,
  BirthChartConfig,
  Planet,
  House,
  Aspect,
  ChartPoint,
  BirthChartError,
  ZODIAC_SIGNS,
  PLANETS,
  ASPECT_TYPES,
  HOUSE_SYSTEMS
} from './types';

// Re-export the calculator class
export { BirthChartCalculator };

// Re-export types
export type {
  BirthChartInput,
  BirthChartData,
  BirthChartConfig,
  Planet,
  House,
  Aspect,
  ChartPoint,
  BirthChartError
};

// Re-export constants
export {
  ZODIAC_SIGNS,
  PLANETS,
  ASPECT_TYPES,
  HOUSE_SYSTEMS
};

// Create a default instance with default configuration
export function createBirthChart(config: BirthChartConfig) {
  return new BirthChartCalculator(config);
}
