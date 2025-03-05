/**
 * Shared Utility Functions
 *
 * This module contains utility functions that are shared between the web and mobile applications.
 */
// Date and Time Utilities
/**
 * Formats a date string to a consistent format
 * @param dateStr Date string in various formats
 * @returns Formatted date string (YYYY-MM-DD)
 */
export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
}
/**
 * Formats a time string to a consistent format
 * @param timeStr Time string in various formats
 * @returns Formatted time string (HH:MM)
 */
export function formatTime(timeStr) {
    // Simple implementation - would be expanded with actual code
    const [hours, minutes] = timeStr.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}
/**
 * Gets the timezone for a given latitude and longitude
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Timezone string (e.g., "America/New_York")
 */
export async function getTimezone(latitude, longitude) {
    // This is a placeholder function that will be implemented with actual code
    console.log('Getting timezone for:', { latitude, longitude });
    return 'America/New_York'; // Default placeholder
}
// Validation Utilities
/**
 * Validates a date string
 * @param dateStr Date string to validate
 * @returns Boolean indicating if the date is valid
 */
export function isValidDate(dateStr) {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}
/**
 * Validates a time string
 * @param timeStr Time string to validate
 * @returns Boolean indicating if the time is valid
 */
export function isValidTime(timeStr) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(timeStr);
}
/**
 * Validates coordinates
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Boolean indicating if the coordinates are valid
 */
export function isValidCoordinates(latitude, longitude) {
    return (!isNaN(latitude) &&
        !isNaN(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180);
}
// Formatting Utilities
/**
 * Formats a decimal degree to degrees, minutes, and seconds
 * @param decimal Decimal degree
 * @returns Formatted string (e.g., "15° 30' 45\"")
 */
export function formatDegree(decimal) {
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
export function formatZodiacPosition(longitude) {
    const signs = [
        "Aries", "Taurus", "Gemini", "Cancer",
        "Leo", "Virgo", "Libra", "Scorpio",
        "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];
    const signIndex = Math.floor(longitude / 30) % 12;
    const degree = Math.floor(longitude % 30);
    return `${degree}° ${signs[signIndex]}`;
}
// Calculation Utilities
/**
 * Calculates the angular distance between two points on a circle
 * @param angle1 First angle in degrees
 * @param angle2 Second angle in degrees
 * @returns Angular distance in degrees
 */
export function angularDistance(angle1, angle2) {
    const diff = Math.abs(angle1 - angle2) % 360;
    return diff > 180 ? 360 - diff : diff;
}
/**
 * Normalizes an angle to the range [0, 360)
 * @param angle Angle in degrees
 * @returns Normalized angle in degrees
 */
export function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
}
// Error Handling Utilities
/**
 * Creates a standardized error object
 * @param code Error code
 * @param message Error message
 * @param details Additional error details
 * @returns Standardized error object
 */
export function createError(code, message, details) {
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
export function handleApiError(error) {
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
    return createError('UNKNOWN_ERROR', 'An unexpected error occurred', error.message);
}
// Platform Detection Utilities
/**
 * Determines if the code is running on the web platform
 * @returns Boolean indicating if running on web
 */
export function isWeb() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}
/**
 * Determines if the code is running on React Native
 * @returns Boolean indicating if running on React Native
 */
export function isReactNative() {
    return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
}
import { supabase } from "../api";
export async function updateUserCredits(userId, tokensUsed) {
    try {
        // Get current user credits
        const { data: creditData, error: fetchError } = await supabase
            .from('user_credits')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (fetchError)
            throw fetchError;
        if (!creditData)
            throw new Error('No credit record found');
        // Check if user has enough credits
        if (creditData.total_credits - creditData.used_credits < tokensUsed) {
            return {
                success: false,
                error: 'Insufficient credits',
                remainingCredits: creditData.total_credits - creditData.used_credits
            };
        }
        // Update used credits
        const { error: updateError } = await supabase
            .from('user_credits')
            .update({
            used_credits: creditData.used_credits + tokensUsed
        })
            .eq('user_id', userId);
        if (updateError)
            throw updateError;
        return {
            success: true,
            remainingCredits: creditData.total_credits - (creditData.used_credits + tokensUsed)
        };
    }
    catch (error) {
        console.error('Error updating credits:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update credits'
        };
    }
}
export async function checkUserCredits(userId) {
    try {
        const { data: creditData, error } = await supabase
            .from('user_credits')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error)
            throw error;
        if (!creditData)
            throw new Error('No credit record found');
        const remainingCredits = creditData.total_credits - creditData.used_credits;
        const hasCredits = remainingCredits > 0;
        // Check if trial has expired
        if (creditData.trial_end_date) {
            const trialEndDate = new Date(creditData.trial_end_date);
            if (trialEndDate < new Date()) {
                // If trial expired and user is not a subscriber, they can't use credits
                if (!creditData.is_subscriber) {
                    return {
                        hasCredits: false,
                        remainingCredits: 0,
                        error: 'Trial period has expired'
                    };
                }
            }
        }
        return {
            hasCredits,
            remainingCredits,
            error: hasCredits ? undefined : 'No credits remaining'
        };
    }
    catch (error) {
        console.error('Error checking credits:', error);
        return {
            hasCredits: false,
            error: error instanceof Error ? error.message : 'Failed to check credits'
        };
    }
}
/**
 * Gets the current platform
 * @returns Platform string ('web', 'ios', 'android', or 'unknown')
 */
export function getPlatform() {
    if (!isWeb() && !isReactNative()) {
        return 'unknown';
    }
    if (isReactNative()) {
        // This is a placeholder - would be expanded with actual platform detection
        return 'ios'; // or 'android'
    }
    return 'web';
}
