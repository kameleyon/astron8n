/**
 * Shared Data Models and Types
 *
 * This module contains type definitions that are shared between the web and mobile applications.
 */
export interface Database {
    public: {
        Tables: {
            user_profiles: {
                Row: {
                    id: string;
                    full_name: string;
                    birth_date: string;
                    birth_time: string | null;
                    birth_location: string | null;
                    latitude: number | null;
                    longitude: number | null;
                    has_unknown_birth_time: boolean;
                    timezone: string;
                    has_accepted_terms: boolean;
                    acknowledged: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    full_name: string;
                    birth_date: string;
                    birth_time?: string | null;
                    birth_location?: string | null;
                    latitude?: number | null;
                    longitude?: number | null;
                    has_unknown_birth_time?: boolean;
                    timezone: string;
                    has_accepted_terms?: boolean;
                    acknowledged?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            user_credits: {
                Row: {
                    id: string;
                    user_id: string;
                    total_credits: number;
                    used_credits: number;
                    rollover_credits: number | null;
                    is_subscriber: boolean;
                    subscription_start_date: string | null;
                    created_at: string;
                    updated_at: string;
                    trial_expiration_date: string | null;
                    next_payment_date: string | null;
                    subscription_end_date: string | null;
                    trial_end_date: string | null;
                    rollover_expiration_date: string | null;
                    stripe_subscription_id: string | null;
                };
                Insert: {
                    user_id: string;
                    total_credits?: number;
                    used_credits?: number;
                    rollover_credits?: number | null;
                    is_subscriber?: boolean;
                    subscription_start_date?: string | null;
                    created_at?: string;
                    updated_at?: string;
                    trial_expiration_date?: string | null;
                    next_payment_date?: string | null;
                    subscription_end_date?: string | null;
                    trial_end_date?: string | null;
                    rollover_expiration_date?: string | null;
                    stripe_subscription_id?: string | null;
                };
            };
        };
    };
}
export type ZodiacSign = "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo" | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";
export type PlanetName = "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn" | "Uranus" | "Neptune" | "Pluto" | "NorthNode" | "SouthNode" | "Chiron";
export interface Position {
    longitude: number;
    latitude: number;
    distance: number;
    longitudeSpeed: number;
    sign: ZodiacSign;
    retrograde: boolean;
    formatted: string;
}
export interface PlanetPosition extends Position {
    house?: number;
}
export interface HouseData {
    cusp: number;
    sign: ZodiacSign;
    formatted: string;
}
export interface AspectData {
    planet1: string;
    planet2: string;
    aspect: string;
    angle: number;
    orb: number;
}
export interface PatternPlanetData {
    name: string;
    sign: ZodiacSign;
    degree: string;
    longitude: number;
    position?: string;
}
export interface PatternVisualization {
    type: string;
    color?: string;
    points: Array<{
        x: number;
        y: number;
        planet: PatternPlanetData;
    }>;
}
export interface PatternData {
    name: string;
    planets: PatternPlanetData[];
    description: string;
    visualization?: PatternVisualization;
}
export interface SpecialFeature {
    description: string;
    category: 'moon' | 'planets' | 'chart' | 'aspects';
}
export interface BirthChartData {
    name: string;
    location: string;
    date: string;
    time: string;
    planets: Array<PlanetPosition & {
        name: string;
    }>;
    houses: Record<string, HouseData>;
    aspects: AspectData[];
    patterns: PatternData[];
    features: SpecialFeature[];
    ascendant: Position;
    midheaven: Position;
}
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}
export interface ChatSession {
    id: string;
    userId: string;
    title: string;
    messages: ChatMessage[];
    createdAt: string;
    updatedAt: string;
}
export interface OpenRouterPayload {
    model: string;
    messages: {
        role: string;
        content: string;
    }[];
    temperature: number;
    max_tokens: number;
}
export interface UserCredits {
    id: string;
    userId: string;
    totalCredits: number;
    usedCredits: number;
    rolloverCredits: number | null;
    isSubscriber: boolean;
    subscriptionStartDate: string | null;
    trialExpirationDate: string | null;
    nextPaymentDate: string | null;
    subscriptionEndDate: string | null;
}
export interface CreditUpdateResult {
    success: boolean;
    error?: string;
    remainingCredits?: number;
}
