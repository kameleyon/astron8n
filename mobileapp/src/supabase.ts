import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default values for development
const DEFAULT_SUPABASE_URL = "https://xyzcompany.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdGt4cWZqYnZpaWpveGJwYWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI5NjQwMDAsImV4cCI6MTk5ODU0MDAwMH0.example";

// Get values from environment or use defaults
const supabaseUrl = DEFAULT_SUPABASE_URL;
const supabaseAnonKey = DEFAULT_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
