/**
 * API Client Functions
 *
 * This module contains API client functions for interacting with backend services.
 * These functions are shared between the web and mobile applications.
 */
import { Database } from '../types';
export declare const createSupabaseClient: () => import("@supabase/supabase-js").SupabaseClient<Database, "public", any>;
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", any>;
import { PlanetName, ZodiacSign } from "../types";
export declare function generateAIResponse(messages: {
    role: string;
    content: string;
}[], userId: string, userProfile?: {
    birth_date?: string;
    birth_time?: string;
    birth_location?: string;
    birth_chart?: {
        planets?: Record<PlanetName, {
            sign: ZodiacSign;
            degree: number;
            house: number;
        }>;
        transits?: {
            current_planets?: Record<PlanetName, {
                sign: ZodiacSign;
                degree: number;
            }>;
            aspects?: Array<{
                planet1: string;
                planet2: string;
                aspect: string;
                orb: number;
            }>;
        };
    };
    human_design?: {
        life_path?: string;
        type?: string;
        authority?: string;
        profile?: string;
        definition?: string;
    };
    birth_card?: {
        card: string;
        meaning?: string;
        position?: string;
    };
}): Promise<{
    content: any;
    tokensUsed: any;
    remainingCredits: number | undefined;
}>;
