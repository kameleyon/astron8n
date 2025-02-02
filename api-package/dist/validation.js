"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = validateInput;
exports.validateApiKey = validateApiKey;
exports.validateConfig = validateConfig;
const types_1 = require("./types");
function validateInput(input) {
    const errors = [];
    // Validate name
    if (!input.name || input.name.trim().length === 0) {
        errors.push({
            field: 'name',
            message: 'Name is required'
        });
    }
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input.date)) {
        errors.push({
            field: 'date',
            message: 'Date must be in YYYY-MM-DD format'
        });
    }
    else {
        const date = new Date(input.date);
        if (isNaN(date.getTime())) {
            errors.push({
                field: 'date',
                message: 'Invalid date'
            });
        }
    }
    // Validate time format (H:mm or HH:mm)
    const timeRegex = /^(\d{1,2}):([0-5]\d)$/;
    if (!timeRegex.test(input.time)) {
        errors.push({
            field: 'time',
            message: 'Time must be in HH:mm format'
        });
    }
    else {
        const [hours, minutes] = input.time.split(':').map(Number);
        if (hours < 0 || hours > 23) {
            errors.push({
                field: 'time',
                message: 'Hours must be between 0 and 23'
            });
        }
    }
    // Validate location
    if (!input.location || input.location.trim().length === 0) {
        errors.push({
            field: 'location',
            message: 'Location is required'
        });
    }
    // Validate latitude
    if (typeof input.latitude !== 'number' || input.latitude < -90 || input.latitude > 90) {
        errors.push({
            field: 'latitude',
            message: 'Latitude must be a number between -90 and 90'
        });
    }
    // Validate longitude
    if (typeof input.longitude !== 'number' || input.longitude < -180 || input.longitude > 180) {
        errors.push({
            field: 'longitude',
            message: 'Longitude must be a number between -180 and 180'
        });
    }
    if (errors.length > 0) {
        throw new types_1.BirthChartError('Invalid input data', 'VALIDATION_ERROR', errors);
    }
}
function validateApiKey(apiKey) {
    if (!apiKey) {
        throw new types_1.BirthChartError('API key is required', 'AUTH_ERROR', { field: 'apiKey', message: 'API key must be provided in configuration' });
    }
    if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
        throw new types_1.BirthChartError('Invalid API key format', 'AUTH_ERROR', { field: 'apiKey', message: 'API key must be a non-empty string' });
    }
}
function validateConfig(config) {
    validateApiKey(config.apiKey);
    if (config.zodiacType && !['tropical', 'sidereal'].includes(config.zodiacType)) {
        throw new types_1.BirthChartError('Invalid zodiac type', 'CONFIG_ERROR', { field: 'zodiacType', message: 'Zodiac type must be either "tropical" or "sidereal"' });
    }
    if (config.houseSystem && !Object.values(types_1.HOUSE_SYSTEMS).includes(config.houseSystem)) {
        throw new types_1.BirthChartError('Invalid house system', 'CONFIG_ERROR', { field: 'houseSystem', message: 'Invalid house system specified' });
    }
    if (config.aspectOrbs) {
        const validAspects = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
        Object.entries(config.aspectOrbs).forEach(([aspect, orb]) => {
            if (!validAspects.includes(aspect)) {
                throw new types_1.BirthChartError('Invalid aspect orb configuration', 'CONFIG_ERROR', { field: `aspectOrbs.${aspect}`, message: 'Invalid aspect type' });
            }
            if (typeof orb !== 'number' || orb < 0 || orb > 15) {
                throw new types_1.BirthChartError('Invalid aspect orb value', 'CONFIG_ERROR', { field: `aspectOrbs.${aspect}`, message: 'Orb must be a number between 0 and 15' });
            }
        });
    }
}
