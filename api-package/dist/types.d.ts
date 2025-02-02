export interface BirthChartInput {
    name: string;
    date: string;
    time: string;
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
    formatted: string;
}
export interface House {
    number: number;
    sign: string;
    degree: number;
    cusp: number;
    formatted: string;
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
    formatted?: string;
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
export declare class BirthChartError extends Error {
    code: string;
    details?: any;
    constructor(message: string, code: string, details?: any);
}
export declare const ZODIAC_SIGNS: readonly ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
export declare const PLANETS: readonly ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "NorthNode", "Chiron"];
export declare const ASPECT_TYPES: {
    readonly CONJUNCTION: {
        readonly angle: 0;
        readonly orb: 10;
        readonly nature: "neutral";
    };
    readonly SEXTILE: {
        readonly angle: 60;
        readonly orb: 6;
        readonly nature: "harmonious";
    };
    readonly SQUARE: {
        readonly angle: 90;
        readonly orb: 8;
        readonly nature: "challenging";
    };
    readonly TRINE: {
        readonly angle: 120;
        readonly orb: 8;
        readonly nature: "harmonious";
    };
    readonly OPPOSITION: {
        readonly angle: 180;
        readonly orb: 10;
        readonly nature: "challenging";
    };
};
export declare const HOUSE_SYSTEMS: {
    readonly PLACIDUS: "P";
    readonly KOCH: "K";
    readonly EQUAL: "E";
    readonly WHOLE_SIGN: "W";
    readonly REGIOMONTANUS: "R";
    readonly CAMPANUS: "C";
    readonly TOPOCENTRIC: "T";
};
