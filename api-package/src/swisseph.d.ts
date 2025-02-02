declare module 'swisseph' {
  export interface PlanetResult {
    longitude: number;
    latitude: number;
    distance: number;
    longitudeSpeed: number;
    latitudeSpeed: number;
    distanceSpeed: number;
    rflag: number;
  }

  export interface HousesResult {
    house: number[];
    ascendant: number;
    mc: number;
    armc: number;
    vertex: number;
    equatorialAscendant: number;
    kochCoAscendant: number;
    munkaseyCoAscendant: number;
    munkaseyPolarAscendant: number;
  }

  export const SE_GREG_CAL: number;
  export const SEFLG_SPEED: number;
  export const SEFLG_SIDEREAL: number;

  export const SE_SUN: number;
  export const SE_MOON: number;
  export const SE_MERCURY: number;
  export const SE_VENUS: number;
  export const SE_MARS: number;
  export const SE_JUPITER: number;
  export const SE_SATURN: number;
  export const SE_URANUS: number;
  export const SE_NEPTUNE: number;
  export const SE_PLUTO: number;

  export function swe_set_ephe_path(path: string): void;
  export function swe_julday(year: number, month: number, day: number, hour: number, flag: number): number;
  export function swe_deltat(julianDay: number): number;
  export function swe_calc_ut(julianDay: number, planet: number, flags: number): Promise<PlanetResult>;
  export function swe_houses(julianDay: number, latitude: number, longitude: number, system: string): HousesResult;
}
