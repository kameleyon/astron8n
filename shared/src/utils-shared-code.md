# Shared Utility Functions

This document outlines the utility functions that can be shared between the web and mobile applications.

## Date and Time Utilities

Functions for handling dates, times, and timezones:

```typescript
/**
 * Formats a date string to a consistent format
 * @param dateStr Date string in various formats
 * @returns Formatted date string (YYYY-MM-DD)
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

/**
 * Formats a time string to a consistent format
 * @param timeStr Time string in various formats
 * @returns Formatted time string (HH:MM)
 */
export function formatTime(timeStr: string): string {
  // Implementation
}

/**
 * Gets the timezone for a given latitude and longitude
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Timezone string (e.g., "America/New_York")
 */
export async function getTimezone(latitude: number, longitude: number): Promise<string> {
  // Implementation using a timezone lookup library
}

/**
 * Converts local time to UTC
 * @param date Date string
 * @param time Time string
 * @param timezone Timezone string
 * @returns UTC date and time
 */
export function toUTC(date: string, time: string, timezone: string): Date {
  // Implementation
}
```

## Validation Utilities

Functions for validating user input:

```typescript
/**
 * Validates a date string
 * @param dateStr Date string to validate
 * @returns Boolean indicating if the date is valid
 */
export function isValidDate(dateStr: string): boolean {
  // Implementation
}

/**
 * Validates a time string
 * @param timeStr Time string to validate
 * @returns Boolean indicating if the time is valid
 */
export function isValidTime(timeStr: string): boolean {
  // Implementation
}

/**
 * Validates coordinates
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Boolean indicating if the coordinates are valid
 */
export function isValidCoordinates(latitude: number, longitude: number): boolean {
  return (
    !isNaN(latitude) && 
    !isNaN(longitude) && 
    latitude >= -90 && 
    latitude <= 90 && 
    longitude >= -180 && 
    longitude <= 180
  );
}
```

## Formatting Utilities

Functions for formatting data for display:

```typescript
/**
 * Formats a decimal degree to degrees, minutes, and seconds
 * @param decimal Decimal degree
 * @returns Formatted string (e.g., "15° 30' 45\"")
 */
export function formatDegree(decimal: number): string {
  const degrees = Math.floor(decimal);
  const minutesDecimal = (decimal - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = Math.floor((minutesDecimal - minutes) * 60);
  
  return `${degrees}° ${minutes}' ${seconds}"`;
}

/**
 * Formats a zodiac position
 * @param longitude Longitude in degrees
 * @returns Formatted string (e.g., "15° Aries")
 */
export function formatZodiacPosition(longitude: number): string {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const signIndex = Math.floor(longitude / 30) % 12;
  const degree = Math.floor(longitude % 30);
  
  return `${degree}° ${signs[signIndex]}`;
}
```

## Calculation Utilities

Functions for common calculations:

```typescript
/**
 * Calculates the angular distance between two points on a circle
 * @param angle1 First angle in degrees
 * @param angle2 Second angle in degrees
 * @returns Angular distance in degrees
 */
export function angularDistance(angle1: number, angle2: number): number {
  const diff = Math.abs(angle1 - angle2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Normalizes an angle to the range [0, 360)
 * @param angle Angle in degrees
 * @returns Normalized angle in degrees
 */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}
```

## Error Handling Utilities

Functions for consistent error handling:

```typescript
/**
 * Creates a standardized error object
 * @param code Error code
 * @param message Error message
 * @param details Additional error details
 * @returns Standardized error object
 */
export function createError(code: string, message: string, details?: any): any {
  return {
    code,
    message,
    details,
    timestamp: new Date().toISOString()
  };
}

/**
 * Handles API errors consistently
 * @param error Error object
 * @returns Standardized error response
 */
export function handleApiError(error: any): any {
  // Log the error
  console.error('API Error:', error);
  
  // Determine error type
  if (error.message?.includes('network')) {
    return createError('NETWORK_ERROR', 'Network connection error');
  }
  
  if (error.message?.includes('timeout')) {
    return createError('TIMEOUT_ERROR', 'Request timed out');
  }
  
  // Default error
  return createError(
    'UNKNOWN_ERROR',
    'An unexpected error occurred',
    error.message
  );
}
```

## Platform Detection Utilities

Functions for detecting the current platform:

```typescript
/**
 * Determines if the code is running on the web platform
 * @returns Boolean indicating if running on web
 */
export function isWeb(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Determines if the code is running on React Native
 * @returns Boolean indicating if running on React Native
 */
export function isReactNative(): boolean {
  return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
}

/**
 * Gets the current platform
 * @returns Platform string ('web', 'ios', 'android', or 'unknown')
 */
export function getPlatform(): string {
  if (!isWeb() && !isReactNative()) {
    return 'unknown';
  }
  
  if (isReactNative()) {
    // React Native-specific platform detection
    return 'ios'; // or 'android'
  }
  
  return 'web';
}
```

## Implementation Strategy

1. Move utility functions to the shared package
2. Organize utilities by domain (date/time, validation, formatting, etc.)
3. Ensure functions work consistently across platforms
4. Add comprehensive unit tests for each utility function

## Usage Example

```typescript
import { 
  formatDate,
  isValidCoordinates,
  formatZodiacPosition,
  handleApiError
} from '@astrogenie/shared';

// Format a date
const formattedDate = formatDate('2025-03-04');

// Validate coordinates
const validCoords = isValidCoordinates(40.7128, -74.0060);

// Format a zodiac position
const position = formatZodiacPosition(45.5);

// Handle an API error
try {
  // API call
} catch (error) {
  const standardError = handleApiError(error);
  // Handle standardized error
}
```

This approach ensures consistent utility functions across both web and mobile platforms.
