/**
 * Shared Constants
 *
 * This module contains constants that are shared between the web and mobile applications.
 */
/**
 * Base API URL for production
 */
export declare const API_BASE_URL = "https://api.astrogenie.com";
/**
 * Base API URL for development
 */
export declare const DEV_API_BASE_URL = "http://localhost:3000";
/**
 * API endpoints
 */
export declare const API_ENDPOINTS: {
    BIRTH_CHART: string;
    CHAT: string;
    USER_PROFILE: string;
    CREDITS: string;
    SUBSCRIPTION: string;
    LOCATION_SEARCH: string;
    REPORTS: string;
};
/**
 * OpenRouter API URL
 */
export declare const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
/**
 * Zodiac signs
 */
export declare const ZODIAC_SIGNS: string[];
/**
 * Planets
 */
export declare const PLANETS: string[];
/**
 * Aspects
 */
export declare const ASPECTS: {
    CONJUNCTION: {
        name: string;
        angle: number;
        orb: number;
        symbol: string;
    };
    SEXTILE: {
        name: string;
        angle: number;
        orb: number;
        symbol: string;
    };
    SQUARE: {
        name: string;
        angle: number;
        orb: number;
        symbol: string;
    };
    TRINE: {
        name: string;
        angle: number;
        orb: number;
        symbol: string;
    };
    OPPOSITION: {
        name: string;
        angle: number;
        orb: number;
        symbol: string;
    };
};
/**
 * House systems
 */
export declare const HOUSE_SYSTEMS: {
    PLACIDUS: string;
    KOCH: string;
    EQUAL: string;
    WHOLE_SIGN: string;
    REGIOMONTANUS: string;
    CAMPANUS: string;
    TOPOCENTRIC: string;
};
/**
 * Theme colors
 */
export declare const COLORS: {
    PRIMARY: string;
    SECONDARY: string;
    ACCENT: string;
    BACKGROUND: string;
    TEXT: string;
    ERROR: string;
    SUCCESS: string;
    WARNING: string;
    INFO: string;
};
/**
 * Planet colors for charts
 */
export declare const PLANET_COLORS: {
    Sun: string;
    Moon: string;
    Mercury: string;
    Venus: string;
    Mars: string;
    Jupiter: string;
    Saturn: string;
    Uranus: string;
    Neptune: string;
    Pluto: string;
    NorthNode: string;
    SouthNode: string;
    Chiron: string;
};
/**
 * Zodiac sign colors
 */
export declare const SIGN_COLORS: {
    Aries: string;
    Taurus: string;
    Gemini: string;
    Cancer: string;
    Leo: string;
    Virgo: string;
    Libra: string;
    Scorpio: string;
    Sagittarius: string;
    Capricorn: string;
    Aquarius: string;
    Pisces: string;
};
/**
 * Font sizes
 */
export declare const FONT_SIZES: {
    SMALL: number;
    MEDIUM: number;
    LARGE: number;
    XLARGE: number;
    XXLARGE: number;
};
/**
 * Spacing values
 */
export declare const SPACING: {
    XSMALL: number;
    SMALL: number;
    MEDIUM: number;
    LARGE: number;
    XLARGE: number;
    XXLARGE: number;
};
/**
 * Feature flags
 */
export declare const FEATURES: {
    ENABLE_TRANSIT_CHARTS: boolean;
    ENABLE_COMPATIBILITY_CHARTS: boolean;
    ENABLE_CHAT: boolean;
    ENABLE_REPORTS: boolean;
    ENABLE_HUMAN_DESIGN: boolean;
    ENABLE_NUMEROLOGY: boolean;
    ENABLE_OFFLINE_MODE: boolean;
    ENABLE_PUSH_NOTIFICATIONS: boolean;
};
/**
 * Environment-specific feature flags
 */
export declare const DEV_FEATURES: {
    ENABLE_DEBUG_MODE: boolean;
    ENABLE_MOCK_DATA: boolean;
    ENABLE_TRANSIT_CHARTS: boolean;
    ENABLE_COMPATIBILITY_CHARTS: boolean;
    ENABLE_CHAT: boolean;
    ENABLE_REPORTS: boolean;
    ENABLE_HUMAN_DESIGN: boolean;
    ENABLE_NUMEROLOGY: boolean;
    ENABLE_OFFLINE_MODE: boolean;
    ENABLE_PUSH_NOTIFICATIONS: boolean;
};
export declare const PROD_FEATURES: {
    ENABLE_DEBUG_MODE: boolean;
    ENABLE_MOCK_DATA: boolean;
    ENABLE_TRANSIT_CHARTS: boolean;
    ENABLE_COMPATIBILITY_CHARTS: boolean;
    ENABLE_CHAT: boolean;
    ENABLE_REPORTS: boolean;
    ENABLE_HUMAN_DESIGN: boolean;
    ENABLE_NUMEROLOGY: boolean;
    ENABLE_OFFLINE_MODE: boolean;
    ENABLE_PUSH_NOTIFICATIONS: boolean;
};
/**
 * Error messages
 */
export declare const ERROR_MESSAGES: {
    NETWORK_ERROR: string;
    SERVER_ERROR: string;
    AUTHENTICATION_ERROR: string;
    PERMISSION_ERROR: string;
    VALIDATION_ERROR: string;
    NOT_FOUND_ERROR: string;
    TIMEOUT_ERROR: string;
    UNKNOWN_ERROR: string;
    INSUFFICIENT_CREDITS: string;
    INVALID_COORDINATES: string;
    INVALID_DATE: string;
    INVALID_TIME: string;
};
