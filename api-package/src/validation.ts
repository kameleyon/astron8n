import { BirthChartInput, ValidationError, BirthChartError, HOUSE_SYSTEMS } from './types';

export function validateInput(input: BirthChartInput): void {
  const errors: ValidationError[] = [];

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
  } else {
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
  } else {
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
    throw new BirthChartError(
      'Invalid input data',
      'VALIDATION_ERROR',
      errors
    );
  }
}

export function validateApiKey(apiKey: string | undefined): void {
  if (!apiKey) {
    throw new BirthChartError(
      'API key is required',
      'AUTH_ERROR',
      { field: 'apiKey', message: 'API key must be provided in configuration' }
    );
  }

  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new BirthChartError(
      'Invalid API key format',
      'AUTH_ERROR',
      { field: 'apiKey', message: 'API key must be a non-empty string' }
    );
  }
}

export function validateConfig(config: any): void {
  validateApiKey(config.apiKey);

  if (config.zodiacType && !['tropical', 'sidereal'].includes(config.zodiacType)) {
    throw new BirthChartError(
      'Invalid zodiac type',
      'CONFIG_ERROR',
      { field: 'zodiacType', message: 'Zodiac type must be either "tropical" or "sidereal"' }
    );
  }

  if (config.houseSystem && !Object.values(HOUSE_SYSTEMS).includes(config.houseSystem)) {
    throw new BirthChartError(
      'Invalid house system',
      'CONFIG_ERROR',
      { field: 'houseSystem', message: 'Invalid house system specified' }
    );
  }

  if (config.aspectOrbs) {
    const validAspects = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
    Object.entries(config.aspectOrbs).forEach(([aspect, orb]) => {
      if (!validAspects.includes(aspect)) {
        throw new BirthChartError(
          'Invalid aspect orb configuration',
          'CONFIG_ERROR',
          { field: `aspectOrbs.${aspect}`, message: 'Invalid aspect type' }
        );
      }
      if (typeof orb !== 'number' || orb < 0 || orb > 15) {
        throw new BirthChartError(
          'Invalid aspect orb value',
          'CONFIG_ERROR',
          { field: `aspectOrbs.${aspect}`, message: 'Orb must be a number between 0 and 15' }
        );
      }
    });
  }
}
