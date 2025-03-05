# Shared Constants

This document outlines the constants that can be shared between the web and mobile applications.

## API Endpoints

Constants for API endpoints:

```typescript
/**
 * Base API URL for production
 */
export const API_BASE_URL = 'https://api.astrogenie.com';

/**
 * Base API URL for development
 */
export const DEV_API_BASE_URL = 'http://localhost:3000';

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  BIRTH_CHART: '/api/birth-chart',
  CHAT: '/api/chat',
  USER_PROFILE: '/api/user-profile',
  CREDITS: '/api/credits',
  SUBSCRIPTION: '/api/subscription',
  LOCATION_SEARCH: '/api/location',
  REPORTS: '/api/reports',
};

/**
 * OpenRouter API URL
 */
export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
```

## Astrological Constants

Constants for astrological calculations:

```typescript
/**
 * Zodiac signs
 */
export const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

/**
 * Planets
 */
export const PLANETS = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
  'NorthNode',
  'SouthNode',
  'Chiron',
];

/**
 * Aspects
 */
export const ASPECTS = {
  CONJUNCTION: {
    name: 'Conjunction',
    angle: 0,
    orb: 8,
    symbol: '☌',
  },
  SEXTILE: {
    name: 'Sextile',
    angle: 60,
    orb: 6,
    symbol: '⚹',
  },
  SQUARE: {
    name: 'Square',
    angle: 90,
    orb: 8,
    symbol: '□',
  },
  TRINE: {
    name: 'Trine',
    angle: 120,
    orb: 8,
    symbol: '△',
  },
  OPPOSITION: {
    name: 'Opposition',
    angle: 180,
    orb: 8,
    symbol: '☍',
  },
};

/**
 * House systems
 */
export const HOUSE_SYSTEMS = {
  PLACIDUS: 'P',
  KOCH: 'K',
  EQUAL: 'E',
  WHOLE_SIGN: 'W',
  REGIOMONTANUS: 'R',
  CAMPANUS: 'C',
  TOPOCENTRIC: 'T',
};
```

## UI Constants

Constants for UI elements:

```typescript
/**
 * Theme colors
 */
export const COLORS = {
  PRIMARY: '#0d0630',
  SECONDARY: '#5c5c8a',
  ACCENT: '#9370DB',
  BACKGROUND: '#f8f9fa',
  TEXT: '#333333',
  ERROR: '#dc3545',
  SUCCESS: '#28a745',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
};

/**
 * Planet colors for charts
 */
export const PLANET_COLORS = {
  Sun: '#FFA500',
  Moon: '#SILVER',
  Mercury: '#9932CC',
  Venus: '#FF69B4',
  Mars: '#FF0000',
  Jupiter: '#4B0082',
  Saturn: '#708090',
  Uranus: '#00FFFF',
  Neptune: '#0000FF',
  Pluto: '#8B0000',
  NorthNode: '#006400',
  SouthNode: '#8B4513',
  Chiron: '#FF7F50',
};

/**
 * Zodiac sign colors
 */
export const SIGN_COLORS = {
  Aries: '#FF5733',
  Taurus: '#8B4513',
  Gemini: '#FFFF00',
  Cancer: '#SILVER',
  Leo: '#FFA500',
  Virgo: '#228B22',
  Libra: '#87CEEB',
  Scorpio: '#8B0000',
  Sagittarius: '#9370DB',
  Capricorn: '#708090',
  Aquarius: '#00FFFF',
  Pisces: '#0000FF',
};

/**
 * Font sizes
 */
export const FONT_SIZES = {
  SMALL: 12,
  MEDIUM: 16,
  LARGE: 20,
  XLARGE: 24,
  XXLARGE: 32,
};

/**
 * Spacing values
 */
export const SPACING = {
  XSMALL: 4,
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
  XXLARGE: 48,
};
```

## Feature Flags

Constants for feature flags:

```typescript
/**
 * Feature flags
 */
export const FEATURES = {
  ENABLE_TRANSIT_CHARTS: true,
  ENABLE_COMPATIBILITY_CHARTS: true,
  ENABLE_CHAT: true,
  ENABLE_REPORTS: true,
  ENABLE_HUMAN_DESIGN: true,
  ENABLE_NUMEROLOGY: false,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_PUSH_NOTIFICATIONS: false,
};

/**
 * Environment-specific feature flags
 */
export const DEV_FEATURES = {
  ...FEATURES,
  ENABLE_DEBUG_MODE: true,
  ENABLE_MOCK_DATA: true,
};

export const PROD_FEATURES = {
  ...FEATURES,
  ENABLE_DEBUG_MODE: false,
  ENABLE_MOCK_DATA: false,
};
```

## Error Messages

Constants for error messages:

```typescript
/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  AUTHENTICATION_ERROR: 'Authentication error. Please sign in again.',
  PERMISSION_ERROR: 'You do not have permission to access this resource.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND_ERROR: 'The requested resource was not found.',
  TIMEOUT_ERROR: 'The request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again later.',
  INSUFFICIENT_CREDITS: 'You do not have enough credits to perform this action.',
  INVALID_COORDINATES: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.',
  INVALID_DATE: 'Invalid date format. Please use YYYY-MM-DD format.',
  INVALID_TIME: 'Invalid time format. Please use 24-hour format (HH:MM).',
};
```

## Implementation Strategy

1. Move constants to the shared package
2. Organize constants by domain (API, astrology, UI, etc.)
3. Create platform-specific overrides where necessary
4. Use environment variables for sensitive values

## Usage Example

```typescript
import { 
  API_ENDPOINTS,
  ZODIAC_SIGNS,
  COLORS,
  FEATURES,
  ERROR_MESSAGES
} from '@astrogenie/shared';

// API endpoint
const birthChartEndpoint = API_ENDPOINTS.BIRTH_CHART;

// Zodiac sign
const firstSign = ZODIAC_SIGNS[0]; // 'Aries'

// Theme color
const primaryColor = COLORS.PRIMARY;

// Feature flag
if (FEATURES.ENABLE_TRANSIT_CHARTS) {
  // Enable transit chart feature
}

// Error message
const errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
```

This approach ensures consistent constants across both web and mobile platforms.
