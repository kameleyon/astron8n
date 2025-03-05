# Shared Data Models and Types

This document outlines the data models and types that can be shared between the web and mobile applications.

## Database Types

The database type definitions in `lib/database.types.ts` provide TypeScript interfaces for the Supabase database schema:

```typescript
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string
          birth_date: string
          birth_time: string | null
          birth_location: string | null
          latitude: number | null
          longitude: number | null
          has_unknown_birth_time: boolean
          timezone: string
          has_accepted_terms: boolean
          acknowledged: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          birth_date: string
          birth_time?: string | null
          birth_location?: string | null
          latitude?: number | null
          longitude?: number | null
          has_unknown_birth_time?: boolean
          timezone: string
          has_accepted_terms?: boolean
          acknowledged?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_credits: {
        Row: {
          id: string
          user_id: string
          total_credits: number
          used_credits: number
          rollover_credits: number | null
          is_subscriber: boolean
          subscription_start_date: string | null
          created_at: string
          updated_at: string
          trial_expiration_date: string | null
          next_payment_date: string | null
          subscription_end_date: string | null
          trial_end_date: string | null
          rollover_expiration_date: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          user_id: string
          total_credits?: number
          used_credits?: number
          rollover_credits?: number | null
          is_subscriber?: boolean
          subscription_start_date?: string | null
          created_at?: string
          updated_at?: string
          trial_expiration_date?: string | null
          next_payment_date?: string | null
          subscription_end_date?: string | null
          trial_end_date?: string | null
          rollover_expiration_date?: string | null
          stripe_subscription_id?: string | null
        }
      }
      // Other tables...
    }
  }
}
```

## Astrology Types

The astrology type definitions in `birthchartpack/lib/types/birth-chart.ts` define the data structures for birth chart calculations:

```typescript
export type ZodiacSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces"

export type PlanetName =
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune"
  | "Pluto"
  | "NorthNode"
  | "SouthNode"
  | "Chiron"

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

export interface BirthChartData {
  name: string;
  location: string;
  date: string;
  time: string;
  planets: Array<PlanetPosition & { name: string }>;
  houses: Record<string, HouseData>;
  aspects: AspectData[];
  patterns: PatternData[];
  features: SpecialFeature[];
  ascendant: Position;
  midheaven: Position;
}
```

## Chat Types

The chat type definitions in `types/chat.ts` define the data structures for chat functionality:

```typescript
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
```

## Credits Types

The credits type definitions in `types/credits.ts` define the data structures for user credits:

```typescript
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
```

## Implementation Strategy

1. Move all type definitions to the shared package
2. Organize types by domain (database, astrology, chat, credits, etc.)
3. Ensure consistent naming conventions across all types
4. Add JSDoc comments for better documentation

## Usage Example

```typescript
// Import types from shared package
import { 
  Database,
  BirthChartData,
  ChatMessage,
  UserCredits
} from '@astrogenie/shared';

// Type-safe database access
const getUserProfile = async (userId: string): Promise<Database['public']['Tables']['user_profiles']['Row'] | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

// Type-safe birth chart data
const renderBirthChart = (data: BirthChartData) => {
  // Render birth chart with type safety
};

// Type-safe chat messages
const addMessage = (message: ChatMessage) => {
  // Add message to chat with type safety
};

// Type-safe credits management
const updateCredits = (credits: UserCredits) => {
  // Update credits with type safety
};
```

This approach ensures type safety and consistency across both web and mobile platforms.
