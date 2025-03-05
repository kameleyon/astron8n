# API Client Shared Code

This document outlines the API client functions that can be shared between the web and mobile applications.

## Core API Client Functions

### 1. Supabase Integration

The Supabase client configuration in `lib/supabase.ts` can be shared with adaptations:

```typescript
// Web version (Next.js)
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

```typescript
// Mobile version (React Native)
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from './database.types';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### 2. User Credits Management

The credit management functions in `lib/utils/credits.ts` can be shared:

- `updateUserCredits`: Updates a user's credit count after usage
- `checkUserCredits`: Checks if a user has enough credits

These functions interact with the Supabase database and can be used on both platforms.

### 3. OpenRouter API Integration

The OpenRouter API client in `lib/openrouter.ts` can be shared with adaptations for environment variables:

- `generateAIResponse`: Generates AI responses using the OpenRouter API
- `getAstrologicalTransits`: Gets astrological transit information

### 4. Database Types

The database type definitions in `lib/database.types.ts` should be shared to ensure consistency:

```typescript
export interface Database {
  public: {
    Tables: {
      user_profiles: { ... },
      user_credits: { ... },
      // Other tables
    }
  }
}
```

## Platform-Specific Adaptations

### Web-Specific

- Server-side API routes for secure operations
- Next.js-specific environment variable handling
- Server-side rendering considerations

### Mobile-Specific

- Secure storage for API keys and tokens
- Offline caching strategies
- Mobile-specific error handling and retry logic

## Implementation Strategy

1. Move the core API client functions to the shared package
2. Create environment-specific configuration wrappers
3. Implement platform-specific authentication handling
4. Ensure consistent error handling across platforms

## API Design

The shared package should expose a clean API for common operations:

```typescript
// Example API
import { 
  supabase, 
  updateUserCredits, 
  checkUserCredits,
  generateAIResponse 
} from '@astrogenie/shared';

// Authentication
const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

// User profile
const getUserProfile = async (userId) => {
  return await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
};

// Credits management
const checkCredits = async (userId) => {
  return await checkUserCredits(userId);
};

// AI generation
const generateResponse = async (messages, userId, userProfile) => {
  return await generateAIResponse(messages, userId, userProfile);
};
```

## Error Handling

Consistent error handling is crucial across platforms:

```typescript
try {
  const result = await apiFunction();
  // Handle success
} catch (error) {
  if (error.message.includes('credits')) {
    // Handle credit-related errors
  } else if (error.message.includes('auth')) {
    // Handle authentication errors
  } else {
    // Handle general errors
  }
}
```

This approach ensures that error handling is consistent regardless of platform.
