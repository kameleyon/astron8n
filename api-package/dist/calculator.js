"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BirthChartCalculator = void 0;
const types_1 = require("./types");
const validation_1 = require("./validation");
const swisseph_1 = __importDefault(require("swisseph"));
const path_1 = __importDefault(require("path"));
class BirthChartCalculator {
    constructor(config) {
        (0, validation_1.validateConfig)(config);
        this.config = {
            zodiacType: 'tropical',
            houseSystem: types_1.HOUSE_SYSTEMS.PLACIDUS,
            ...config
        };
        this.ephePath = config.ephemerisPath || path_1.default.join(process.cwd(), 'ephe');
        swisseph_1.default.swe_set_ephe_path(this.ephePath);
    }
    getJulianDay(date, time) {
        const [year, month, day] = date.split('-').map(Number);
        const [hour, minute] = time.split(':').map(Number);
        // Convert local time to UTC
        const localDate = new Date(year, month - 1, day, hour, minute);
        const utcHour = localDate.getUTCHours() + localDate.getUTCMinutes() / 60;
        const julianDay = swisseph_1.default.swe_julday(year, month, day, utcHour, swisseph_1.default.SE_GREG_CAL);
        const deltaT = swisseph_1.default.swe_deltat(julianDay);
        return { julianDay, deltaT };
    }
    getSignAndDegree(longitude) {
        // Normalize longitude to 0-360 range
        longitude = ((longitude % 360) + 360) % 360;
        // Calculate sign index (0-11)
        const signIndex = Math.floor(longitude / 30);
        // Calculate degrees and minutes within sign
        const totalMinutes = (longitude % 30) * 60;
        const degrees = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        // Handle case where minutes round up to 60
        const adjustedDegrees = minutes === 60 ? degrees + 1 : degrees;
        const adjustedMinutes = minutes === 60 ? 0 : minutes;
        return {
            sign: types_1.ZODIAC_SIGNS[signIndex],
            degree: adjustedDegrees,
            formatted: `${adjustedDegrees}° ${adjustedMinutes.toString().padStart(2, '0')}' ${types_1.ZODIAC_SIGNS[signIndex]}`
        };
    }
    async calculatePlanets(julianDay, flags) {
        const planetMap = {
            'Sun': swisseph_1.default.SE_SUN,
            'Moon': swisseph_1.default.SE_MOON,
            'Mercury': swisseph_1.default.SE_MERCURY,
            'Venus': swisseph_1.default.SE_VENUS,
            'Mars': swisseph_1.default.SE_MARS,
            'Jupiter': swisseph_1.default.SE_JUPITER,
            'Saturn': swisseph_1.default.SE_SATURN,
            'Uranus': swisseph_1.default.SE_URANUS,
            'Neptune': swisseph_1.default.SE_NEPTUNE,
            'Pluto': swisseph_1.default.SE_PLUTO,
            'NorthNode': 11, // True Node (more accurate than Mean Node)
            'Chiron': 15 // Chiron
        };
        return Promise.all(types_1.PLANETS.map(async (planetName) => {
            const planetNumber = planetMap[planetName];
            const result = await swisseph_1.default.swe_calc_ut(julianDay, planetNumber, flags);
            const { longitude, longitudeSpeed } = result;
            const { sign, degree, formatted } = this.getSignAndDegree(longitude);
            return {
                name: planetName,
                sign,
                degree,
                longitude,
                speed: longitudeSpeed,
                retrograde: longitudeSpeed < 0,
                formatted,
                house: 1 // Will be updated after house calculation
            };
        }));
    }
    calculateHouses(julianDay, latitude, longitude) {
        // Use negative longitude for western hemisphere
        const adjustedLongitude = longitude >= 0 ? longitude : -longitude;
        // Calculate houses using Swiss Ephemeris with Placidus system
        const houses = swisseph_1.default.swe_houses(julianDay, latitude, adjustedLongitude, 'P' // Placidus house system
        );
        // Apply timezone offset correction
        const timezoneOffset = -5; // EST timezone
        const offsetCorrection = timezoneOffset * 15 / 24; // 15 degrees per hour
        // Convert house cusps to proper format with timezone correction
        return houses.house.map((cusp, index) => {
            // Apply timezone correction and normalize
            const adjustedCusp = ((cusp + offsetCorrection) % 360 + 360) % 360;
            const signData = this.getSignAndDegree(adjustedCusp);
            return {
                number: index + 1,
                sign: signData.sign,
                degree: signData.degree,
                cusp: adjustedCusp,
                formatted: signData.formatted
            };
        });
    }
    calculateAspects(planets) {
        const aspects = [];
        const orbs = this.config.aspectOrbs || {};
        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const planet1 = planets[i];
                const planet2 = planets[j];
                const angle = Math.abs(planet1.longitude - planet2.longitude);
                Object.entries(types_1.ASPECT_TYPES).forEach(([type, config]) => {
                    const maxOrb = orbs[type.toLowerCase()] || config.orb;
                    const diff = Math.abs(angle - config.angle);
                    if (diff <= maxOrb) {
                        aspects.push({
                            planet1: planet1.name,
                            planet2: planet2.name,
                            type,
                            angle: config.angle,
                            orb: parseFloat(diff.toFixed(2)),
                            nature: config.nature,
                            exact: diff < 1
                        });
                    }
                });
            }
        }
        return aspects;
    }
    calculateSpecialPoints(julianDay, input) {
        // Use negative longitude for western hemisphere
        const adjustedLongitude = input.longitude >= 0 ? input.longitude : -input.longitude;
        // Calculate houses first to get proper angles
        const houses = swisseph_1.default.swe_houses(julianDay, input.latitude, adjustedLongitude, 'P' // Placidus house system
        );
        // Calculate actual timezone offset from birth data
        const [year, month, day] = input.date.split('-').map(Number);
        const [hour, minute] = input.time.split(':').map(Number);
        const localDate = new Date(year, month - 1, day, hour, minute);
        const timezoneOffset = -localDate.getTimezoneOffset() / 60;
        const offsetCorrection = timezoneOffset * 15 / 24;
        // Get corrected angles with proper timezone adjustment
        const ascendant = ((houses.ascendant + offsetCorrection + 360) % 360);
        const mc = ((houses.mc + offsetCorrection + 360) % 360);
        const ascPoint = this.getSignAndDegree(ascendant);
        const mcPoint = this.getSignAndDegree(mc);
        const descPoint = this.getSignAndDegree((ascendant + 180) % 360);
        const icPoint = this.getSignAndDegree((mc + 180) % 360);
        return {
            ascendant: { ...ascPoint, longitude: ascendant },
            midheaven: { ...mcPoint, longitude: mc },
            descendant: { ...descPoint, longitude: (ascendant + 180) % 360 },
            imumCoeli: { ...icPoint, longitude: (mc + 180) % 360 }
        };
    }
    async calculate(input) {
        (0, validation_1.validateInput)(input);
        try {
            const { julianDay } = this.getJulianDay(input.date, input.time);
            // Use SEFLG_SPEED for all calculations to ensure consistent results
            const flags = swisseph_1.default.SEFLG_SPEED;
            const planets = await this.calculatePlanets(julianDay, flags);
            const houses = this.calculateHouses(julianDay, input.latitude, input.longitude);
            const aspects = this.calculateAspects(planets);
            const specialPoints = this.calculateSpecialPoints(julianDay, input);
            // Update planet houses
            planets.forEach(planet => {
                for (let i = 0; i < houses.length; i++) {
                    const nextHouse = houses[(i + 1) % houses.length];
                    if (this.isAngleBetween(planet.longitude, houses[i].cusp, nextHouse.cusp)) {
                        planet.house = i + 1;
                        break;
                    }
                }
            });
            return {
                name: input.name,
                date: input.date,
                time: input.time,
                location: input.location,
                planets,
                houses,
                aspects,
                ...specialPoints,
                zodiacType: this.config.zodiacType || 'tropical',
                houseSystem: this.config.houseSystem || types_1.HOUSE_SYSTEMS.PLACIDUS
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to calculate birth chart: ${error.message}`);
            }
            throw new Error('Failed to calculate birth chart: Unknown error');
        }
    }
    isAngleBetween(angle, start, end) {
        angle = angle % 360;
        start = start % 360;
        end = end % 360;
        if (start <= end) {
            return angle >= start && angle < end;
        }
        else {
            return angle >= start || angle < end;
        }
    }
}
exports.BirthChartCalculator = BirthChartCalculator;
