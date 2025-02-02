import { BirthChartCalculator } from './calculator';
import { BirthChartInput, BirthChartData, BirthChartConfig, Planet, House, Aspect, ChartPoint, BirthChartError, ZODIAC_SIGNS, PLANETS, ASPECT_TYPES, HOUSE_SYSTEMS } from './types';
export { BirthChartCalculator };
export type { BirthChartInput, BirthChartData, BirthChartConfig, Planet, House, Aspect, ChartPoint, BirthChartError };
export { ZODIAC_SIGNS, PLANETS, ASPECT_TYPES, HOUSE_SYSTEMS };
export declare function createBirthChart(config: BirthChartConfig): BirthChartCalculator;
