// Mock shared package for mobile app

// Error Messages
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

// API Endpoints
export const API_ENDPOINTS = {
  BIRTH_CHART: '/api/birth-chart',
  CHAT: '/api/chat',
  USER_PROFILE: '/api/user-profile',
  CREDITS: '/api/credits',
  SUBSCRIPTION: '/api/subscription',
  LOCATION_SEARCH: '/api/location',
  REPORTS: '/api/reports',
};

// Utility Functions
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

export function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export function isValidTime(timeStr: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(timeStr);
}

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

// Types
export interface UserProfile {
  id: string;
  full_name: string;
  birth_date: string;
  birth_time: string | null;
  birth_location: string | null;
  timezone: string;
  email: string;
  avatar_url: string | null;
}

export interface CreditUpdateResult {
  success: boolean;
  error?: string;
  remainingCredits?: number;
}
