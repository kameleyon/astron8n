"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSE_SYSTEMS = exports.ASPECT_TYPES = exports.PLANETS = exports.ZODIAC_SIGNS = exports.BirthChartError = void 0;
class BirthChartError extends Error {
    constructor(message, code, details) {
        super(message);
        this.name = 'BirthChartError';
        this.code = code;
        this.details = details;
    }
}
exports.BirthChartError = BirthChartError;
// Constants
exports.ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];
exports.PLANETS = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
    'NorthNode', 'Chiron'
];
exports.ASPECT_TYPES = {
    CONJUNCTION: { angle: 0, orb: 10, nature: 'neutral' },
    SEXTILE: { angle: 60, orb: 6, nature: 'harmonious' },
    SQUARE: { angle: 90, orb: 8, nature: 'challenging' },
    TRINE: { angle: 120, orb: 8, nature: 'harmonious' },
    OPPOSITION: { angle: 180, orb: 10, nature: 'challenging' }
};
exports.HOUSE_SYSTEMS = {
    PLACIDUS: 'P',
    KOCH: 'K',
    EQUAL: 'E',
    WHOLE_SIGN: 'W',
    REGIOMONTANUS: 'R',
    CAMPANUS: 'C',
    TOPOCENTRIC: 'T'
};
