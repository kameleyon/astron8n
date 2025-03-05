/**
 * Shared Utility Functions
 *
 * This module contains utility functions that are shared between the web and mobile applications.
 */
/**
 * Formats a date string to a consistent format
 * @param dateStr Date string in various formats
 * @returns Formatted date string (YYYY-MM-DD)
 */
export declare function formatDate(dateStr: string): string;
/**
 * Formats a time string to a consistent format
 * @param timeStr Time string in various formats
 * @returns Formatted time string (HH:MM)
 */
export declare function formatTime(timeStr: string): string;
/**
 * Gets the timezone for a given latitude and longitude
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Timezone string (e.g., "America/New_York")
 */
export declare function getTimezone(latitude: number, longitude: number): Promise<string>;
/**
 * Validates a date string
 * @param dateStr Date string to validate
 * @returns Boolean indicating if the date is valid
 */
export declare function isValidDate(dateStr: string): boolean;
/**
 * Validates a time string
 * @param timeStr Time string to validate
 * @returns Boolean indicating if the time is valid
 */
export declare function isValidTime(timeStr: string): boolean;
/**
 * Validates coordinates
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Boolean indicating if the coordinates are valid
 */
export declare function isValidCoordinates(latitude: number, longitude: number): boolean;
/**
 * Formats a decimal degree to degrees, minutes, and seconds
 * @param decimal Decimal degree
 * @returns Formatted string (e.g., "15° 30' 45\"")
 */
export declare function formatDegree(decimal: number): string;
/**
 * Formats a zodiac position
 * @param longitude Longitude in degrees
 * @returns Formatted string (e.g., "15° Aries")
 */
export declare function formatZodiacPosition(longitude: number): string;
/**
 * Calculates the angular distance between two points on a circle
 * @param angle1 First angle in degrees
 * @param angle2 Second angle in degrees
 * @returns Angular distance in degrees
 */
export declare function angularDistance(angle1: number, angle2: number): number;
/**
 * Normalizes an angle to the range [0, 360)
 * @param angle Angle in degrees
 * @returns Normalized angle in degrees
 */
export declare function normalizeAngle(angle: number): number;
/**
 * Creates a standardized error object
 * @param code Error code
 * @param message Error message
 * @param details Additional error details
 * @returns Standardized error object
 */
export declare function createError(code: string, message: string, details?: any): any;
/**
 * Handles API errors consistently
 * @param error Error object
 * @returns Standardized error response
 */
export declare function handleApiError(error: any): any;
/**
 * Determines if the code is running on the web platform
 * @returns Boolean indicating if running on web
 */
export declare function isWeb(): boolean;
/**
 * Determines if the code is running on React Native
 * @returns Boolean indicating if running on React Native
 */
export declare function isReactNative(): boolean;
import { CreditUpdateResult } from "../types";
export declare function updateUserCredits(userId: string, tokensUsed: number): Promise<CreditUpdateResult>;
export declare function checkUserCredits(userId: string): Promise<{
    hasCredits: boolean;
    remainingCredits?: number;
    error?: string;
}>;
/**
 * Gets the current platform
 * @returns Platform string ('web', 'ios', 'android', or 'unknown')
 */
export declare function getPlatform(): string;
