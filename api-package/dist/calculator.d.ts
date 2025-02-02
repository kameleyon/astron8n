import { BirthChartInput, BirthChartData, BirthChartConfig } from './types';
export declare class BirthChartCalculator {
    private config;
    private ephePath;
    constructor(config: BirthChartConfig);
    private getJulianDay;
    private getSignAndDegree;
    private calculatePlanets;
    private calculateHouses;
    private calculateAspects;
    private calculateSpecialPoints;
    calculate(input: BirthChartInput): Promise<BirthChartData>;
    private isAngleBetween;
}
